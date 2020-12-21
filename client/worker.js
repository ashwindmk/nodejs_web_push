'use strict';

const TAG = 'Service-worker';

console.log(TAG + ': loaded');

self.addEventListener('install', (e) => {
    console.log(TAG + ': install');
});

self.addEventListener('activate', (e) => {
    console.log(TAG + ': activate (target: ' + e.target + ', type: ' + e.type + ')');
});

self.addEventListener('push', (e) => {
    let data;
    try {
        data = e.data.json();
    } catch (err) {
        data = {
            title: 'Dummy Title'
        };
    }

    console.log(TAG + ': push: ' + JSON.stringify(data));
    
    self.registration.showNotification(data.title, {
        body: 'Notified by Ashwin Dinesh',
        icon: 'https://avatars1.githubusercontent.com/u/14576048'
    });
});
