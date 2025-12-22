import Reactotron from 'reactotron-react-native';

// Temporarily disabled for JS debugger compatibility
// To re-enable: Uncomment the code below

// if (__DEV__) {
//     Reactotron
//         .configure({
//             name: 'Filmy App',
//             host: 'localhost',
//         })
//         .useReactNative({
//             networking: {
//                 ignoreUrls: /symbolicate|logs/,
//             },
//             editor: false,
//         })
//         .connect();

//     Reactotron.clear?.();
//     console.log('🚀 Reactotron Configured and Connected!');
// }

const reactotron = __DEV__ ? Reactotron : null;

export default reactotron;
