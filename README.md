# Familink Carousel
Dynamic Familink scrapper and Windows Carousel (made for a wedding)

## REQUIRED (windows)
[https://github.com/torum/Image-viewer](https://github.com/torum/Image-viewer)   
Or on [Microsoft Store](https://www.microsoft.com/fr-fr/p/simple-image-viewer/9nnzpqd4wjck?rtc=1&activetab=pivot:overviewtab)   
[NPM](https://nodejs.org/en/download/)   
`Install-Module -Name ThreadJob -Scope CurrentUser`   

## START via PowerShell
`npm i`
`.\carousel.ps1`

## Config file
config.json -> 

{
	"login": "xxxx@xx.xxx",
	"password": "xxx",
	"headless": false | true
}

## My usage on raspberry pi 3
Installed feh `sudo apt install fef`   
Created a service for the slideshow:   
`sudo nano /etc/systemd/system/slideshow.service`   
```
[Unit]
Description=Slideshow Service
After=network.target

[Service]
ExecStart=/bin/bash /home/kfroissart/git/familink/slideshow.sh
WorkingDirectory=/home/kfroissart/git/familink
User=kfroissart
Group=kfroissart
Environment=DISPLAY=:0
Environment=XAUTHORITY=/home/kfroissart/.Xauthority
Restart=always

[Install]
WantedBy=default.target
```   
`sudo systemctl enable slideshow.service`   
`sudo journalctl -u slideshow.service`  
Disabled screen save mode :    
`xset s off`    
`xset -dpms`



If you ever need to remotely activate the slideshow, please do `export DISPLAY=:0`
