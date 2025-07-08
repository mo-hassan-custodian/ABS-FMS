# API Integration Guide

## Overview
This Angular application has been configured to integrate with your ngrok API endpoint: `https://5b08-102-88-112-3.ngrok-free.app`

## Changes Made

### 1. Environment Configuration
- Updated `src/environments/environment.ts` and `src/environments/environment.prod.ts` with API base URL
- Development uses proxy configuration for CORS handling

### 2. HTTP Interceptor
- Created `src/app/interceptors/api.interceptor.ts` to handle ngrok headers
- Automatically adds `ngrok-skip-browser-warning: true` header to API requests

### 3. Proxy Configuration
- Added `proxy.conf.json` for development server
- Configured Angular CLI to use proxy in development mode
- Routes `/api/*` requests to your ngrok endpoint

### 4. Service Updates
Updated `AuthorizedFileTransferService` with new API methods:

#### Available API Endpoints:
- `GET /api/authorized-file-transfers` - Get all transfers
- `GET /api/authorized-file-transfers/{id}` - Get transfer by ID
- `GET /api/authorized-file-transfers/search` - Search transfers with filters
- `POST /api/authorized-file-transfers` - Create new transfer
- `PUT /api/authorized-file-transfers/{id}` - Update transfer
- `DELETE /api/authorized-file-transfers/{id}` - Delete transfer

#### Search Parameters:
- `search` - Text search across multiple fields
- `type` - Filter by transfer type
- `dateFrom` - Filter by start date
- `dateTo` - Filter by end date

### 5. Fallback Mechanism
All API methods include fallback to localStorage data if API calls fail, ensuring the application continues to work even when the API is unavailable.

## Testing the Integration

### 1. API Test Component
Navigate to `/App/api-test` to test the API connection:
```
http://localhost:4200/App/api-test
```

### 2. Existing Functionality
The authorized file transfer pages will now use the API:
- `/App/authorized-file-transfer` - Main transfers page
- `/App/authorized-file-transfer-view` - Transfer details view

## Running the Application

### Development Mode
```bash
ng serve
```
This will start the development server with proxy configuration.

### Production Mode
Update `src/environments/environment.prod.ts` with your production API URL before building.

## Expected API Response Format

### Transfer Object:
```json
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
```

### Transfer Types:
- POLICY_SURRENDER
- PARTIAL_MATURITIES
- FULL_MATURITIES
- INVESTMENT_MATURITIES
- POLICY_LOAN
- POLICY_TERMINATION
- PARTIAL_WITHDRAWAL
- ANNUITY_MATURITIES
- DEATH_CLAIM
- COMMISSION
- POLICY_CANCELLATION

## Troubleshooting

### CORS Issues
If you encounter CORS issues:
1. Ensure your API includes proper CORS headers
2. Check that the proxy configuration is working
3. Verify the ngrok endpoint is accessible

### API Connection Issues
1. Check the browser console for error messages
2. Verify the ngrok URL is still active
3. Test the API endpoints directly using tools like Postman
4. Use the API test component at `/App/api-test`

### Fallback Behavior
If API calls fail, the application will:
1. Log errors to the console
2. Fall back to localStorage data
3. Continue normal operation with local data

## Next Steps

1. **Backend Implementation**: Ensure your API implements the expected endpoints
2. **Authentication**: Add authentication headers if required
3. **Error Handling**: Implement proper error handling in your API
4. **Data Validation**: Ensure API responses match the expected format
5. **Testing**: Test all CRUD operations through the UI
