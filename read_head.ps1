$text = [System.IO.File]::ReadAllText("d:\GITHUB\HTML_CON_GLOBAL\global-model-data.js")
if ($text.Length -gt 500) {
    Write-Output $text.Substring(0, 500)
    Write-Output "..."
    Write-Output $text.Substring($text.Length - 500)
} else {
    Write-Output $text
}
