# PowerShell script to add email configuration to .env file
# Run: .\add-email-config.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "HEALINK Email Configuration Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Step 1: Get Gmail App Password" -ForegroundColor Yellow
Write-Host "  1. Go to: https://myaccount.google.com/apppasswords" -ForegroundColor White
Write-Host "  2. Select 'Mail' and 'Other (Custom name)'" -ForegroundColor White
Write-Host "  3. Name: HEALINK Backend" -ForegroundColor White
Write-Host "  4. Click 'Generate'" -ForegroundColor White
Write-Host "  5. Copy the 16-character password`n" -ForegroundColor White

$emailUser = Read-Host "Enter your Gmail address (e.g., your-email@gmail.com)"
$emailPass = Read-Host "Enter your Gmail App Password (16 characters, no spaces)" -AsSecureString

# Convert secure string to plain text
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($emailPass)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

# Remove spaces from password
$plainPassword = $plainPassword -replace '\s', ''

if ([string]::IsNullOrWhiteSpace($emailUser) -or [string]::IsNullOrWhiteSpace($plainPassword)) {
    Write-Host "`n❌ Email and password cannot be empty!" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "`n❌ .env file not found!" -ForegroundColor Red
    exit 1
}

# Read current .env content
$envContent = Get-Content ".env" -Raw

# Remove commented email lines if they exist
$envContent = $envContent -replace '#\s*EMAIL_USER=.*\r?\n', ''
$envContent = $envContent -replace '#\s*EMAIL_PASSWORD=.*\r?\n', ''

# Remove existing EMAIL_USER and EMAIL_PASSWORD if they exist (uncommented)
$envContent = $envContent -replace 'EMAIL_USER=.*\r?\n', ''
$envContent = $envContent -replace 'EMAIL_PASSWORD=.*\r?\n', ''

# Add new email configuration at the end
$envContent = $envContent.TrimEnd() + "`n`n# Email Configuration`n"
$envContent = $envContent + "EMAIL_USER=$emailUser`n"
$envContent = $envContent + "EMAIL_PASSWORD=$plainPassword`n"

# Write back to .env file
Set-Content -Path ".env" -Value $envContent -NoNewline

Write-Host "`n✅ Email configuration added to .env file!" -ForegroundColor Green
Write-Host "   EMAIL_USER: $emailUser" -ForegroundColor White
Write-Host "   EMAIL_PASSWORD: ******** (hidden)`n" -ForegroundColor White

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your backend server: npm start" -ForegroundColor White
Write-Host "  2. Test email: node test-email.js $emailUser" -ForegroundColor White
Write-Host "`n"

