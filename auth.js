module.exports = {
  isAuthenticated: function (req, res, next) {
    var user = firebase.auth().currentUser;
    if (user !== null) {
      req.user = user;
      next();
    } else {
      res.redirect('/login');
    }
  },
}

// idToken comes from the client app

admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    // ...
  }).catch(function(error) {
    // Handle error
  });