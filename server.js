const express = require('express');
const cors = require('cors');
const FCMClient = require('./lib/fcm-client.js');
const chalk = require('chalk');
const ServerConfig = require('./config.js');

const llamarFuncion = (fn, delay) => {
    if (delay > 0) {
        setTimeout(fn, delay);
    } else {
        fn();
    }
}

const validateApplicationHeader = (req, res, next) => {
    const applicationHeaderValue = req.get('application');

    if (applicationHeaderValue === ServerConfig.fcm.appId) {
        next();
    } else {
        res.status(403).json({ error: 'Aplicación no válida' });
    }
};

async function main() {
    console.log('Cargando configuración...');
    const fcmClient = new FCMClient(ServerConfig.serviceAccountKey);
    await fcmClient.init();

    console.log('Inicialiando servidor...');
    const app = express();

    // Configuración CORS
    app.use(cors());
    app.use(express.json());

    // Health Check
    app.get('/health', (req, res) => {
        res.status(200).json({status: 'OK'});
    })

    // Endpoint para obtener la configuración
    app.get('/firebase-config', validateApplicationHeader, (req, res) => {
        try {
            const response = Object.assign(ServerConfig.clientConfig);
            console.log('Configuración: ', response);
            res.json(response);
        } catch (error) {
            console.error('Error al leer el archivo de configuración:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Endpoint para enviar mensajes
    app.post('/send-message', validateApplicationHeader, (req, res) => {
        const { titulo, texto, imagen, token, delay } = req.body;
        console.log('send-message: ', JSON.stringify(req.body));

        let _delay = parseInt(delay, 10) || 0;
        llamarFuncion(() => {
            try {
                fcmClient.sendNotification({ token, title: titulo, body: texto, image: imagen })
                    .then(response => {
                        console.log('Mensaje recibido de FCM:', response);
                        res.status(200).send({ success: true, mensaje: 'Mensaje enviado a FCM' });
                    })
                    .catch(error => {
                        console.error('Error al enviar el mensaje:', error);
                        res.status(500).send({success: false, message: 'Error al enviar mensaje a FCM', detail: error.message});
                    });
            } catch (error) {
                console.error('Error al intentar enviar un mensaje', error);
                res.status(500).send({success: false, message: 'Error al enviar mensaje a FCM', detail: error.message});
            }
        }, _delay);
    });


    // Iniciar el servidor
    app.listen(ServerConfig.fcm.apiPort, () => {
        const address = `http://localhost:${ServerConfig.fcm.apiPort}`;
        console.log(`${chalk.yellow("Servidor de notificaciones corriendo en")} ${chalk.greenBright(address)}`);
    });
}

main().then(
    () => {
        console.log('Servidor inicializado.');
    }
).catch(err => {
    console.error(err);
});
