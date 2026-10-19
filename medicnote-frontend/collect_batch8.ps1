
$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
$output = Join-Path $root "frontend_batch8.txt"

$pagesRoot = Join-Path $root "src\pages"

"MEDICNOTE FRONTEND - BATCH 8" | Set-Content $output
"Collected: $(Get-Date)" | Add-Content $output

"`n========== ALL PAGE FILES ==========`n" | Add-Content $output

if (Test-Path $pagesRoot) {
    $pageFiles = Get-ChildItem $pagesRoot -Recurse -File |
        Where-Object { $_.Extension -in @(".tsx", ".ts") }

    foreach ($file in $pageFiles) {
        $relativePath = $file.FullName.Substring($root.Length + 1)
        $relativePath | Add-Content $output
    }

    "`n========== PAGE SOURCE CODE ==========`n" | Add-Content $output

    foreach ($file in $pageFiles) {
        $relativePath = $file.FullName.Substring($root.Length + 1)

        "`n========== FILE: $relativePath ==========`n" |
            Add-Content $output

        Get-Content $file.FullName -Raw | Add-Content $output
    }
}
else {
    "src/pages directory not found." | Add-Content $output
}

Write-Host "`nBatch 8 collection complete!"
Write-Host "Output: $output"
