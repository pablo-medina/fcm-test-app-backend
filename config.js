const { readFileSync } = require('fs');
const FIREBASE_CONFIG_PATH = 'firebase.config.json';
const SERVICE_ACCOUNT_KEY_PATH = 'serviceAccountKey.json';

const firebaseConfig = readFileSync(FIREBASE_CONFIG_PATH);
const serviceAccountKey = readFileSync(SERVICE_ACCOUNT_KEY_PATH)

const firebaseConfigJSON = JSON.parse(firebaseConfig);
const serviceAccountKeyJSON = JSON.parse(serviceAccountKey);

const ServerConfig = {
    fcm: {
        appId: process.env.FCM_APP_ID || 'fcm-test-client',
        apiPort: process.env.FCM_API_PORT || 10001
    },
    firebaseConfig: firebaseConfigJSON,
    serviceAccountKey: serviceAccountKeyJSON
}

module.exports = ServerConfig;
