
$root = (Get-Location).Path
$outFile = Join-Path $root "frontend_all_src.txt"

$extensions = @(".ts", ".tsx", ".js", ".jsx", ".css", ".json")
$excludeFolders = @("node_modules", "dist", "build", "coverage", ".git")
$src = Join-Path $root "src"

if (!(Test-Path $src)) {
    Write-Host "ERROR: Run this script from the medicnote-frontend folder."
    exit
}

$files = Get-ChildItem -Path $src -Recurse -File |
    Where-Object {
        $extensions -contains $_.Extension.ToLower() -and
        ($relative = $_.FullName.Substring($src.Length + 1)) -and
        -not (($relative -split '[\\/]' | Where-Object { $excludeFolders -contains $_ }).Count -gt 0)
    } |
    Sort-Object FullName

$previousBatches = @(
    "src/main.tsx",
    "src/App.tsx",
    "src/App.css",
    "src/index.css",
    "src/context/AuthContext.tsx",
    "src/context/ThemeContext.tsx",
    "src/hooks/useAuth.ts",
    "src/routes/ProtectedRoute.tsx",
    "src/routes/AppRoutes.tsx",
    "src/api/axiosClient.ts",
    "src/api/endpoints.ts",
    "src/services/authService.ts",
    "src/services/patientService.ts",
    "src/services/doctorService.ts",
    "src/services/appointmentService.ts",
    "src/services/prescriptionService.ts",
    "src/services/dashboardService.ts",
    "src/hooks/useApi.ts",
    "src/hooks/useDebounce.ts",
    "src/hooks/usePaginated.ts",
    "src/lib/errorHandler.ts",
    "src/lib/jwt.ts",
    "src/lib/constants.ts",
    "src/lib/utils.ts",
    "src/lib/formatters.ts"
)

$previousBatches += @(
    "src/types/api.types.ts",
    "src/types/auth.types.ts",
    "src/types/user.types.ts",
    "src/types/doctor.types.ts",
    "src/types/patient.types.ts",
    "src/types/appointment.types.ts",
    "src/types/prescription.types.ts",
    "src/types/dashboard.types.ts",
    "src/components/common/NotificationBell.tsx",
    "src/components/common/EmptyIllustration.tsx",
    "src/components/common/Float.tsx",
    "src/components/common/Skeletons.tsx",
    "src/components/appointment/BookAppointmentDialog.tsx",
    "src/components/dashboard/WelcomeBanner.tsx",
    "src/components/dashboard/StatsCard.tsx",
    "src/components/dashboard/AppointmentCard.tsx",
    "src/components/dashboard/ProfileCard.tsx",
    "src/components/dashboard/QuickActions.tsx",
    "src/components/dashboard/ScheduledEvents.tsx"
)

$previousBatches += @(
    "src/components/layout/DashboardLayout.tsx",
    "src/components/layout/Sidebar.tsx",
    "src/components/layout/Navbar.tsx",
    "src/hooks/use-mobile.tsx",
    "src/hooks/use-toast.ts",
    "src/hooks/useTheme.ts"
)

# Also exclude all files under pages because Batch 8 collected them.
$remainingFiles = $files | Where-Object {
    $relative = $_.FullName.Substring($root.Length + 1).Replace("\", "/")
    -not ($previousBatches -contains $relative) -and
    -not ($relative -match '^src/pages/')
}

$writer = [System.IO.StreamWriter]::new($outFile, $false, [System.Text.UTF8Encoding]::new($false))

try {
    $writer.WriteLine("MEDICNOTE FRONTEND - REMAINING SRC FILES")
    $writer.WriteLine("Generated: $(Get-Date)")
    $writer.WriteLine("Remaining files: $($remainingFiles.Count)")
    $writer.WriteLine("")

    foreach ($file in $remainingFiles) {
        $relative = $file.FullName.Substring($root.Length + 1).Replace("\", "/")
        $writer.WriteLine(("=" * 90))
        $writer.WriteLine("FILE: $relative")
        $writer.WriteLine(("=" * 90))

        try {
            $writer.WriteLine([System.IO.File]::ReadAllText($file.FullName))
        }
        catch {
            $writer.WriteLine("[Could not read file: $($_.Exception.Message)]")
        }

        $writer.WriteLine("")
    }
}
finally {
    $writer.Dispose()
}

Write-Host "Done. Remaining files collected: $($remainingFiles.Count)"
Write-Host "Output: $outFile"
