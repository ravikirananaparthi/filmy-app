import Reactotron from 'reactotron-react-native';

// Configure Reactotron only in development
if (__DEV__) {
    Reactotron
        .configure({
            name: 'Filmy App',
            // IMPORTANT: For physical device, use your computer's IP address
            // Find your IP: Run 'ipconfig' in terminal and look for IPv4 Address
            // For example: '192.168.1.5' or '192.168.0.100'
            // OR use 'localhost' if using USB with Reverse Tunnel (recommended!)
            host: 'localhost', // Using USB reverse tunnel
        })
        .useReactNative({
            networking: {
                // Enable network inspection - this will show all axios requests!
                ignoreUrls: /symbolicate|logs/,
            },
            editor: false,
            overlay: false,
            asyncStorage: false,
            errors: { veto: () => false },
        })
        .connect();

    // Clear Reactotron on every app reload
    Reactotron.clear?.();

    // Test log to verify Reactotron is working
    console.log('🚀 Reactotron Configured and Connected!');
    Reactotron.log?.('🎉 REACTOTRON IS WORKING! Check Timeline tab →');
    Reactotron.display?.({
        name: '✅ CONNECTION TEST',
        preview: 'If you see this, Reactotron is working!',
        value: {
            message: 'Reactotron is successfully connected and logging!',
            instructions: 'Look at the Timeline tab in Reactotron desktop app',
            nextSteps: 'Make an API call in your app to see network logs',
        },
        important: true,
    });
}

export default Reactotron;
