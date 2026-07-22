# ========================================================
# CampusAI - Dev environment checker & launcher script
# ========================================================

Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "      CampusAI Environment Diagnostics Tool" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Java JDK
Write-Host "[1/3] Checking Java Development Kit (JDK)..." -NoNewline
$javaCheck = Get-Command java -ErrorAction SilentlyContinue
if ($javaCheck) {
    $javaVer = & java -version 2>&1 | Out-String
    Write-Host " Found!" -ForegroundColor Green
    Write-Host "Details: $javaVer" -ForegroundColor Gray
} else {
    Write-Host " Missing!" -ForegroundColor Red
    Write-Host "Warning: Java JDK 17+ is required to compile and run the Spring Boot backend." -ForegroundColor Yellow
}
Write-Host ""

# 2. Check MySQL Database
Write-Host "[2/3] Checking MySQL Database Service..." -NoNewline
$mysqlCheck = Get-Command mysql -ErrorAction SilentlyContinue
if ($mysqlCheck) {
    Write-Host " Found!" -ForegroundColor Green
    $mysqlVer = & mysql --version
    Write-Host "Details: $mysqlVer" -ForegroundColor Gray
} else {
    Write-Host " Missing/Not in PATH!" -ForegroundColor Yellow
    Write-Host "Note: Ensure MySQL is installed and running on port 3306 before starting the backend." -ForegroundColor Gray
}
Write-Host ""

# 3. Check Maven compiler
Write-Host "[3/3] Checking Apache Maven..." -NoNewline
$mvnCheck = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvnCheck) {
    Write-Host " Found!" -ForegroundColor Green
    $mvnVer = & mvn -version | Out-String
    Write-Host "Details: $mvnVer" -ForegroundColor Gray
} else {
    Write-Host " Missing/Not in PATH!" -ForegroundColor Yellow
    Write-Host "Note: If Maven is missing, you can run the project directly through your IDE (IntelliJ IDEA / Eclipse)." -ForegroundColor Gray
}
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "                Execution Guide" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "1. Frontend Quick Demo:" -ForegroundColor White
Write-Host "   Open a browser and navigate to: http://localhost:3000" -ForegroundColor Gray
Write-Host "   (Already running in your active session background!)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy Backend REST API (Live Database Mode):" -ForegroundColor White
Write-Host "   a) Import database schema from: database/schema.sql" -ForegroundColor Gray
Write-Host "   b) Import initial seed records from: database/data.sql" -ForegroundColor Gray
Write-Host "   c) Update database credentials in: backend/src/main/resources/application.properties" -ForegroundColor Gray
Write-Host "   d) Start Spring Boot server: Run backend/src/main/java/.../CampusAiApplication.java in your IDE" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close this diagnostics tool..."
$null = [Console]::ReadKey()
