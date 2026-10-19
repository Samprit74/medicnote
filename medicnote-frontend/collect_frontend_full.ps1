$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$OutputFile = Join-Path $Root "frontend_full_review.txt"

# Sanity check
if (-not (Test-Path (Join-Path $Root "package.json"))) {
    Write-Warning "No package.json in $Root. Are you sure this is the frontend project root?"
    $ans = Read-Host "Continue anyway? (y/N)"
    if ($ans -notmatch '^(y|yes)$') { exit 1 }
}

# Directories never worth exporting
$ExcludedDirs = @(
    ".git", ".idea", ".vscode", ".vs", ".history",
    "node_modules", "dist", "build", "out",
    ".next", ".nuxt", ".svelte-kit", ".angular",
    "coverage", ".nyc_output",
    ".cache", ".parcel-cache", ".turbo", ".vite",
    ".eslintcache", ".stylelintcache",
    "public/vendor"
)

# Extensions to include (source, config, style, docs, type defs)
$Extensions = @(
    ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts",
    ".vue", ".svelte",
    ".css", ".scss", ".sass", ".less", ".styl",
    ".html", ".htm",
    ".json", ".jsonc", ".json5",
    ".yml", ".yaml", ".toml", ".ini", ".conf", ".config",
    ".md", ".mdx", ".txt",
    ".graphql", ".gql",
    ".svg"
)

# Files that are never useful / always safe to skip
$ExcludedFiles = @(
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
    ".eslintcache", ".stylelintcache",
    "frontend_full_review.txt"
)

# Filename patterns that usually contain secrets or per-machine data
$SecretNamePatterns = @(
    '^\.env$',                       # real .env (may contain secrets) — use .env.example instead
    '^\.env\.local$',
    '^\.env\.[^.]+\.local$',
    '(^|[.\-_])(secret|secrets|credentials|credential|token|apikey|api-key)($|[.\-_])',
    '\.(pem|key|p12|pfx|jks|keystore|truststore)$'
)

# Gather files
$Files = Get-ChildItem -Path $Root -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $name = $_.Name
        $rel  = $_.FullName.Substring($Root.Length).TrimStart('\', '/')
        $parts = $rel -split '[\\/]'
        $ext  = $_.Extension.ToLower()

        # Excluded directory anywhere in path?
        if (($parts | Where-Object { $ExcludedDirs -contains $_ }).Count -gt 0) { return $false }

        # Excluded exact filenames?
        if ($ExcludedFiles -contains $name) { return $false }

        # Secret-looking names?
        foreach ($pat in $SecretNamePatterns) {
            if ($name -match $pat) { return $false }
        }

        # .env.example and .env.sample are welcome
        if ($name -eq ".env.example" -or $name -eq ".env.sample" -or $name -eq ".env.template") {
            return $true
        }

        # Extension filter
        if (-not ($Extensions -contains $ext)) { return $false }

        return $true
    } |
    Sort-Object FullName

# Write output as UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($OutputFile, "", $utf8NoBom)

$sw = New-Object System.IO.StreamWriter($OutputFile, $true, $utf8NoBom)
try {
    $sw.WriteLine("MEDICNOTE FRONTEND — FULL REVIEW EXPORT")
    $sw.WriteLine("Project root: $Root")
    $sw.WriteLine("Generated:    $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')")
    $sw.WriteLine("Files included: $($Files.Count)")
    $sw.WriteLine()

    foreach ($File in $Files) {
        $relative = $File.FullName.Substring($Root.Length).TrimStart('\', '/')
        $sep = ("=" * 90)

        $sw.WriteLine()
        $sw.WriteLine($sep)
        $sw.WriteLine("FILE: $relative")
        $sw.WriteLine($sep)

        try {
            $content = Get-Content -LiteralPath $File.FullName -Raw -ErrorAction Stop
            $sw.Write($content)
            if (-not $content.EndsWith("`n")) { $sw.WriteLine() }
        }
        catch {
            $sw.WriteLine("[READ ERROR: $($_.Exception.Message)]")
        }
    }
}
finally {
    $sw.Dispose()
}

Write-Host ""
Write-Host "Export completed." -ForegroundColor Green
Write-Host "Output: $OutputFile" -ForegroundColor Cyan
Write-Host "Files collected: $($Files.Count)"
Write-Host ""
Write-Host "IMPORTANT: Open the output and scan for any real secrets before sharing." -ForegroundColor Yellow
Write-Host "Real .env files are excluded on purpose; .env.example is kept. If you need to share .env values, redact them first." -ForegroundColor Yellow
Write-Host ""
Write-Host "Tip: files under src/ (especially src/api, src/services, src/pages, src/components) are the ones I will need most for diagnosing the 'records not showing' issue." -ForegroundColor Yellow