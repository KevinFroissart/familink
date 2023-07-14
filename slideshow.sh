#!/bin/bash

# Répertoire contenant les images
IMAGE_DIR="/home/kfroissart/git/familink/images/"

# Boucle infinie pour exécuter le diaporama en continu
while true; do
  feh --quiet --full-screen --hide-pointer --reload 900 --slideshow-delay 5 "$IMAGE_DIR"
done

# Redémarrer le script pour relancer le diaporama
exec "$0"
