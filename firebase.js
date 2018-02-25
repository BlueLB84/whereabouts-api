const firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  messagingSenderId: process.env.messagingSenderId
};

firebase.initializeApp(config);