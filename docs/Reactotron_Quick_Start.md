# Reactotron Quick Start Guide

## ✅ Installation Complete!

Reactotron has been successfully installed and configured in your Filmy App!

## 🚀 How to Use

### Step 1: Download Reactotron Desktop App

**Download the latest version:**
- **Windows**: https://github.com/infinitered/reactotron/releases/latest
  - Download `Reactotron.Setup.X.X.X.exe`
  - Run the installer

- **macOS**: 
  ```bash
  brew install --cask reactotron
  ```

- **Linux**: Download from GitHub releases

### Step 2: Start Reactotron Desktop

1. **Open Reactotron** application
2. Reactotron will start listening on `localhost:9090`

### Step 3: Run Your React Native App

Your app is already configured! Just reload it:

```bash
# Your app is already running with: yarn android
# Simply reload it by pressing 'r' in the Metro terminal
# Or shake your device/emulator and press "Reload"
```

### Step 4: View API Responses in Reactotron

Once your app connects, you'll see:

1. **Timeline Tab** (left sidebar):
   - 🚀 **API REQUEST** - Shows all outgoing requests
   - ✅ **API RESPONSE** - Shows responses with **properly formatted JSON** ✨
   - ❌ **API ERROR** - Shows any errors

2. Click on any API RESPONSE to see:
   - Full URL
   - HTTP Status
   - Response Headers
   - **Decompressed JSON data** (not binary!)

## 📱 Troubleshooting

### Reactotron Not Connecting?

**Check the Metro terminal** for this message:
```
🚀 Reactotron Configured and Connected!
```

If you don't see it:

1. **Make sure Reactotron desktop app is running FIRST**
2. **Then** reload your React Native app
3. Check if you see the connection in Reactotron's status bar (top right)

### Using a Physical Device?

If using a real Android device instead of emulator:

1. Find your computer's local IP address:
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.XXX)
   
   # macOS/Linux
   ifconfig
   # Look for "inet" (e.g., 192.168.1.XXX)
   ```

2. Edit `src/config/reactotron.ts`:
   ```typescript
   Reactotron.configure({
       name: 'Filmy App',
       host: '192.168.1.XXX', // Replace with your IP
   })
   ```

3. Make sure your phone and computer are on the **same Wi-Fi network**

### Using Android Emulator?

The default `localhost` should work, but if not, try:

Edit `src/config/reactotron.ts`:
```typescript
Reactotron.configure({
    name: 'Filmy App',
    host: '10.0.2.2', // Special address for Android emulator
})
```

## 🎯 What You'll See

When you make an API call (e.g., loading the feed):

### In Reactotron Timeline:

```
🚀 API REQUEST
GET /feed/for-you
├─ url: /feed/for-you
├─ method: get
└─ headers: { Authorization: "Bearer ...", ... }

✅ API RESPONSE  ⭐
200 /feed/for-you
├─ status: 200
├─ contentType: application/json
└─ data: {
      images: [
        { id: "...", url: "...", actressId: "..." },
        ...
      ],
      cursor: "..."
    }
```

**Click on "data"** to expand and see the full JSON response - properly formatted! 🎉

## 💡 Pro Tips

1. **Filter Timeline**: Use the search box to filter by URL
2. **Clear Timeline**: Press "Clear" button to remove old logs
3. **Snapshot State**: Capture app state at any moment
4. **Custom Logs**: In your code, use:
   ```typescript
   if (__DEV__ && Reactotron) {
       Reactotron.log('Custom message', data);
   }
   ```

## ✨ Features Now Active

- ✅ Network request/response inspection
- ✅ Automatic JSON decompression (fixes the binary data issue!)
- ✅ Timeline view of all events
- ✅ Pretty-printed JSON
- ✅ Error tracking
- ✅ Custom logging

## 🎬 Next Steps

1. **Download Reactotron desktop app** (if you haven't already)
2. **Open it**
3. **Reload your React Native app** (press 'r' in Metro terminal)
4. **Navigate to any screen** that makes API calls
5. **Check Reactotron Timeline** - you'll see properly formatted JSON! 🎉

---

**No more hexadecimal binary data in debugger!** 🚀

All your API responses will now show as properly formatted, readable JSON in Reactotron.
