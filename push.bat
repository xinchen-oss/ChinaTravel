@echo off
cd /d C:\Users\oficina009\Desktop\ChinaTravel
git add -A
set /p msg="Describe los cambios: "
git commit -m "%msg%"
git push
pause
