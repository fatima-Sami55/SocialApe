const { admin, db } = require("../util/admin.js");
const { v4: uuidv4 } = require ("uuid");
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require( "../util/validators.js");
const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const path = require('path');
// const os = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const getBucketName = () => process.env.STORAGE_BUCKET || 'socialapp-a0e21.appspot.com';

// Sign users up
exports.signup = async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImg = "no-img.png";

  try {
    const userDoc = await db.doc(`/users/${newUser.handle}`).get();
    if (userDoc.exists) {
      return res.status(400).json({ general: "Signup failed. Details are already taken or invalid." });
    }

    // Check if email already exists
    const emailQuery = await db.collection("users").where("email", "==", newUser.email).get();
    if (!emailQuery.empty) {
      return res.status(400).json({ general: "Signup failed. Details are already taken or invalid." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    // Create user in Firestore
    const userId = uuidv4();
    const userCredentials = {
      handle: newUser.handle,
      email: newUser.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/${getBucketName()}/o/${noImg}?alt=media`,
      userId,
    };
    await db.doc(`/users/${newUser.handle}`).set(userCredentials);

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("FATAL: JWT_SECRET environment variable is missing.");
      return res.status(500).json({ general: "Internal server error: Authentication secret missing" });
    }
    const token = jwt.sign(
      { handle: newUser.handle, userId },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};
// Log user in
exports.login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  try {
    // Find user by email
    const userQuery = await db.collection("users").where("email", "==", user.email).limit(1).get();
    if (userQuery.empty) {
      return res.status(403).json({ general: "Wrong credentials, please try again" });
    }
    const userData = userQuery.docs[0].data();

    // Compare password
    const match = await bcrypt.compare(user.password, userData.password);
    if (!match) {
      return res.status(403).json({ general: "Wrong credentials, please try again" });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("FATAL: JWT_SECRET environment variable is missing.");
      return res.status(500).json({ general: "Internal server error: Authentication secret missing" });
    }
    const token = jwt.sign(
      { handle: userData.handle, userId: userData.userId },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ general: "Something went wrong, please try again" });
  }
};
// Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong, please try again' });
    });
};
exports.getUserDetails = async (req, res) => {
  let userData = {};
  try {
    const userDoc = await db.doc(`/users/${req.params.handle}`).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    userData.user = userDoc.data();

    // 1. Fetch user's screams
    const screamsData = await db
      .collection("screams")
      .where("userHandle", "==", req.params.handle)
      .orderBy("createdAt", "desc")
      .get();
    
    userData.screams = [];
    screamsData.forEach((doc) => {
      userData.screams.push({
        screamId: doc.id,
        body: doc.data().body,
        userHandle: doc.data().userHandle,
        createdAt: doc.data().createdAt,
        commentCount: doc.data().commentCount,
        likeCount: doc.data().likeCount,
        userImage: doc.data().userImage,
        userName: userData.user.name || doc.data().userHandle
      });
    });

    // 2. Fetch screams user liked
    const likesSnapshot = await db
      .collection("likes")
      .where("userHandle", "==", req.params.handle)
      .get();

    userData.likes = [];
    if (!likesSnapshot.empty) {
      const screamIds = likesSnapshot.docs.map((doc) => doc.data().screamId);
      const screamRefs = screamIds.map((id) => db.doc(`/screams/${id}`));
      const screamDocs = screamRefs.length > 0 ? await db.getAll(...screamRefs) : [];
      
      // Batch fetch authors of the liked screams
      const screamAuthors = [...new Set(screamDocs.filter((d) => d.exists).map((d) => d.data().userHandle))];
      const authorRefs = screamAuthors.map((handle) => db.doc(`/users/${handle}`));
      const authorDocs = authorRefs.length > 0 ? await db.getAll(...authorRefs) : [];
      
      const userCache = {};
      authorDocs.forEach((doc) => {
        if (doc.exists) {
          userCache[doc.id] = doc.data();
        }
      });

      for (const sDoc of screamDocs) {
        if (sDoc.exists) {
          const sData = sDoc.data();
          const authorData = userCache[sData.userHandle];
          const userName = authorData ? authorData.name : null;

          userData.likes.push({
            screamId: sDoc.id,
            body: sData.body,
            userHandle: sData.userHandle,
            createdAt: sData.createdAt,
            commentCount: sData.commentCount,
            likeCount: sData.likeCount,
            userImage: sData.userImage,
            userName: userName || sData.userHandle
          });
        }
      }
      userData.likes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 3. Fetch user's comments on other screams
    const commentsSnapshot = await db
      .collection("comments")
      .where("userHandle", "==", req.params.handle)
      .get();

    userData.comments = [];
    if (!commentsSnapshot.empty) {
      // Batch fetch parent screams
      const parentScreamIds = [...new Set(commentsSnapshot.docs.map((doc) => doc.data().screamId))];
      const parentScreamRefs = parentScreamIds.map((id) => db.doc(`/screams/${id}`));
      const parentScreamDocs = parentScreamRefs.length > 0 ? await db.getAll(...parentScreamRefs) : [];
      
      const screamCache = {};
      parentScreamDocs.forEach((doc) => {
        if (doc.exists) {
          screamCache[doc.id] = doc.data();
        }
      });
      
      // Batch fetch authors of parent screams
      const parentScreamAuthors = [...new Set(parentScreamDocs.filter((d) => d.exists).map((d) => d.data().userHandle))];
      const parentAuthorRefs = parentScreamAuthors.map((handle) => db.doc(`/users/${handle}`));
      const parentAuthorDocs = parentAuthorRefs.length > 0 ? await db.getAll(...parentAuthorRefs) : [];
      
      const authorCache = {};
      parentAuthorDocs.forEach((doc) => {
        if (doc.exists) {
          authorCache[doc.id] = doc.data();
        }
      });

      userData.comments = commentsSnapshot.docs.map((doc) => {
        const commentData = doc.data();
        commentData.commentId = doc.id;

        const parentScream = screamCache[commentData.screamId];
        if (parentScream) {
          commentData.screamUserHandle = parentScream.userHandle;
          commentData.screamBody = parentScream.body;

          const authorData = authorCache[parentScream.userHandle];
          commentData.screamUserName = authorData ? authorData.name : parentScream.userHandle;
        }
        commentData.userName = userData.user.name || commentData.userHandle;
        return commentData;
      });
      userData.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong, please try again' });
  }
};
exports.getAuthenticatedUser = async (req, res) => {
  let userData = {};
  try {
    const doc = await db.doc(`/users/${req.user.handle}`).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    userData.credentials = doc.data();

    // 1. Fetch likes
    const likesData = await db
      .collection("likes")
      .where("userHandle", "==", req.user.handle)
      .get();
    userData.likes = [];
    likesData.forEach((doc) => {
      userData.likes.push(doc.data());
    });

    // 2. Fetch following handles
    const followingData = await db
      .collection("followers")
      .where("sender", "==", req.user.handle)
      .get();
    userData.following = [];
    followingData.forEach((doc) => {
      userData.following.push(doc.data().recipient);
    });

    // 3. Fetch notifications
    const notificationsData = await db
      .collection("notifications")
      .where("recipient", "==", req.user.handle)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();
    userData.notifications = [];
    notificationsData.forEach((doc) => {
      userData.notifications.push({
        recipient: doc.data().recipient,
        sender: doc.data().sender,
        createdAt: doc.data().createdAt,
        screamId: doc.data().screamId,
        type: doc.data().type,
        read: doc.data().read,
        notificationId: doc.id
      });
    });

    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong, please try again' });
  }
};
// Upload a profile image for user
exports.uploadImage = (req, res) => {
  // Validate Content-Type
  if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
    console.error('Invalid Content-Type:', req.headers['content-type']);
    return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
  }

  console.log('Request headers:', req.headers);
  const bb = Busboy({
    headers: req.headers,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB limit, 1 file
  });

  let imageToBeUploaded = {};
  let imageFileName;
  const generatedToken = uuidv4();
  let hasError = false;

  bb.on('file', (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info;
    console.log('File details:', { fieldname, filename, encoding, mimeType });

    if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
      file.resume(); // Discard data
      hasError = true;
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }

    const imageExtension = filename.split('.').pop();
    imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
    const filepath = path.join('/tmp', imageFileName); // Use /tmp for Firebase
    imageToBeUploaded = { filepath, mimeType };

    file.on('limit', () => {
      console.error('File size limit exceeded for:', filename);
      file.resume();
      if (!res.headersSent) {
        hasError = true;
        return res.status(400).json({ error: 'File too large' });
      }
    });

    file.pipe(fs.createWriteStream(filepath));
  });

  bb.on('field', (name, value) => {
    console.log('Form field:', { name, value });
  });

  bb.on('finish', () => {
    console.log('Busboy finished processing');
    if (hasError || res.headersSent) return;

    if (!imageFileName) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploading to Firebase Storage:', imageToBeUploaded);
    admin
      .storage()
      .bucket(getBucketName())
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimeType,
            firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${getBucketName()}/o/${imageFileName}?alt=media&token=${generatedToken}`;
        console.log('Image URL:', imageUrl);
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.status(200).json({ message: 'Image uploaded successfully' });
      })
      .catch((err) => {
        console.error('Firebase upload error:', err.message, err.stack);
        return res.status(500).json({ error: 'Firebase upload failed' });
      })
      .finally(() => {
        if (imageToBeUploaded.filepath) {
          fs.unlink(imageToBeUploaded.filepath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
          });
        }
      });
  });

  bb.on('error', (err) => {
    console.error('Busboy error details:', err.message, err.stack);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Image processing failed' });
    }
  });

  bb.end(req.rawBody);
};

// Upload a banner image for user
exports.uploadBannerImage = (req, res) => {
  // Validate Content-Type
  if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
    console.error('Invalid Content-Type:', req.headers['content-type']);
    return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
  }

  const bb = Busboy({
    headers: req.headers,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB limit, 1 file
  });

  let imageToBeUploaded = {};
  let imageFileName;
  const generatedToken = uuidv4();
  let hasError = false;

  bb.on('file', (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info;
    if (mimeType !== 'image/jpeg' && mimeType !== 'image/png' && mimeType !== 'image/webp') {
      file.resume(); // Discard data
      hasError = true;
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }

    const imageExtension = filename.split('.').pop();
    imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
    const filepath = path.join('/tmp', imageFileName); // Use /tmp for Firebase
    imageToBeUploaded = { filepath, mimeType };

    file.on('limit', () => {
      console.error('File size limit exceeded for:', filename);
      file.resume();
      if (!res.headersSent) {
        hasError = true;
        return res.status(400).json({ error: 'File too large' });
      }
    });

    file.pipe(fs.createWriteStream(filepath));
  });

  bb.on('finish', () => {
    if (hasError || res.headersSent) return;

    if (!imageFileName) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    admin
      .storage()
      .bucket(getBucketName())
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimeType,
            firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        const bannerImageUrl = `https://firebasestorage.googleapis.com/v0/b/${getBucketName()}/o/${imageFileName}?alt=media&token=${generatedToken}`;
        return db.doc(`/users/${req.user.handle}`).update({ bannerImageUrl });
      })
      .then(() => {
        return res.status(200).json({ message: 'Banner image uploaded successfully' });
      })
      .catch((err) => {
        console.error('Firebase upload error:', err.message);
        return res.status(500).json({ error: 'Firebase upload failed' });
      })
      .finally(() => {
        if (imageToBeUploaded.filepath) {
          fs.unlink(imageToBeUploaded.filepath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
          });
        }
      });
  });

  bb.on('error', (err) => {
    console.error('Busboy error details:', err.message, err.stack);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Image processing failed' });
    }
  });

  bb.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Follow a user
exports.followUser = async (req, res) => {
  const followerHandle = req.user.handle;
  const followedHandle = req.params.handle;

  if (followerHandle === followedHandle) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const followDoc = db
    .collection("followers")
    .where("sender", "==", followerHandle)
    .where("recipient", "==", followedHandle)
    .limit(1);

  try {
    const followedUserDoc = await db.doc(`/users/${followedHandle}`).get();
    if (!followedUserDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = await followDoc.get();
    if (data.empty) {
      // Create follow document
      await db.collection("followers").add({
        sender: followerHandle,
        recipient: followedHandle,
        createdAt: new Date().toISOString()
      });

      // Update follow counts
      const followerRef = db.doc(`/users/${followerHandle}`);
      const followedRef = db.doc(`/users/${followedHandle}`);

      await db.runTransaction(async (t) => {
        const followerDoc = await t.get(followerRef);
        const followedDoc = await t.get(followedRef);

        const currentFollowing = followerDoc.data().followingCount || 0;
        const currentFollowers = followedDoc.data().followerCount || 0;

        t.update(followerRef, { followingCount: currentFollowing + 1 });
        t.update(followedRef, { followerCount: currentFollowers + 1 });
      });

      return res.json({ message: "Followed successfully" });
    } else {
      return res.status(400).json({ error: "Already following this user" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  const followerHandle = req.user.handle;
  const followedHandle = req.params.handle;

  const followDoc = db
    .collection("followers")
    .where("sender", "==", followerHandle)
    .where("recipient", "==", followedHandle)
    .limit(1);

  try {
    const followedUserDoc = await db.doc(`/users/${followedHandle}`).get();
    if (!followedUserDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = await followDoc.get();
    if (!data.empty) {
      await db.doc(`/followers/${data.docs[0].id}`).delete();

      const followerRef = db.doc(`/users/${followerHandle}`);
      const followedRef = db.doc(`/users/${followedHandle}`);

      await db.runTransaction(async (t) => {
        const followerDoc = await t.get(followerRef);
        const followedDoc = await t.get(followedRef);

        const currentFollowing = followerDoc.data().followingCount || 0;
        const currentFollowers = followedDoc.data().followerCount || 0;

        t.update(followerRef, { followingCount: Math.max(0, currentFollowing - 1) });
        t.update(followedRef, { followerCount: Math.max(0, currentFollowers - 1) });
      });

      return res.json({ message: "Unfollowed successfully" });
    } else {
      return res.status(400).json({ error: "Not following this user" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};