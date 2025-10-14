# Test PilahPintar API endpoints
Write-Host "Testing PilahPintar API..." -ForegroundColor Cyan

# Wait a moment for server to be ready
Start-Sleep -Seconds 2

# Test Health Check
try {
    Write-Host "`nTesting Health Check..." -ForegroundColor Cyan
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 10
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   Health check passed" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.StatusCode)" -ForegroundColor Gray
    Write-Host "   Database: $($healthData.database)" -ForegroundColor Gray
} catch {
    Write-Host "   Health check failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test User Registration
try {
    Write-Host "`nTesting User Registration..." -ForegroundColor Cyan
    $registerBody = @{
        name = "PowerShell Test User"
        email = "pstest.$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
        password = "Test123!@#"
        location = @{
            address = "Jakarta, Indonesia"
            coordinates = @(-6.2088, 106.8456)
        }
    } | ConvertTo-Json -Depth 3

    $registerResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -TimeoutSec 10
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "   User registration successful" -ForegroundColor Green
    Write-Host "   Email: $($registerData.user.email)" -ForegroundColor Gray
    Write-Host "   User ID: $($registerData.user._id)" -ForegroundColor Gray

    # Store token
    $global:authToken = $registerData.token
} catch {
    Write-Host "   User registration failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test User Login
try {
    Write-Host "`nTesting User Login..." -ForegroundColor Cyan
    $loginBody = @{
        email = "andi@pilahpintar.com"
        password = "123456"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 10
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "   User login successful" -ForegroundColor Green
    Write-Host "   User: $($loginData.user.name)" -ForegroundColor Gray
    Write-Host "   User ID: $($loginData.user._id)" -ForegroundColor Gray

    # Update token
    $global:authToken = $loginData.token
} catch {
    Write-Host "   User login failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test User Profile
if ($global:authToken) {
    try {
        Write-Host "`nTesting User Profile..." -ForegroundColor Cyan
        $headers = @{
            "Authorization" = "Bearer $($global:authToken)"
            "Content-Type" = "application/json"
        }

        $profileResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/user/profile" -Method GET -Headers $headers -TimeoutSec 10
        $profileData = $profileResponse.Content | ConvertFrom-Json
        Write-Host "   User profile retrieved successfully" -ForegroundColor Green
        Write-Host "   Name: $($profileData.user.name)" -ForegroundColor Gray
        Write-Host "   Email: $($profileData.user.email)" -ForegroundColor Gray
        Write-Host "   Points: $($profileData.user.profile.points)" -ForegroundColor Gray
    } catch {
        Write-Host "   User profile retrieval failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`nTesting User Profile..." -ForegroundColor Cyan
    Write-Host "   No auth token available, skipping test" -ForegroundColor Yellow
}

# Test Waste Classification
if ($global:authToken) {
    try {
        Write-Host "`nTesting Waste Classification..." -ForegroundColor Cyan
        $classificationBody = @{
            wasteType = "plastic"
            confidence = 95.5
            imageUrl = "https://example.com/plastic-bottle.jpg"
            location = @{
                address = "Jakarta Selatan, Indonesia"
                coordinates = @(-6.2615, 106.7942)
            }
        } | ConvertTo-Json -Depth 3

        $headers = @{
            "Authorization" = "Bearer $($global:authToken)"
            "Content-Type" = "application/json"
        }

        $classificationResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/classification" -Method POST -Body $classificationBody -Headers $headers -TimeoutSec 10
        $classificationData = $classificationResponse.Content | ConvertFrom-Json
        Write-Host "   Waste classification successful" -ForegroundColor Green
        Write-Host "   Type: $($classificationData.classification.wasteType)" -ForegroundColor Gray
        Write-Host "   Confidence: $($classificationData.classification.confidence)%" -ForegroundColor Gray
    } catch {
        Write-Host "   Waste classification failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`nTesting Waste Classification..." -ForegroundColor Cyan
    Write-Host "   No auth token available, skipping test" -ForegroundColor Yellow
}

# Test Education Content
try {
    Write-Host "`nTesting Education Content..." -ForegroundColor Cyan
    $educationResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/education" -Method GET -TimeoutSec 10
    $educationData = $educationResponse.Content | ConvertFrom-Json
    Write-Host "   Education content retrieved successfully" -ForegroundColor Green
    Write-Host "   Articles count: $($educationData.articles.count)" -ForegroundColor Gray
    Write-Host "   Videos count: $($educationData.videos.count)" -ForegroundColor Gray
} catch {
    Write-Host "   Education content retrieval failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAPI Testing Complete!" -ForegroundColor Cyan
