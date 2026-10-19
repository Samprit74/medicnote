
$ErrorActionPreference = "Stop"

$root = Get-Location
$output = Join-Path $root "frontend_batch3.txt"

$files = @(
    "src/api/axiosClient.ts",
    "src/api/endpoints.ts",
    "src/services/api.ts",
    "src/hooks/useApi.ts",
    "src/hooks/useDebounce.ts",
    "src/hooks/usePaginated.ts",
    "src/lib/errorHandler.ts",
    "src/lib/jwt.ts",
    "src/types/api.types.ts",
    "src/types/auth.types.ts",
    "src/types/user.types.ts"
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
Write-Host "Batch 3 collection complete!"
Write-Host "Output: $output"
