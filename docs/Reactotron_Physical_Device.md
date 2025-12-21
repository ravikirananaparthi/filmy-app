# Finding Your Computer's IP Address for Reactotron

## 🎯 Quick Instructions

Since you're using a **physical Android device**, Reactotron needs your **computer's IP address** to connect.

### Step 1: Find Your Computer's IP Address

**On Windows:**

1. Open Command Prompt or Terminal
2. Run this command:
   ```bash
   ipconfig
   ```

3. Look for **"Wireless LAN adapter Wi-Fi"** or **"Ethernet adapter"** section
4. Find the line that says **"IPv4 Address"**
5. Copy the IP address (it will look like `192.168.X.XXX` or `10.0.X.XXX`)

**Example output:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.5  ⬅️ THIS ONE!
```

### Step 2: Update Reactotron Config

1. Open `src/config/reactotron.ts`
2. Find line 10:
   ```typescript
   host: '192.168.1.5', // ⬅️ CHANGE THIS to your computer's IP address!
   ```
3. Replace `192.168.1.5` with YOUR actual IP address
4. Save the file

### Step 3: Ensure Same Network

**IMPORTANT:** Your phone and computer MUST be on the **same Wi-Fi network**!

- Both connected to the same Wi-Fi
- Or use USB and enable ADB reverse port forwarding (see below)

### Step 4: Reload App

1. Press `r` in your Metro terminal to reload the app
2. Check Reactotron desktop - you should see "Filmy App" connect!

## 🔧 Alternative: USB with ADB Port Forwarding

If you can't connect via Wi-Fi, use USB:

1. Connect your phone via USB
2. Run this command in terminal:
   ```bash
   adb reverse tcp:9090 tcp:9090
   ```

3. In `src/config/reactotron.ts`, change host back to:
   ```typescript
   host: 'localhost',
   ```

4. Reload your app

## ✅ Verification

After updating the IP and reloading:

1. Check your Metro terminal for:
   ```
   🚀 Reactotron Configured and Connected!
   ```

2. Check Reactotron desktop:
   - Top-right should show "Connected" (green)
   - Timeline should show "✅ CONNECTION TEST"

3. Pull to refresh in your app
   - Watch Reactotron Timeline for API logs!

## 🎉 Success!

Once connected, you'll see:
- 🚀 API REQUEST
- ✅ API RESPONSE with properly formatted JSON (not binary!)
- No more console logs clutter

---

**Current Status:**
- ✅ Reactotron installed
- ✅ Code configured
- ⏳ Waiting for you to update IP address
- ⏳ Then reload app
