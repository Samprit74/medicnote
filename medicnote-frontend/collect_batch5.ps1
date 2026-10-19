
$ErrorActionPreference = "Stop"

$root = Get-Location
$output = Join-Path $root "frontend_batch5.txt"

$files = @(
    "src/pages/doctor/DoctorDashboard.tsx",
    "src/pages/doctor/DoctorPatients.tsx",
    "src/pages/doctor/DoctorPrescriptions.tsx",
    "src/pages/doctor/DoctorQueue.tsx",
    "src/pages/doctor/DoctorProfile.tsx",
    "src/services/patientService.ts",
    "src/services/doctorService.ts",
    "src/services/appointmentService.ts",
    "src/services/prescriptionService.ts",
    "src/services/dashboardService.ts",
    "src/types/doctor.types.ts",
    "src/types/patient.types.ts",
    "src/types/appointment.types.ts",
    "src/types/prescription.types.ts",
    "src/types/dashboard.types.ts"
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
Write-Host "Batch 5 collection complete!"
Write-Host "Output: $output"
