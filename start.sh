#!/bin/sh
# Start script for production
# Working directory is already /app from Dockerfile
# Run pnpm with filter to start the web app
exec pnpm --filter web start