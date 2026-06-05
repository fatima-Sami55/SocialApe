const jwt = require('jsonwebtoken');
const { db } = require('./admin');

module.exports = (req, res, next) => {
  console.log("🔥 [FBAuth] Middleware triggered");

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
    console.log("✅ [FBAuth] Token found in headers:", idToken.slice(0, 30) + '...');
  } else {
    console.error("❌ [FBAuth] No token found in Authorization header");
    return res.status(403).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ [FBAuth] JWT_SECRET environment variable is missing!");
      return res.status(500).json({ error: 'Internal server error: Authentication configuration missing' });
    }
    const decodedToken = jwt.verify(idToken, jwtSecret);
    console.log("🔐 [FBAuth] Token successfully verified:", decodedToken);

    // Make sure userId is present in the token
    if (!decodedToken.userId) {
      console.error("❌ [FBAuth] userId is missing in token payload!");
      return res.status(403).json({ error: 'Invalid token payload (missing userId)' });
    }

    req.user = decodedToken;

    db.collection('users')
      .where('userId', '==', req.user.userId)
      .limit(1)
      .get()
      .then((data) => {
        if (!data.empty) {
          const userData = data.docs[0].data();
          req.user.handle = userData.handle;
          req.user.imageUrl = userData.imageUrl;

          console.log("📦 [FBAuth] User data attached to req.user:", {
            handle: req.user.handle,
            imageUrl: req.user.imageUrl
          });

          return next();
        } else {
          console.error("❌ [FBAuth] No user found with userId:", req.user.userId);
          return res.status(403).json({ error: 'User not found in DB' });
        }
      })
      .catch((err) => {
        console.error("🔥 [FBAuth] Firestore lookup error:", err);
        return res.status(500).json({
          error: 'Something went wrong, please try again'
        });
      });

  } catch (err) {
    console.error("❌ [FBAuth] Token verification failed:", err);
    return res.status(403).json({ error: 'Invalid token' });
  }
};
