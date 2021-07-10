#!/bin/bash

# Install backend deps
cd backend/weather
npm ci

cd ../../frontend/weather-ui
npm ci
