export const environment = {
  production: true,
  cloudinary:
    'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658243/catspace',
  firebaseConfig: {
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: 'catspace-e7621.firebaseapp.com',
    databaseURL: 'https://catspace-e7621-default-rtdb.firebaseio.com',
    projectId: 'catspace-e7621',
    storageBucket: 'catspace-e7621.firebasestorage.app',
    messagingSenderId: '591661681407',
    appId: '1:591661681407:web:4d4ed4cfbe2c9a66611aca',
  },
};
