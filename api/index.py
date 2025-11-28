import os
import sys

# Add the root directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.server import app

# Vercel serverless function entry point
if __name__ == '__main__':
    app.run()
