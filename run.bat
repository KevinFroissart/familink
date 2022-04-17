:loop
call npm start
Powershell.exe -executionpolicy remotesigned -File  carousel.ps1
goto loop

