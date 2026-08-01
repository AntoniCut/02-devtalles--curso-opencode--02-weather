# Trabajo con Ramas en GIT


```bash
# 1. Asegúrate de estar en master y actualizado antes de crear la rama
git checkout master
git pull origin master

# 2. Crea la nueva rama y muévete a ella
git checkout -b 01-file-system

# 3. Haz tus cambios en el proyecto...
# (edita archivos)

# 4. Añade y commitea los cambios
git add .
git commit -m "Descripción de los cambios"

# 5. (Opcional pero recomendado) sube la rama al remoto antes de fusionar,
#    por si quieres tener respaldo o revisarla en otro sitio
git push origin 01-file-system

# 6. Vuelve a master y actualízala por si hubo cambios mientras trabajabas
git checkout master
git pull origin master

# 7. Fusiona la rama en master
git merge 01-file-system

# 8. Sube master actualizada al repositorio remoto
git push origin master

# 9. Elimina la rama en local
git branch -d 01-file-system

# 10. Elimina la rama también en el remoto (si la subiste en el paso 5)
git push origin --delete 01-file-system
```