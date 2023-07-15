sudo systemctl stop slideshow.service && mv last_save/*.jpg old_images/ ; mv images/*.jpg last_save/ ; npm start ; sudo systemctl start slideshow.service
