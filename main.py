import os
import shutil

# Define directories and files to remove
paths_to_remove = [
    'portfolio_website\\build',  
    'portfolio_website\\node_modules',  
    'portfolio_website\\.env',  
    'portfolio_website\\.env.local',
    'portfolio_website\\.vscode',  
    'portfolio_website\\.idea',
    'portfolio_website\\.DS_Store',  
    'portfolio_website\\Thumbs.db'
]

# Remove directories and files
for path in paths_to_remove:
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

print("Cleanup complete!")
