#!/usr/bin/env bash

# Make build script executable
chmod +x build.sh

echo "🚀 Backend deployment preparation complete!"
echo ""
echo "Next steps for Render deployment:"
echo "1. Push your code to GitHub"
echo "2. Create a new Web Service on Render"
echo "3. Connect your GitHub repository"
echo "4. Set root directory to 'backend'"
echo "5. Set build command to './build.sh'"
echo "6. Set start command to 'gunicorn resume_analyzer.wsgi:application --bind 0.0.0.0:\$PORT'"
echo "7. Add environment variables:"
echo "   - SECRET_KEY=your-secret-key"
echo "   - DEBUG=False"
echo ""
echo "Your backend will be deployed automatically!"
