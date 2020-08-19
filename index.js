const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey = 'BJRGj23i9Bn08Ax7QR1M40LnFUA_81tvR5Dt6igPQbwLakS5gEITcxWgQ73E8VAu2AT6Y0Zi4k3uTxXTTRfO79k';
const privateVapidKey = 'ncX7mP77BY_-77UdEbXvvMjZ3S4Pd5hTKQhpmG8iH3s';

webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

let subscription;
let counter = 0;

// Subscribe route
app.post('/subscribe', (req, res) => {
    // Save the subscription in DB
    subscription = req.body;

    res.status(201).json({});
});

// Notify route
app.get('/notify', (req, res) => {
    if (subscription) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }

    const payload = JSON.stringify({
        title: "Push Test " + counter
    });

    counter++;

    webPush.sendNotification(subscription, payload)
        .then((res) => {
            console.log('Notify: Result: ' + JSON.stringify(res));
        })
        .catch((err) => {
            console.error('Notify: Error: ' + err);
        });
});

app.post('/notify', (req, res) => {
    subscription = req.body;

    if (subscription) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }

    const payload = JSON.stringify({
        title: "Push Test " + counter
    });
    counter++;

    webPush.sendNotification(subscription, payload)
        .then((res) => {
            console.log('Notify: Result: ' + JSON.stringify(res));
        })
        .catch((err) => {
            console.error('Notify: Error: ' + err);
        });
});

const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
