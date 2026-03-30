$path = "d:\GITHUB\HTML_CON_GLOBAL\global-model-data.js"
$text = [System.IO.File]::ReadAllText($path)

$start = $text.IndexOf('[[')
$end = $text.LastIndexOf(']]')

if ($start -ge 0 -and $end -ge 0) {
    $jsonContent = $text.Substring($start, $end - $start + 2)
    # Undo the previous escape step
    $jsonContent = $jsonContent.Replace("\'", "'").Replace("\\", "\")
    
    $finalOutput = "// Optimized format by Antigravity`nvar globalExcelDataRaw = " + $jsonContent + ";`nvar globalExcelData = globalExcelDataRaw.map(function(r) { return { corp: r[0], model: r[1], lv2: r[2], lv3: r[3] }; });`n"
    
    [System.IO.File]::WriteAllText($path, $finalOutput)
    Write-Output "Successfully fixed the script layout!"
} else {
    Write-Output "Array not found!"
}
