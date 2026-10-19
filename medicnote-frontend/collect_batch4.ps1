
$ErrorActionPreference = "Stop"

$root = Get-Location
$output = Join-Path $root "frontend_batch4.txt"

$files = @(
    "src/pages/patient/PatientDashboard.tsx",
    "src/pages/patient/PatientDoctors.tsx",
    "src/pages/patient/PatientAppointments.tsx",
    "src/pages/patient/PatientRecords.tsx",
    "src/pages/patient/PatientPrescriptions.tsx",
    "src/pages/patient/PatientProfile.tsx",
    "src/services/patientService.ts",
    "src/services/doctorService.ts",
    "src/services/appointmentService.ts",
    "src/services/prescriptionService.ts",
    "src/services/dashboardService.ts"
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
Write-Host "Batch 4 collection complete!"
Write-Host "Output: $output"
