'use strict';

const publicVapidKey = 'BJRGj23i9Bn08Ax7QR1M40LnFUA_81tvR5Dt6igPQbwLakS5gEITcxWgQ73E8VAu2AT6Y0Zi4k3uTxXTTRfO79k';

window.addEventListener('load', (e) => {
    console.log('Page loaded');
    register();
});

// Check for service worker
if ('serviceWorker' in navigator) {
    //send().catch(err => console.error(err));
    console.log('Browser supports service workers');
} else {
    console.log('Browser does not supports service workers');
}

/*async function send() {
    // Register service worker
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    });

    // Register push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    // Send push
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}*/

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function register() {
    console.log('Registering...');
    try {
        await navigator.serviceWorker.register('./worker.js');
    } catch (err) {
        console.error('Error while registering: ' + err);
    } finally {
        console.log('Registration complete');
    }
}

async function subscribe() {
    console.log('Subscribing...');
    try {
        const worker = await navigator.serviceWorker.ready;

        // Allow / Block pop-up will be shown
        const subscription = await worker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
        console.log(JSON.stringify(subscription));

        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Error while subscribing: ' + err);
    } finally {
        console.log('Subscription done');
    }
}

// If subscription is stored in server
/*async function notify() {
    console.log('Notifying...');
    try {
        await fetch('/notify', {
            method: 'GET'
        });
    } catch (err) {
        console.error('Error while notifying: ' + err);
    }
}*/

async function notify() {
    console.log('Notifying...');
    try {
        const worker = await navigator.serviceWorker.ready;

        const subscription = await worker.pushManager.getSubscription();

        if (subscription) {
            await fetch('/notify', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            console.log('No subscription found');
        }
    } catch (err) {
        console.error('Error while notifying: ' + err);
    }
}
