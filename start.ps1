param(
    [switch]$StopOnly,
    [switch]$WithStudio
)

# 兼容 --WithStudio 写法
if ($args -contains '--WithStudio') {
    $WithStudio = $true
}

$FRONTEND_PORT = 3000
$BACKEND_PORT = 3001
$STUDIO_PORT = 5555
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$PARENT_DIR = Split-Path $PROJECT_ROOT -Parent
$FRONTEND_DIR = Join-Path $PARENT_DIR "ThresholdArchive-Frontend"
$BACKEND_DIR = Join-Path $PARENT_DIR "ThresholdArchive-Backend"

$global:backendPid = $null
$global:frontendPid = $null
$global:studioPid = $null
$global:exiting = $false

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = switch ($Level) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR"   { "Red" }
        default   { "White" }
    }
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

function Stop-PidTree {
    param([int]$Pid)
    try { taskkill /F /T /PID $Pid 2>$null | Out-Null } catch { }
}

function Stop-Port {
    param([int]$Port)
    try {
        netstat -ano 2>$null | Select-String ":$Port\s" | Select-String "LISTENING" | ForEach-Object {
            $parts = ($_ -split '\s+')[-1]
            if ($parts -match '^\d+$' -and $parts -ne '0') {
                taskkill /F /T /PID $parts 2>$null | Out-Null
            }
        }
    } catch { }
}

function Cleanup {
    if ($global:exiting) { return }
    $global:exiting = $true
    Write-Host "`n"
    Write-Log "正在停止服务..." "WARNING"

    if ($global:backendPid) { Stop-PidTree -Pid $global:backendPid }
    if ($global:frontendPid) { Stop-PidTree -Pid $global:frontendPid }
    if ($global:studioPid) { Stop-PidTree -Pid $global:studioPid }

    Stop-Port -Port $BACKEND_PORT
    Stop-Port -Port $FRONTEND_PORT
    Stop-Port -Port $STUDIO_PORT

    Write-Log "所有服务已停止" "SUCCESS"
}

function Stop-All {
    Stop-Port -Port $BACKEND_PORT
    Stop-Port -Port $FRONTEND_PORT
    Stop-Port -Port $STUDIO_PORT
    Write-Log "所有服务已停止" "SUCCESS"
}

if ($StopOnly) {
    Stop-All
    exit 0
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "        边际结构项目启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "前端端口: $FRONTEND_PORT" -ForegroundColor White
Write-Host "后端端口: $BACKEND_PORT" -ForegroundColor White
Write-Host "项目目录: $PARENT_DIR"
Write-Host ""

Write-Log "清理端口占用..."
Stop-Port -Port $BACKEND_PORT
Stop-Port -Port $FRONTEND_PORT
Stop-Port -Port $STUDIO_PORT
Start-Sleep -Milliseconds 300

# 检查并安装依赖
function Ensure-NodeModules {
    param([string]$Dir)
    $nm = Join-Path $Dir "node_modules"
    if (-not (Test-Path $nm)) {
        Write-Log "安装依赖: $Dir ..."
        Push-Location $Dir
        npm install 2>&1 | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
        Pop-Location
    }
}

Ensure-NodeModules -Dir $BACKEND_DIR
Ensure-NodeModules -Dir $FRONTEND_DIR

Write-Log "启动后端服务..."
$backendProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory $BACKEND_DIR -WindowStyle Hidden -PassThru
$global:backendPid = $backendProc.Id

Start-Sleep -Seconds 2

Write-Log "启动前端服务..."
$frontendProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory $FRONTEND_DIR -WindowStyle Hidden -PassThru
$global:frontendPid = $frontendProc.Id

Start-Sleep -Seconds 2

# 启动 Prisma Studio（可选）
if ($WithStudio) {
    Write-Log "启动 Prisma Studio..."
    $studioProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npx prisma studio --port $STUDIO_PORT" -WorkingDirectory $BACKEND_DIR -WindowStyle Hidden -PassThru
    $global:studioPid = $studioProc.Id
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "        服务启动成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "前端地址: " -NoNewline; Write-Host "http://localhost:$FRONTEND_PORT" -ForegroundColor Cyan
Write-Host "后端地址: " -NoNewline; Write-Host "http://localhost:$BACKEND_PORT" -ForegroundColor Cyan
if ($WithStudio) {
    Write-Host "Prisma Studio: " -NoNewline; Write-Host "http://localhost:$STUDIO_PORT" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "按 Ctrl+C 停止所有服务" -ForegroundColor Yellow
Write-Host ""

# 简单轮询 + finally 清理
try {
    while ($true) {
        Start-Sleep -Seconds 1
        $backendAlive = !$backendProc.HasExited
        $frontendAlive = !$frontendProc.HasExited
        if (-not $backendAlive -and -not $frontendAlive) { break }
        if (-not $backendAlive) { Write-Log "后端进程已退出" "WARNING" }
        if (-not $frontendAlive) { Write-Log "前端进程已退出" "WARNING" }
    }
} finally {
    Cleanup
    [Environment]::Exit(0)
}
