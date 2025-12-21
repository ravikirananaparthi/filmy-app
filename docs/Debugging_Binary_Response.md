# Debugging Binary Data in JS Debugger - Quick Fixes

## Understanding the Issue

When you see hexadecimal offsets (00000000, 00000010, etc.) in the Response tab of your JS debugger, it means:
- The response is **gzipped/compressed** by the server
- The debugger is showing **raw compressed bytes**
- Your app code **still works fine** because axios automatically decompresses it

## Quick Solution: Use Console Logs

Your API client is now configured to log all responses to the console in development mode. 

**To view JSON responses:**

1. **Open Metro Bundler terminal** (where you ran `yarn android`)
2. **Look for console logs** like:
   ```
   API Response: {
     url: '/feed/for-you',
     method: 'get',
     status: 200,
     contentType: 'application/json',
     dataType: 'object',
     data: { ... }  // ✅ Your actual JSON data here!
   }
   ```

3. **Or use Chrome DevTools:**
   - Press `j` in Metro terminal to open debugger
   - Open Console tab
   - See properly formatted JSON responses

## Verify Response is JSON

Check these in the Headers tab of your debugger:

### ✅ Good Response Headers
```
Content-Type: application/json
Content-Encoding: gzip
```

### ❌ Problem Response Headers
```
Content-Type: text/html
Content-Type: application/octet-stream
```

If you see the problem headers, your backend is not sending JSON properly.

## Alternative: Flipper (Facebook's Debugger)

Flipper is another excellent option that handles compressed responses:

### Install Flipper Desktop
Download from: https://fbflipper.com/

### It's Built Into React Native!
No additional setup needed for basic networking inspection.

### Usage
1. Open Flipper
2. Start your app: `yarn android`
3. Select your app in Flipper
4. Click "Network" plugin
5. See all requests/responses with properly formatted JSON ✅

## What Changed in Your Code

I've updated `src/services/api/client.ts` to:

1. **Explicitly request JSON**:
   ```typescript
   headers: {
     'Accept': 'application/json',
     'Accept-Encoding': 'gzip, deflate, br',
   }
   ```

2. **Ensure JSON parsing**:
   ```typescript
   responseType: 'json',
   decompress: true,
   ```

3. **Log all responses in dev**:
   - Successful responses → `console.log('API Response:', ...)`
   - Failed responses → `console.error('API Error:', ...)`

## Testing

Run your app and make an API call:

```bash
# In Metro terminal, you'll see:
API Response: {
  url: "/feed/for-you",
  method: "get",
  status: 200,
  contentType: "application/json; charset=utf-8",
  dataType: "object",
  data: { images: [...], cursor: "..." }  // ✅ Properly formatted!
}
```

## Why the Debugger Shows Binary

The JS debugger intercepts network traffic **before** axios processes it:

```
Server → [gzipped data] → Network Tab (binary!) → Axios → [decompressed JSON] → Your code ✅
                              ↑
                          You see this
```

Your code receives proper JSON, but the debugger catches it earlier.

## Recommended Solutions (in order)

1. **✅ Use Console Logs** (already configured!)
2. **✅ Install Reactotron** (see `Reactotron_Setup.md`)
3. **✅ Use Flipper** (built-in, just install desktop app)
4. **⚠️ Disable gzip on server** (not recommended for production)

## Server-Side Fix (Optional)

If you control the backend, you can disable compression for development:

```javascript
// Backend (Express.js example)
if (process.env.NODE_ENV === 'development') {
  // Don't use compression middleware
} else {
  app.use(compression());
}
```

But this is **not recommended** - better to use proper debugging tools!
