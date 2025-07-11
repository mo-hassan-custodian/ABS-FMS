# CORS Configuration Guide

## Why You're Getting CORS Errors

CORS (Cross-Origin Resource Sharing) errors occur because:
1. Your Angular app runs on `http://localhost:4200`
2. Your API runs on a different origin (ngrok URL like `https://abc123.ngrok-free.app`)
3. Browsers block cross-origin requests unless the server explicitly allows them

## Quick Fix: Backend CORS Configuration

Add CORS headers to your backend to allow requests from `http://localhost:4200`.

### For Node.js/Express

#### Option 1: Using cors middleware (Recommended)
```bash
npm install cors
```

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Allow requests from Angular dev server
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));

// Your API routes
app.get('/api/authorized-file-transfers', (req, res) => {
  // Your endpoint logic
});
```

#### Option 2: Manual CORS headers
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### For Python/Flask

```bash
pip install flask-cors
```

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS
CORS(app, origins=['http://localhost:4200'], 
     methods=['GET', 'POST', 'PUT', 'DELETE'],
     allow_headers=['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'])

@app.route('/api/authorized-file-transfers', methods=['GET'])
def get_transfers():
    # Your endpoint logic
    pass
```

### For Python/Django

In `settings.py`:
```python
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'ngrok-skip-browser-warning',
]
```

### For Java/Spring Boot

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

Or using annotations:
```java
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class AuthorizedFileTransferController {
    
    @GetMapping("/api/authorized-file-transfers")
    public List<AuthorizedFileTransfer> getTransfers() {
        // Your endpoint logic
    }
}
```

### For C#/.NET Core

In `Program.cs` or `Startup.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// In Configure method
app.UseCors("AllowAngularDev");
```

## Testing CORS Configuration

### 1. Test with Browser
Open your ngrok URL directly in browser:
`https://your-ngrok-url.ngrok-free.app/api/authorized-file-transfers`

### 2. Test with curl
```bash
curl -H "Origin: http://localhost:4200" \
     -H "ngrok-skip-browser-warning: true" \
     -v https://your-ngrok-url.ngrok-free.app/api/authorized-file-transfers
```

Look for these headers in the response:
- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`

### 3. Test with Angular
Use the API test component: `http://localhost:4200/App/api-test`

## Common CORS Issues

### Issue: "Access to fetch at '...' has been blocked by CORS policy"
**Solution**: Add CORS headers to your backend (see above)

### Issue: "Request header field ngrok-skip-browser-warning is not allowed"
**Solution**: Add `ngrok-skip-browser-warning` to allowed headers in your CORS config

### Issue: "Credentials include but Access-Control-Allow-Credentials is false"
**Solution**: Set `Access-Control-Allow-Credentials: true` in your backend

### Issue: OPTIONS requests failing
**Solution**: Make sure your backend handles OPTIONS preflight requests

## Alternative: Temporary CORS Bypass (Development Only)

⚠️ **For development/testing only** - Start Chrome with disabled security:

```bash
# macOS
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

# Windows
chrome.exe --user-data-dir="c:/temp/chrome_dev_test" --disable-web-security

# Linux
google-chrome --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

**Never use this in production!**

## Verification

Once CORS is configured correctly:
1. No CORS errors in browser console
2. API test component shows successful connection
3. Network tab shows successful API requests
4. Response headers include CORS headers
