#!/bin/bash
echo "🚀 Setting up Maid Service Platform..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

# Setup environment files
echo "⚙️ Setting up environment files..."
cd .. && cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT secret"
echo "2. Edit frontend/.env with your API URL"
echo "3. Run 'npm run dev' from the root directory to start both servers"
echo ""
echo "For Docker deployment: docker-compose up -d"