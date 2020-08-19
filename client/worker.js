console.log('Service worker loaded');

self.addEventListener('push', (e) => {
    let data;
    try {
        data = e.data.json();
    } catch (err) {
        data = {
            title: 'Dummy Title'
        };
    }

    console.log('Push received: ' + JSON.stringify(data));
    
    self.registration.showNotification(data.title, {
        body: 'Notified by Ashwin Dinesh',
        icon: 'https://avatars1.githubusercontent.com/u/14576048'
    });
});
