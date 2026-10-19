
$ErrorActionPreference = "Stop"

$root = Get-Location
$output = Join-Path $root "frontend_batch6.txt"

$files = @(
    "src/components/layout/DashboardLayout.tsx",
    "src/components/layout/Sidebar.tsx",
    "src/components/layout/Header.tsx",
    "src/components/layout/Navbar.tsx",
    "src/components/layout/AppSidebar.tsx",
    "src/components/layout/Topbar.tsx",
    "src/components/layout/ProtectedLayout.tsx",
    "src/components/notifications/NotificationBell.tsx",
    "src/components/notifications/NotificationCenter.tsx",
    "src/components/notifications/Notifications.tsx",
    "src/context/ThemeContext.tsx",
    "src/context/AuthContext.tsx",
    "src/hooks/useAuth.ts"
)

Set-Content -Path $output -Value "" -Encoding utf8

foreach ($file in $files) {
    $path = Join-Path $root $file

    Add-Content -Path $output -Value "`r`n"
    Add-Content -Path $output -Value "========== FILE: $file =========="

    if (Test-Path -LiteralPath $path -PathType Leaf) {
        Get-Content -LiteralPath $path -Raw |
            Add-Content -Path $output
    }
    else {
        Add-Content -Path $output -Value "[FILE NOT FOUND]"
        Write-Warning "Missing file: $file"
    }
}

Write-Host ""
Write-Host "Batch 6 collection complete!"
Write-Host "Output: $output"
