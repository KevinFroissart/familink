#!/bin/bash

# Répertoire contenant les images
IMAGE_DIR="/home/kfroissart/git/familink/images/"

# Fonction pour compter le nombre d'images dans le répertoire
count_images() {
  local count=0
  for file in "$1"/*; do
    if [[ -f "$file" ]]; then
      ((count++))
    fi
  done
  echo "$count"
}

# Boucle infinie pour exécuter le diaporama en continu
while true; do
  image_count=$(count_images "$IMAGE_DIR")
  reload_time=$((image_count * 10 + 20))
  feh --quiet --full-screen --hide-pointer --reload "$reload_time" --slideshow-delay 10 "$IMAGE_DIR"
done

# Redémarrer le script pour relancer le diaporama
exec "$0"
