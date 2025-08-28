#!/bin/bash

# Frontend Workspace Setup Script
# This script sets up the react-file-manager component in your frontend workspace

set -e  # Exit on any error

echo "🚀 Setting up frontend workspace..."

# Check if we're in the right directory (should contain frontend folder)
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend folder not found. Please run this script from the project root."
    exit 1
fi

cd frontend

echo "📁 Current directory: $(pwd)"

# Check if app folder exists
if [ ! -d "app" ]; then
    echo "❌ Error: app folder not found in frontend directory."
    exit 1
fi

echo "📦 Cloning react-file-manager repository..."

# Clone the repository into a temporary directory
if [ -d "temp-react-file-manager" ]; then
    echo "🧹 Removing existing temporary directory..."
    rm -rf temp-react-file-manager
fi

git clone https://github.com/Saifullah-dev/react-file-manager temp-react-file-manager

# Check if the clone was successful
if [ ! -d "temp-react-file-manager" ]; then
    echo "❌ Error: Failed to clone repository."
    exit 1
fi

echo "📂 Extracting frontend subfolder..."

# Check if frontend subfolder exists in the cloned repo
if [ ! -d "temp-react-file-manager/frontend" ]; then
    echo "❌ Error: frontend subfolder not found in cloned repository."
    echo "📋 Available directories:"
    ls -la temp-react-file-manager/
    exit 1
fi

# Remove existing react-file-manager if it exists
if [ -d "react-file-manager" ]; then
    echo "🧹 Removing existing react-file-manager directory..."
    rm -rf react-file-manager
fi

# Move and rename the frontend subfolder
echo "📦 Moving and renaming frontend subfolder to react-file-manager..."
mv temp-react-file-manager/frontend react-file-manager

# Clean up temporary directory
echo "🧹 Cleaning up temporary files..."
rm -rf temp-react-file-manager

# Check if the move was successful
if [ ! -d "react-file-manager" ]; then
    echo "❌ Error: Failed to create react-file-manager directory."
    exit 1
fi

echo "📋 Contents of react-file-manager:"
ls -la react-file-manager/

# Install dependencies in react-file-manager if package.json exists
if [ -f "react-file-manager/package.json" ]; then
    echo "📦 Installing dependencies in react-file-manager..."
    cd react-file-manager
    npm install
    npm run build
    cd ..
else
    echo "⚠️  Warning: No package.json found in react-file-manager directory."
fi

# Install dependencies in app folder
if [ -f "app/package.json" ]; then
    echo "📦 Installing dependencies in app..."
    cd app
    npm install
    cd ..
else
    echo "⚠️  Warning: No package.json found in app directory."
fi

# Install workspace dependencies
if [ -f "package.json" ]; then
    echo "📦 Installing workspace dependencies..."
    npm install
else
    echo "⚠️  Warning: No package.json found in frontend directory. Please create one for workspace management."
fi

echo "✅ Setup completed successfully!"
echo ""
echo "📁 Directory structure:"
echo "frontend/"
echo "├── app/                    (your vite app)"
echo "├── react-file-manager/     (extracted component)"
echo "└── package.json            (workspace configuration)"
echo ""
echo "🎯 Next steps:"
echo "1. Review the react-file-manager component structure"
echo "2. Import and use the component in your app"
echo "3. Run 'npm run dev' from the app directory to start development"
echo "4. Run 'npm run build' to test the build process"