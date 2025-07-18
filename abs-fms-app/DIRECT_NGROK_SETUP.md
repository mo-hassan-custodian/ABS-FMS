# Direct Ngrok Setup (No Proxy)

## Overview

Your Angular app is now configured to make direct API calls to your ngrok endpoint without using a proxy. This is simpler and more reliable for development.

## Current Configuration

- **Environment file**: `src/environments/environment.ts`
- **API Base URL**: `https://5b08-102-88-112-3.ngrok-free.app`
- **Proxy**: Disabled (removed)
- **CORS**: Handled by HTTP interceptor with ngrok headers

## Setup Steps

### 1. Start Your Backend API

Make sure your backend is running on a specific port:

```bash
# Example - replace with your actual backend start command
npm start
# or
python app.py
# or
java -jar your-app.jar
```

### 2. Start Ngrok Tunnel

```bash
ngrok http 8080  # Replace 8080 with your backend port
```

### 3. Update Environment File

Copy the new ngrok URL and update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: "https://YOUR-NEW-NGROK-URL-HERE", // Update this
};
```

### 4. Start Angular Dev Server

```bash
cd abs-fms-app
ng serve
```

### 5. Test the Connection

Navigate to: `http://localhost:4200/App/api-test`

## Expected API Endpoints

Your backend should implement these endpoints:

### GET /api/Authorization

**Query Parameters:**

- `PageNumber` (required) - Page number for pagination
- `PageSize` (required) - Number of records per page
- `Id` (optional) - Filter by transfer ID
- `StartDate` (optional) - Filter by start date (ISO format)
- `EndDate` (optional) - Filter by end date (ISO format)
- `Payee` (optional) - Filter by payee name
- `Type` (optional) - **NEW:** Filter by transfer type

**Response:**

```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "totalRecords": 32,
  "totalPages": 4,
  "records": [
    {
      "id": "AFT-009",
      "remarks": "Transfer description",
      "voucherNoRef": "VCH-CLM-2024-009",
      "date": "2025-07-02T00:00:00+01:00",
      "narrative": "Transfer narrative",
      "bankAccount": "Account details",
      "currencyCode": "NGN",
      "amountPayee": 2527088.5,
      "authorisedBy": "John Doe",
      "authorizationDate": "2025-07-01T00:00:00+01:00",
      "preparedBy": "Jane Smith",
      "requestDate": "2025-06-29T00:00:00+01:00",
      "type": "CLAIMS",
      "document": "document.pdf",
      "payee": "Payee Name"
    }
  ]
}
```

### ~~GET /api/Authorization/GetAll~~ (DEPRECATED)

**Note:** This endpoint is no longer needed. Use the main `/api/Authorization` endpoint with the `Type` parameter instead.

**Query Parameters:**

- `type` (optional) - Filter by transfer type only

**Response:** Array of transfer objects

### GET /api/Authorization/{id}

Returns single transfer object by ID

### GET /api/Authorization/GetAuthorizedByid

**Query Parameters:**

- `id` (required) - ID of the authorized payment to retrieve

Returns single authorized payment object

### POST /api/Authorization/AuthorizedPayment

**Purpose:** Authorize a payment from the payment summary page (not for creating new payments)

**Request Body:**

```json
{
  "voucherNoRef": "string",
  "payee": "string",
  "amountPayee": 0.01,
  "payeeBankAccount": "string",
  "fromAccount": "string",
  "transferType": "string",
  "narrative": "string"
}
```

Authorizes an existing payment for processing

## CORS Configuration

Since we're making direct calls to ngrok, your backend needs to allow CORS from `http://localhost:4200`.

### For Express.js (Node.js):

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
```

### For Spring Boot (Java):

```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class AuthorizedFileTransferController {
    // Your endpoints
}
```

### For Flask (Python):

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=['http://localhost:4200'])
```

## Troubleshooting

### Issue: CORS errors

**Solution**: Add CORS headers to your backend (see above)

### Issue: "ERR_NGROK_3200" or "endpoint is offline"

**Solution**:

1. Restart ngrok: `ngrok http YOUR_PORT`
2. Update environment.ts with new URL
3. Restart Angular: `ng serve`

### Issue: 404 errors

**Solution**:

1. Verify your backend implements the expected endpoints
2. Check that your backend is running
3. Test ngrok URL directly in browser

### Issue: Network errors

**Solution**:

1. Check if ngrok tunnel is active
2. Verify backend is accessible via ngrok URL
3. Check browser console for detailed errors

## Advantages of Direct Ngrok Approach

✅ **Simpler configuration** - No proxy setup needed
✅ **Easier debugging** - Direct API calls are easier to trace
✅ **Better error messages** - Clear indication of API vs network issues
✅ **More reliable** - No proxy middleware to fail
✅ **Production-like** - Similar to how production API calls work

## When Ngrok URL Changes

Ngrok free accounts get new URLs each time you restart. When this happens:

1. Copy the new ngrok URL
2. Update `src/environments/environment.ts`
3. Restart `ng serve`
4. Test at `http://localhost:4200/App/api-test`

## Fallback Behavior

Even if your API is offline, the app will:

- Continue working with localStorage data
- Show clear error messages in the test component
- Log detailed error information to browser console
- Provide troubleshooting guidance

## Production Deployment

For production, update `src/environments/environment.prod.ts` with your production API URL:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: "https://your-production-api.com",
};
```
