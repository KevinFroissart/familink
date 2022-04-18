function Set-Interval {
    $global:images = (Get-ChildItem -File .\images | Measure-Object).Count - 1

    if ($global:images -le 20) {
        $global:delta = 20
    } else {
        $global:delta = $global:images
    }
    if ($global:images -le 9) {
        if ($global:images -eq 9) {
            $global:interval = 5
        }
        else {
            $global:interval = [int] (40 / $global:images)
        } 
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
    switch($global:interval) {
        40 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=40 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        20 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=20 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        13 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=13 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        10 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=10 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        8 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=8 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        7 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=7 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        6 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=6 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        5 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=5 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
        4 {
            Start-ThreadJob -ScriptBlock { 
                ImageViewer.exe --interval=4 --random=on --repeat=off --fullscreen=on --effect=off --stretchIn=on --stretchOut=on --includSubFolders=off --stayOnTop=on 'images' 
            }
        }
    }
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
    Write-Output "Prochain scraping dans $(($global:images*$global:interval - $global:elapsed - $global:delta))"

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
