/**
 * CampusAI - Firebase Configuration
 * 
 * To enable real Google Sign-In:
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Create a project (e.g., CampusAI)
 * 3. Go to "Authentication" -> "Sign-in method" and enable "Google"
 * 4. Go to "Project Settings" -> General -> Under "Your apps", register a Web App
 * 5. Copy the firebaseConfig object properties and paste them below.
 * 6. Make sure your local domains (localhost, 127.0.0.1) are added under "Authorized domains" in Firebase Console.
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Check if Firebase configuration has been customized by the user
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
