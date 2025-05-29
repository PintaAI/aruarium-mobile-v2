#!/bin/bash

# Build script for local preview build
# This creates a local build with preview environment variables

echo "🚀 Building local preview APK..."

# Set environment variables for preview build
export EAS_BUILD_PROFILE=preview
export NODE_ENV=production

# Generate a standalone APK
echo "📦 Creating standalone APK with preview configuration..."

# Build the Android app with release variant
npx expo run:android --variant release --no-bundler

echo "✅ Local preview build completed!"
echo "📱 APK should be available in android/app/build/outputs/apk/release/"
