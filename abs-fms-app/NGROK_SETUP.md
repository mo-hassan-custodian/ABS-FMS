# Ngrok Setup Instructions

## Current Issue
Your ngrok tunnel `https://5b08-102-88-112-3.ngrok-free.app` is offline, which is why you're getting 404 errors.

## Steps to Fix

### 1. Start Your Backend API
Make sure your backend API server is running on a specific port (e.g., 8080, 3000, 5000, etc.)

### 2. Start Ngrok Tunnel
Run ngrok to expose your backend API:
```bash
# Replace 8080 with your actual backend port
ngrok http 8080
```

### 3. Update Proxy Configuration
After starting ngrok, you'll get a new URL. Update the proxy configuration:

1. Copy the new ngrok URL (e.g., `https://abc123-def456.ngrok-free.app`)
2. Update `abs-fms-app/proxy.conf.json`:
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

### 4. Restart Angular Development Server
```bash
cd abs-fms-app
ng serve
```

### 5. Test the Connection
Navigate to: `http://localhost:4200/App/api-test`

## Expected Backend Endpoints

Your backend should implement these endpoints:

### GET /api/authorized-file-transfers
Returns array of transfer objects:
```json
[
  {
    "id": "AFT-001",
    "remarks": "Transfer description",
    "voucherNoRef": "VCH-001",
    "date": "2024-01-15T00:00:00Z",
    "narrative": "Transfer narrative",
    "bankAccount": "Account details",
    "currencyCode": "NGN",
    "amountPayee": 100000,
    "authorisedBy": "John Doe",
    "authorizationDate": "2024-01-15T00:00:00Z",
    "preparedBy": "Jane Smith",
    "requestDate": "2024-01-14T00:00:00Z",
    "type": "POLICY_SURRENDER",
    "document": "document.pdf",
    "payee": "Payee Name"
  }
]
```

### GET /api/authorized-file-transfers/{id}
Returns single transfer object

### GET /api/authorized-file-transfers/search
Accepts query parameters:
- `search` - text search
- `type` - transfer type filter
- `dateFrom` - start date filter
- `dateTo` - end date filter

### POST /api/authorized-file-transfers
Creates new transfer, expects transfer object in request body

### PUT /api/authorized-file-transfers/{id}
Updates existing transfer

### DELETE /api/authorized-file-transfers/{id}
Deletes transfer

## Troubleshooting

### If you still get 404 errors:
1. Check that your backend is running
2. Verify ngrok is forwarding to the correct port
3. Test the ngrok URL directly in a browser
4. Check browser console for detailed error messages

### If you get CORS errors:
1. Make sure your backend includes CORS headers
2. Verify the proxy configuration is correct
3. Restart the Angular dev server

### If the proxy isn't working:
1. Check that `proxy.conf.json` is in the root directory
2. Verify `angular.json` includes the proxy configuration
3. Restart `ng serve` after making changes

## Alternative: Direct API Calls (without proxy)

If proxy doesn't work, you can update the environment to use direct API calls:

1. Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://YOUR-NGROK-URL-HERE',
};
```

2. Make sure your backend includes CORS headers for `http://localhost:4200`
