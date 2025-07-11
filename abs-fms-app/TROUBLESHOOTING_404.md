# Troubleshooting 404 Errors

## Current Issue
You're getting 404 errors when trying to access `/api/authorized-file-transfers` because:

1. **Ngrok tunnel is offline** - The URL `https://5b08-102-88-112-3.ngrok-free.app` is not responding
2. **Proxy configuration may not be active** - Angular dev server might not be using the proxy

## Quick Fix Steps

### Option 1: Restart Ngrok and Update Configuration

1. **Start your backend API** (make sure it's running on a specific port, e.g., 8080)

2. **Start a new ngrok tunnel:**
   ```bash
   ngrok http 8080  # Replace 8080 with your backend port
   ```

3. **Copy the new ngrok URL** (e.g., `https://abc123-def456.ngrok-free.app`)

4. **Update the environment file:**
   ```bash
   # Edit src/environments/environment.ts
   ```
   Change the `apiBaseUrl` to your new ngrok URL:
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'https://YOUR-NEW-NGROK-URL-HERE',
   };
   ```

5. **Restart Angular dev server:**
   ```bash
   cd abs-fms-app
   ng serve
   ```

### Option 2: Use Proxy Configuration (Recommended)

1. **Update proxy.conf.json** with your new ngrok URL:
   ```json
   {
     "/api/*": {
       "target": "https://YOUR-NEW-NGROK-URL-HERE",
       "secure": true,
       "changeOrigin": true,
       "logLevel": "debug",
       "headers": {
         "ngrok-skip-browser-warning": "true"
       }
     }
   }
   ```

2. **Update environment to use proxy:**
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: '', // Empty string means use proxy
   };
   ```

3. **Restart with explicit proxy configuration:**
   ```bash
   cd abs-fms-app
   ./restart-with-proxy.sh
   ```
   Or manually:
   ```bash
   ng serve --proxy-config proxy.conf.json
   ```

## Testing the Fix

1. **Check the API test page:**
   Navigate to: `http://localhost:4200/App/api-test`

2. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for console messages showing the API URL being called
   - Check for any error details

3. **Test ngrok URL directly:**
   Open your ngrok URL in a browser to verify it's working

## Expected Console Output

When working correctly, you should see:
```
Attempting to fetch from: https://your-ngrok-url/api/authorized-file-transfers
API call successful, received transfers: X
```

When failing, you'll see:
```
API call failed, using fallback data: {status: 404, ...}
Fallback: Using localStorage data with X transfers
```

## Common Issues and Solutions

### Issue: "ERR_NGROK_3200" or "endpoint is offline"
**Solution:** Your ngrok tunnel expired. Start a new one.

### Issue: CORS errors
**Solution:** 
- Use proxy configuration (Option 2 above)
- Or add CORS headers to your backend

### Issue: Proxy not working
**Solution:**
- Ensure `proxy.conf.json` is in the root directory
- Restart Angular dev server with `--proxy-config proxy.conf.json`
- Check that `angular.json` has the proxy configuration

### Issue: Still getting 404 from localhost:4200
**Solution:**
- The proxy isn't working. Use direct API calls (Option 1)
- Or check that your backend implements the expected endpoints

## Backend Requirements

Your backend must implement:
- `GET /api/authorized-file-transfers` - Returns array of transfers
- `GET /api/authorized-file-transfers/{id}` - Returns single transfer
- `GET /api/authorized-file-transfers/search` - Search with query params

## Fallback Behavior

The app will continue working even if the API fails:
- It will use localStorage data
- Show clear error messages
- Log detailed error information
- Provide troubleshooting guidance

## Need Help?

1. Check the browser console for detailed error messages
2. Test your ngrok URL directly in a browser
3. Verify your backend is running and accessible
4. Use the API test component at `/App/api-test` for diagnostics
