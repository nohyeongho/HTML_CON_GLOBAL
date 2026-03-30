$path = "d:\GITHUB\HTML_CON_GLOBAL\global-model-data.js"
$text = [System.IO.File]::ReadAllText($path)
$pattern = '\{"corp":"(.*?)","model":"(.*?)","lv2":"(.*?)","lv3":"(.*?)"\}'
$newText = [regex]::Replace($text, $pattern, '["$1","$2","$3","$4"]')
$newText = $newText.Replace('var globalExcelData = ', '').TrimEnd(';')
$escaped = $newText.Replace('\', '\\').Replace("'", "\'")
$finalOutput = "// Optimized format by Antigravity`nvar globalExcelDataRaw = JSON.parse('$escaped');`nvar globalExcelData = globalExcelDataRaw.map(function(r) { return { corp: r[0], model: r[1], lv2: r[2], lv3: r[3] }; });`n"
[System.IO.File]::WriteAllText($path, $finalOutput)
Write-Output "Successfully converted global-model-data.js"
