@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale o Node.js e tente novamente.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Instalando as dependencias do site...
  call npm install
  if errorlevel 1 (
    echo A instalacao falhou. Confira sua conexao e tente novamente.
    pause
    exit /b 1
  )
)

call npm run dev
