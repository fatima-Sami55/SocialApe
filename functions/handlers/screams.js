const { db } = require('../util/admin');

exports.getAllScreams = async (req, res) => {
  try {
    const data = await db
      .collection('screams')
      .orderBy('createdAt', 'desc')
      .get();
    
    let screams = [];
    
    // Batch fetch all scream author profiles in a single query
    const userHandles = [...new Set(data.docs.map((doc) => doc.data().userHandle))];
    const userRefs = userHandles.map((handle) => db.doc(`/users/${handle}`));
    const userDocs = userRefs.length > 0 ? await db.getAll(...userRefs) : [];
    
    const userCache = {};
    userDocs.forEach((doc) => {
      if (doc.exists) {
        userCache[doc.id] = doc.data();
      }
    });

    for (const doc of data.docs) {
      const screamData = doc.data();
      const userData = userCache[screamData.userHandle];
      const userName = userData ? userData.name : null;

      screams.push({
        screamId: doc.id,
        body: screamData.body,
        userHandle: screamData.userHandle,
        createdAt: screamData.createdAt,
        commentCount: screamData.commentCount,
        likeCount: screamData.likeCount,
        userImage: screamData.userImage,
        userName: userName || screamData.userHandle
      });
    }
    return res.json(screams);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong, please try again' });
  }
};

exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection('screams')
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
};
// Fetch one scream
exports.getScream = async (req, res) => {
  let screamData = {};

  try {
    const screamDoc = await db.doc(`/screams/${req.params.screamId}`).get();
    if (!screamDoc.exists) {
      return res.status(404).json({ error: 'Scream not found' });
    }

    screamData = screamDoc.data();
    screamData.screamId = screamDoc.id;

    // Fetch fresh image and name for scream author
    const userDoc = await db.doc(`/users/${screamData.userHandle}`).get();
    screamData.userImage = userDoc.exists ? userDoc.data().imageUrl : null;
    screamData.userName = userDoc.exists ? userDoc.data().name : null;

    const commentsSnapshot = await db
      .collection('comments')
      .where('screamId', '==', req.params.screamId)
      .orderBy('createdAt', 'desc')
      .get();

    // Batch fetch all commenter profile documents in a single query
    const commentHandles = [...new Set(commentsSnapshot.docs.map((doc) => doc.data().userHandle))];
    const userRefs = commentHandles.map((handle) => db.doc(`/users/${handle}`));
    const userDocs = userRefs.length > 0 ? await db.getAll(...userRefs) : [];

    const userCache = {};
    userDocs.forEach((doc) => {
      if (doc.exists) {
        userCache[doc.id] = doc.data();
      }
    });

    screamData.comments = [];

    for (const doc of commentsSnapshot.docs) {
      const comment = doc.data();
      const userData = userCache[comment.userHandle];
      const userImage = userData ? userData.imageUrl : null;
      const userName = userData ? userData.name : null;

      screamData.comments.push({
        ...comment,
        commentId: doc.id,
        userImage,
        userName: userName || comment.userHandle
      });
    }

    return res.json(screamData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
// Comment on a comment
exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Must not be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl // 💡 ADD this line!
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Scream not found' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then((docRef) => {
      newComment.commentId = docRef.id;
      return res.json(newComment); // ✅ Now includes image and commentId
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
// Like a scream
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Scream not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      } else {
        return res.status(400).json({ error: 'Scream already liked' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong, please try again' });
    });
};

exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Scream not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: 'Scream not liked' });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            res.json(screamData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong, please try again' });
    });
};
// Delete a scream
exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Scream not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Scream deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong, please try again' });
    });
};

// Edit a scream
exports.editScream = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Scream not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.update({ body: req.body.body });
      }
    })
    .then(() => {
      res.json({ message: 'Scream updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong, please try again' });
    });
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const commentDoc = db.doc(`/comments/${req.params.commentId}`);
  try {
    const commentSnapshot = await commentDoc.get();
    if (!commentSnapshot.exists) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    const commentData = commentSnapshot.data();
    if (commentData.userHandle !== req.user.handle) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const screamRef = db.doc(`/screams/${commentData.screamId}`);
    
    await db.runTransaction(async (t) => {
      const screamDoc = await t.get(screamRef);
      if (screamDoc.exists) {
        const currentCommentCount = screamDoc.data().commentCount || 0;
        t.update(screamRef, { commentCount: Math.max(0, currentCommentCount - 1) });
      }
      t.delete(commentDoc);
    });

    return res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong, please try again' });
  }
};

// Edit a comment
exports.editComment = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ error: 'Comment body must not be empty' });
  }
  const commentDoc = db.doc(`/comments/${req.params.commentId}`);
  commentDoc
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return commentDoc.update({ body: req.body.body });
      }
    })
    .then(() => {
      res.json({ message: 'Comment updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong, please try again' });
    });
};