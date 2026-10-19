
$ErrorActionPreference = "Stop"

$root = Get-Location
$output = Join-Path $root "frontend_batch2.txt"

$files = @(
    "src/context/AuthContext.tsx",
    "src/hooks/useAuth.ts",
    "src/routes/ProtectedRoute.tsx",
    "src/routes/AppRoutes.tsx",
    "src/services/authService.ts",
    "src/pages/auth/Login.tsx",
    "src/pages/auth/Register.tsx"
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
Write-Host "Collection complete!"
Write-Host "Output: $output"
