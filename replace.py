import os
import re

def replace_agrorisk(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or 'dist' in root:
            continue
        for file in files:
            if file.endswith(('.ts', '.tsx', '.json', '.html', '.md')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if re.search(r'agrorisk', content, re.IGNORECASE):
                        # Replace case-insensitively
                        new_content = re.sub(r'agrorisk', 'BlueRakeAgriTech', content, flags=re.IGNORECASE)
                        
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {path}")
                except Exception as e:
                    print(f"Failed {path}: {e}")

if __name__ == "__main__":
    replace_agrorisk('.')
