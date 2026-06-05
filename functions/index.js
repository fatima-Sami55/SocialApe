import * as functions from 'firebase-functions/v2';
import { defineSecret } from 'firebase-functions/params';
import express from 'express';
import cors from 'cors';
import FBAuth from './util/fbAuth.js';
import { db } from './util/admin.js';
import {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
  editScream,
  deleteComment,
  editComment
} from './handlers/screams.js';
import {
  signup,
  login,
  uploadImage,
  uploadBannerImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
  followUser,
  unfollowUser,
} from './handlers/users.js';

const app = express();

app.use(cors());
app.use(express.json());

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.post('/scream/:screamId/edit', FBAuth, editScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
app.delete('/comment/:commentId', FBAuth, deleteComment);
app.post('/comment/:commentId/edit', FBAuth, editComment);

// Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage); // No additional body parsing needed
app.post('/user/banner', FBAuth, uploadBannerImage); // Register banner upload
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/user/:handle/follow', FBAuth, followUser);
app.post('/user/:handle/unfollow', FBAuth, unfollowUser);
app.post('/notifications', FBAuth, markNotificationsRead);

const jwtSecret = defineSecret('JWT_SECRET');
const storageBucket = defineSecret('STORAGE_BUCKET');

// GCF gen 2 function export
export const api = functions.https.onRequest(
  {
    secrets: [jwtSecret, storageBucket],
    region: 'asia-south1',
    timeoutSeconds: 300, // Increase timeout
    memory: '512MB', // Increase memory
  },
  app
);

export const createNotificationOnLike = functions.firestore.onDocumentCreated(
  { document: 'likes/{id}', region: 'asia-south1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;
    try {
      const doc = await db
        .doc(`/screams/${snapshot.data().screamId}`)
        .get();
      if (
        doc.exists &&
        doc.data().userHandle !== snapshot.data().userHandle
      ) {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'like',
          read: false,
          screamId: doc.id
        });
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);

export const deleteNotificationOnUnLike = functions.firestore.onDocumentDeleted(
  { document: 'likes/{id}', region: 'asia-south1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;
    try {
      await db
        .doc(`/notifications/${snapshot.id}`)
        .delete();
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);

export const createNotificationOnComment = functions.firestore.onDocumentCreated(
  { document: 'comments/{id}', region: 'asia-south1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;
    try {
      const doc = await db
        .doc(`/screams/${snapshot.data().screamId}`)
        .get();
      if (
        doc.exists &&
        doc.data().userHandle !== snapshot.data().userHandle
      ) {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'comment',
          read: false,
          screamId: doc.id
        });
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);

export const createNotificationOnFollow = functions.firestore.onDocumentCreated(
  { document: 'followers/{id}', region: 'asia-south1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;
    try {
      const data = snapshot.data();
      if (data.sender !== data.recipient) {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: data.recipient,
          sender: data.sender,
          type: 'follow',
          read: false
        });
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);

export const deleteNotificationOnUnFollow = functions.firestore.onDocumentDeleted(
  { document: 'followers/{id}', region: 'asia-south1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;
    try {
      await db.doc(`/notifications/${snapshot.id}`).delete();
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);

export const onUserImageChange = functions.firestore.onDocumentUpdated(
  { document: 'users/{userId}', region: 'asia-south1' },
  async (event) => {
    const before = event.data?.before;
    const after = event.data?.after;
    if (!before || !after) return true;
    if (before.data().imageUrl !== after.data().imageUrl) {
      const batch = db.batch();
      try {
        const data = await db
          .collection('screams')
          .where('userHandle', '==', before.data().handle)
          .get();
        data.forEach((doc) => {
          const scream = db.doc(`/screams/${doc.id}`);
          batch.update(scream, { userImage: after.data().imageUrl });
        });
        await batch.commit();
        return null;
      } catch (err) {
        console.error(err);
        return null;
      }
    } else {
      return true;
    }
  }
);

export const onScreamDelete = functions.firestore.onDocumentDeleted(
  { document: 'screams/{screamId}', region: 'asia-south1' },
  async (event) => {
    const screamId = event.params.screamId;
    const batch = db.batch();
    try {
      const commentsData = await db
        .collection('comments')
        .where('screamId', '==', screamId)
        .get();
      commentsData.forEach((doc) => {
        batch.delete(db.doc(`/comments/${doc.id}`));
      });
      const likesData = await db
        .collection('likes')
        .where('screamId', '==', screamId)
        .get();
      likesData.forEach((doc) => {
        batch.delete(db.doc(`/likes/${doc.id}`));
      });
      const notificationsData = await db
        .collection('notifications')
        .where('screamId', '==', screamId)
        .get();
      notificationsData.forEach((doc) => {
        batch.delete(db.doc(`/notifications/${doc.id}`));
      });
      await batch.commit();
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);