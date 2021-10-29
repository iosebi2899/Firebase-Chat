const functions = require("firebase-functions");
const Filter = require("bad-words");

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
    .document('messages/{msgId}')
    .onCreate(async (doc, ctx) => {});
