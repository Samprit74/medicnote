
$ErrorActionPreference = "Stop"
$root = Get-Location
$output = Join-Path $root "frontend_batch7.txt"

$files = @(
    "src/lib/constants.ts",
    "src/lib/utils.ts",
    "src/lib/formatters.ts",
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
    "src/components/dashboard/ScheduledEvents.tsx",
    "src/types/doctor.types.ts",
    "src/types/patient.types.ts",
    "src/types/appointment.types.ts",
    "src/types/prescription.types.ts",
    "src/types/dashboard.types.ts"
)

"MEDICNOTE FRONTEND - BATCH 7" | Set-Content $output
"Collected: $(Get-Date)" | Add-Content $output

foreach ($file in $files) {
    "`n========== FILE: $file ==========`n" | Add-Content $output

    if (Test-Path $file) {
        Get-Content $file -Raw | Add-Content $output
    }
    else {
        "FILE NOT FOUND" | Add-Content $output
        Write-Warning "Missing file: $file"
    }
}

Write-Host "`nBatch 7 collection complete!"
Write-Host "Output: $output"
