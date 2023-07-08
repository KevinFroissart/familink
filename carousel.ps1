function Set-Interval {
    $global:images = (Get-ChildItem -File .\images | Measure-Object).Count - 1
    $global:delta = [Math]::Min($global:images, 20)

    if ($global:images -le 9) {
        $global:interval = if ($global:images -eq 9) { 5 } else { [Math]::Ceiling(40 / $global:images) }
    } else {
        $global:interval = 4
    }
}

function Scrap-Images {
    $StopWatchScrap = New-Object -TypeName 'System.Diagnostics.Stopwatch'
    $StopWatchScrap.Start()

    npm start

    $global:elapsed = $StopWatchScrap.Elapsed.Seconds
    Write-Output "Done with scrapping"
}

function Start-Carousel {
    Start-ThreadJob -ScriptBlock {
        param($interval)
        ImageViewer.exe --interval=$interval --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images'
    } -ArgumentList $global:interval | Out-Null
}

Scrap-Images
Set-Interval

while($true) {
    [bool] $updated = $false

    $StopWatch = New-Object -TypeName 'System.Diagnostics.Stopwatch'
    $StopWatch.Start()

    Start-Carousel

    Write-Output "Images: $($global:images)"
    Write-Output "Temps d'exec total: $($global:images*$global:interval)"
    Write-Output "Temps du scraping: $($global:elapsed)"
    Write-Output "Delta: $($global:delta)"
    Write-Output "Interval: $($global:interval)"
    Write-Output "Prochain scraping dans $(($global:images*$global:interval - $global:elapsed - $global:delta)) secondes"

    while($true) {
        if ($StopWatch.Elapsed.TotalSeconds -ge ($global:images*$global:interval - $global:elapsed - $global:delta) -And !$updated) {
            $updated = $true
            Scrap-Images
            Set-Interval
        }
        if ($StopWatch.Elapsed.TotalSeconds -ge ($global:images*$global:interval + $global:interval)) {
            Write-Output "Stopping processes"
            Get-job | Remove-Job -Force
            break
        }
    }
}
