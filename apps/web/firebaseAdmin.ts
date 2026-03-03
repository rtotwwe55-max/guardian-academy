import admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  db = admin.firestore();
} else {
  // no service account provided; firebase will not be initialized
  console.warn('FIREBASE_SERVICE_ACCOUNT not set - using in-memory store');
}

export { db };
