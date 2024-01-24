const { readJSONFile } = require('./util/file-utils');
const FIREBASE_CONFIG_PATH = 'firebase.config.json';
const SERVICE_ACCOUNT_KEY_PATH = 'serviceAccountKey.json';

const firebaseConfig = readJSONFile(FIREBASE_CONFIG_PATH);
const serviceAccountKey = readJSONFile(SERVICE_ACCOUNT_KEY_PATH)

const ServerConfig = {
    fcm: {
        appId: process.env.FCM_APP_ID || 'fcm-test-client',
        apiPort: process.env.FCM_API_PORT || 10001,
        messages: {
            ttl: 1 * 24 * 60 * 60  // Un dia expresado en segundos - NOTA: En Android no puede exceder las 4 semanas            
        }
    },
    firebaseConfig,
    serviceAccountKey
}

module.exports = ServerConfig;
