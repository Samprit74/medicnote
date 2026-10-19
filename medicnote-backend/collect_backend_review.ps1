$ErrorActionPreference = "Stop"

# Run from the Spring Boot backend project root (the folder containing pom.xml or build.gradle)
$Root = (Get-Location).Path
$OutputFile = Join-Path $Root "backend_review_output.txt"

# --- sanity check: are we at a project root? ---
$hasPom    = Test-Path (Join-Path $Root "pom.xml")
$hasGradle = (Test-Path (Join-Path $Root "build.gradle")) -or (Test-Path (Join-Path $Root "build.gradle.kts"))
if (-not ($hasPom -or $hasGradle)) {
    Write-Warning "No pom.xml or build.gradle found in $Root. Are you sure this is the project root?"
    $ans = Read-Host "Continue anyway? (y/N)"
    if ($ans -notmatch '^(y|yes)$') { exit 1 }
}

$ExcludedDirs = @(
    ".git", ".idea", ".vscode", "target", "build",
    "out", "node_modules", ".gradle", "bin", "dist"
)

$Extensions = @(
    ".java", ".xml", ".yml", ".yaml", ".properties",
    ".sql", ".json", ".md"
)

# Names that look like they may contain secrets — exclude from export
$SecretNamePatterns = @(
    '(^|[.\-_])(env|secret|secrets|credentials|credential|keystore|truststore|password|passwd|token|apikey|api-key)($|[.\-_])',
    '\.(pem|key|p12|pfx|jks|keystore|truststore)$',
    '^id_(rsa|dsa|ecdsa|ed25519)(\.|$)'
)

# --- gather files ---
$Files = Get-ChildItem -Path $Root -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $RelativePath = $_.FullName.Substring($Root.Length).TrimStart('\', '/')
        $Parts = $RelativePath -split '[\\/]'

        # not inside an excluded directory
        ($Parts | Where-Object { $ExcludedDirs -contains $_ }).Count -eq 0 -and

        # allowed extension
        $Extensions -contains $_.Extension.ToLower() -and

        # not a secret-looking filename
        -not ($SecretNamePatterns | Where-Object { $_.Name -match $_ })   # see note below
    } |
    Sort-Object FullName

# NOTE: the line above with -not ($SecretNamePatterns ... ) is intentionally
# rewritten correctly below — see corrected Where-Object.

$Files = Get-ChildItem -Path $Root -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $name = $_.Name
        $rel  = $_.FullName.Substring($Root.Length).TrimStart('\', '/')
        $parts = $rel -split '[\\/]'

        if (($parts | Where-Object { $ExcludedDirs -contains $_ }).Count -gt 0) { return $false }
        if (-not ($Extensions -contains $_.Extension.ToLower()))                { return $false }

        foreach ($pat in $SecretNamePatterns) {
            if ($name -match $pat) { return $false }
        }
        return $true
    } |
    Sort-Object FullName

# --- write output as UTF-8 WITHOUT BOM, one file at a time ---
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# Truncate / create output
[System.IO.File]::WriteAllText($OutputFile, "", $utf8NoBom)

# Use a StreamWriter so we append efficiently and consistently
$sw = New-Object System.IO.StreamWriter($OutputFile, $true, $utf8NoBom)
try {
    $sw.WriteLine("MEDICNOTE BACKEND REVIEW")
    $sw.WriteLine("Project root: $Root")
    $sw.WriteLine("Generated:   $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')")
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
Write-Host "IMPORTANT: Review the output for secrets (passwords, tokens, connection strings) before sharing." -ForegroundColor Yellow
Write-Host "Also check: src/main/resources/application*.yml, application*.properties for hardcoded creds." -ForegroundColor Yellow