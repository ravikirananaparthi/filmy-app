# Reactotron Setup Guide

## Why Reactotron?

Reactotron is a macOS, Windows, and Linux app for inspecting React Native apps. It properly handles:
- ✅ Compressed/gzipped responses
- ✅ Large JSON payloads
- ✅ Network request/response inspection
- ✅ Redux/Zustand state tracking
- ✅ Custom logging

Unlike the built-in JS debugger, Reactotron correctly displays decompressed JSON responses.

## Installation

### 1. Install Desktop App

Download from: https://github.com/infinitered/reactotron/releases

Or install via package manager:
```bash
# Windows (Chocolatey)
choco install reactotron

# macOS (Homebrew)
brew install --cask reactotron

# Or download directly from GitHub releases
```

### 2. Install React Native Package

```bash
yarn add --dev reactotron-react-native
```

### 3. Create Reactotron Configuration

Create `src/config/reactotron.ts`:

```typescript
import Reactotron from 'reactotron-react-native';
import { ENV } from '@config/env';

// Only configure in development
if (ENV.IS_DEV) {
    Reactotron
        .configure({
            name: 'Filmy App',
            host: 'localhost', // Change to your computer's IP if using physical device
        })
        .useReactNative({
            networking: {
                // Enable network inspection
                ignoreUrls: /symbolicate|logs/,
            },
            editor: false,
            overlay: false,
        })
        .connect();

    // Clear on every reload in DEV
    Reactotron.clear?.();

    console.log = Reactotron.log;
    console.warn = Reactotron.warn;
    console.error = Reactotron.error;
}

export default Reactotron;
```

### 4. Import in App Entry Point

Add to the **very top** of `app/_layout.tsx` (before any other imports):

```typescript
// Must be first import!
if (__DEV__) {
    require('../src/config/reactotron');
}

// ... rest of your imports
```

### 5. Optional: Track Axios Requests

Update `src/services/api/client.ts` to log requests explicitly:

```typescript
import Reactotron from 'reactotron-react-native';

// ... existing code ...

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = ENV.DEV_AUTH_TOKEN;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log to Reactotron in development
        if (ENV.IS_DEV) {
            Reactotron.display({
                name: '🚀 API REQUEST',
                preview: `${config.method?.toUpperCase()} ${config.url}`,
                value: {
                    url: config.url,
                    method: config.method,
                    headers: config.headers,
                    data: config.data,
                },
            });
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Log to Reactotron in development
        if (ENV.IS_DEV) {
            Reactotron.display({
                name: '✅ API RESPONSE',
                preview: `${response.status} ${response.config?.url}`,
                value: {
                    url: response.config?.url,
                    status: response.status,
                    contentType: response.headers?.['content-type'],
                    data: response.data,
                },
                important: true,
            });
        }
        return response;
    },
    (error) => {
        // Log errors
        if (ENV.IS_DEV) {
            Reactotron.display({
                name: '❌ API ERROR',
                preview: error.message,
                value: {
                    message: error.message,
                    url: error.config?.url,
                    status: error.response?.status,
                    data: error.response?.data,
                },
                important: true,
            });
        }
        return Promise.reject(error);
    }
);
```

## Usage

1. **Start the Reactotron desktop app**
2. **Run your Expo app**: `yarn android` or `yarn start`
3. **View Network Tab** in Reactotron - you'll see all API requests/responses with properly formatted JSON!

## Tips

- **Timeline**: See all events chronologically
- **State**: Track Zustand state changes
- **Custom Logs**: Use `Reactotron.log('Custom message', data)`
- **Snapshots**: Capture app state at any moment
- **Benchmarks**: Track performance

## Troubleshooting

### Connection Issues

If Reactotron doesn't connect:

1. **Physical Device**: Change `host` to your computer's local IP
   ```typescript
   .configure({
       name: 'Filmy App',
       host: '192.168.1.XXX', // Your computer's IP
   })
   ```

2. **Android Emulator**: Use `10.0.2.2` instead of `localhost`
   ```typescript
   .configure({
       name: 'Filmy App',
       host: '10.0.2.2',
   })
   ```

3. **Firewall**: Ensure port 9090 is open

### Still Seeing Binary Data?

This shouldn't happen with Reactotron since it properly handles axios's decompressed responses. If you do:

1. Check that the axios config includes `decompress: true`
2. Verify `Accept: application/json` header is set
3. Check server response `Content-Type` header
