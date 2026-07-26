#!/usr/bin/env bash

# Savage Worlds Game Tracker - Shutdown Script

PID_FILE=".server.pid"
PORT=${PORT:-3000}

STOPPED=false

# Parse arguments for port if provided
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -p|--port) PORT="$2"; shift ;;
    *) ;;
  esac
  shift
done

# 1. Check PID file
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "[*] Stopping server process PID $PID..."
    # Terminate process group if possible or process
    kill -15 "$PID" 2>/dev/null
    
    # Wait up to 10 seconds for process to exit cleanly
    for i in {1..10}; do
      if ! kill -0 "$PID" 2>/dev/null; then
        STOPPED=true
        break
      fi
      sleep 1
    done

    if [ "$STOPPED" = false ]; then
      echo "[!] Process $PID did not stop gracefully. Forcing shutdown..."
      kill -9 "$PID" 2>/dev/null
      STOPPED=true
    fi
  else
    echo "[i] Found PID file, but process $PID is not running."
  fi
  rm -f "$PID_FILE"
fi

# 2. Fallback: Check if port process is active
PID_ON_PORT=$(lsof -ti :"$PORT" 2>/dev/null)
if [ -n "$PID_ON_PORT" ]; then
  echo "[*] Stopping process running on port $PORT (PID: $PID_ON_PORT)..."
  kill -15 $PID_ON_PORT 2>/dev/null
  sleep 2
  kill -9 $PID_ON_PORT 2>/dev/null
  STOPPED=true
fi

if [ "$STOPPED" = true ]; then
  echo "[✓] Server stopped successfully."
else
  echo "[i] No running server found."
fi
