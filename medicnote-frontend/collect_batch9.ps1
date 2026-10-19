
$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$output = Join-Path $root "frontend_batch9.txt"

# Directories to inventory and collect
$sourceDirs = @(
    "src\components",
    "src\hooks",
    "src\lib",
    "src\utils",
    "src\assets"
)

# Root-level frontend configuration files
$rootFiles = @(
    "index.html",
    "postcss.config.js",
    "postcss.config.cjs",
    "tailwind.config.js",
    "tailwind.config.ts",
    "eslint.config.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    "tsconfig.json",
    "tsconfig.node.json",
    "components.json",
    ".env.example",
    ".env.sample"
)

# Files already collected in previous batches
$excludeFiles = @(
    "src\components\layout\DashboardLayout.tsx",
    "src\components\layout\Sidebar.tsx",
    "src\components\layout\Navbar.tsx",
    "src\components\common\NotificationBell.tsx",
    "src\components\common\EmptyIllustration.tsx",
    "src\components\common\Float.tsx",
    "src\components\common\Skeletons.tsx",
    "src\components\appointment\BookAppointmentDialog.tsx",
    "src\components\dashboard\WelcomeBanner.tsx",
    "src\components\dashboard\StatsCard.tsx",
    "src\components\dashboard\AppointmentCard.tsx",
    "src\components\dashboard\ProfileCard.tsx",
    "src\components\dashboard\QuickActions.tsx",
    "src\components\dashboard\ScheduledEvents.tsx",
    "src\hooks\useAuth.ts",
    "src\hooks\useApi.ts",
    "src\hooks\useDebounce.ts",
    "src\hooks\usePaginated.ts",
    "src\lib\constants.ts",
    "src\lib\utils.ts",
    "src\lib\formatters.ts"
)

$excludeSet = @{}
foreach ($path in $excludeFiles) {
    $excludeSet[$path.Replace("/", "\").ToLowerInvariant()] = $true
}

$files = @()

foreach ($dir in $sourceDirs) {
    $fullDir = Join-Path $root $dir

    if (Test-Path $fullDir) {
        $files += Get-ChildItem $fullDir -Recurse -File |
            Where-Object {
                $_.Extension -in @(".tsx", ".ts", ".jsx", ".js", ".css", ".json")
            }
    }
}

foreach ($name in $rootFiles) {
    $fullPath = Join-Path $root $name

    if (Test-Path $fullPath -PathType Leaf) {
        $files += Get-Item $fullPath
    }
}

$files = $files |
    Sort-Object FullName -Unique |
    Where-Object {
        $relative = $_.FullName.Substring($root.Length + 1)
        -not $excludeSet.ContainsKey($relative.Replace("/", "\").ToLowerInvariant())
    }

"MEDICNOTE FRONTEND - BATCH 9" | Set-Content $output
"Collected: $(Get-Date)" | Add-Content $output

"`n========== FILE INVENTORY ==========`n" | Add-Content $output

foreach ($file in $files) {
    $relative = $file.FullName.Substring($root.Length + 1)
    $relative | Add-Content $output
}

"`n========== FILE SOURCE CODE ==========`n" | Add-Content $output

foreach ($file in $files) {
    $relative = $file.FullName.Substring($root.Length + 1)

    "`n========== FILE: $relative ==========`n" |
        Add-Content $output

    Get-Content $file.FullName -Raw | Add-Content $output
}

"`nBatch 9 collection complete!" | Write-Host
Write-Host "Files collected: $($files.Count)"
Write-Host "Output: $output"

