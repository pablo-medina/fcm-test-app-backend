let clientConfig, serviceAccountKey;

try {
    keys = require('./keys.js');    
    clientConfig = keys.clientConfig;    
    serviceAccountKey = keys.serviceAccountKey;
} catch (error) {
    clientConfig = process.env.FIREBASE_CONFIG;
    serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;
}

const clientConfigJSON = JSON.parse(clientConfig);
const serviceAccountKeyJSON = JSON.parse(serviceAccountKey);

const ServerConfig = {
    fcm: {
        appId: process.env.FCM_APP_ID || 'fcm-test-client',
        apiPort: process.env.FCM_API_PORT || 10001
    },
    clientConfig: clientConfigJSON,
    serviceAccountKey: serviceAccountKeyJSON
}

module.exports = ServerConfig;
