/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// HTTP callable function to set admin role
exports.addAdminRole = functions.https.onCall((data, context) => {
  // Check if requester is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users can add admins');
  }
  
  // Optional: Check if requester is already an admin
  /*
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can add other admins');
  }
  */
  
  // Get user and add custom claim
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
  }).then(() => {
    return {
      result: `Success! ${data.email} has been made an admin.`
    };
  }).catch(err => {
    throw new functions.https.HttpsError('internal', err.message);
  });
});
