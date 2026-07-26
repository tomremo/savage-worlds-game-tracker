#!/usr/bin/env bash

# Savage Worlds Game Tracker - Startup Script

PID_FILE=".server.pid"
LOG_FILE="server.log"
PORT=${PORT:-3000}
MODE="dev"
DETACH=false

usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --dev           Start in development mode using 'npm run dev' (default)"
  echo "  --prod          Build and start in production mode using 'npm run build && npm run start'"
  echo "  -p, --port PORT Set the server port (default: 3000)"
  echo "  -d, --daemon    Run server in background as a daemon"
  echo "  -h, --help      Display this help message"
  exit 0
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --dev) MODE="dev" ;;
    --prod) MODE="prod" ;;
    -p|--port) PORT="$2"; shift ;;
    -d|--daemon) DETACH=true ;;
    -h|--help) usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
  shift
done

# Check if server is already running via PID file
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "[!] Server is already running with PID $PID."
    exit 1
  else
    echo "[i] Removing stale PID file."
    rm -f "$PID_FILE"
  fi
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "[!] node_modules not found. Installing dependencies via 'npm ci'..."
  npm ci || { echo "[X] npm ci failed!"; exit 1; }
fi

export PORT="$PORT"


if [ "$MODE" = "prod" ]; then
  echo "[*] Building application for production..."
  npm run build || { echo "[X] Build failed!"; exit 1; }
  START_CMD="npm run start"
else
  START_CMD="npm run dev"
fi

if [ "$DETACH" = true ]; then
  echo "[*] Starting server in background ($MODE mode) on port $PORT..."
  nohup $START_CMD > "$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo "$SERVER_PID" > "$PID_FILE"
  echo "[✓] Server started in background with PID $SERVER_PID. Logs: $LOG_FILE"
else
  echo "[*] Starting server in foreground ($MODE mode) on port $PORT..."
  echo "[i] Press Ctrl+C to stop."
  $START_CMD
fi
