@echo off
REM Daily GitHub Contribution Script
REM Run this via Windows Task Scheduler

cd /d "d:\projects\filmy-app"

REM Get today's date
for /f "tokens=1-3 delims=/" %%a in ('date /t') do (
    set TODAY=%%c-%%a-%%b
)

REM Generate random number between 6-10
set /a COUNT=%random% %% 5 + 6
echo Creating %COUNT% commits for %TODAY%

REM Create random number of empty commits
for /L %%i in (1,1,%COUNT%) do (
    git commit --allow-empty -m "chore: daily contribution %%i - %TODAY%"
)

REM Push to remote
git push origin carousel

echo Done! Created 10 commits for %TODAY%
