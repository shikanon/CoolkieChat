import os
from PIL import Image, ImageDraw, ImageFont
import numpy as np

def generate_mosaic():
    photo_dir = '/Users/bytedance/Documents/CoolkieChat/public/photo'
    output_path = '/Users/bytedance/Documents/CoolkieChat/public/photo/mosaic_generated.jpg'
    text = "煜琦生日快乐"
    
    # 1. Load all images and resize them to small tiles
    tile_size = (40, 40)
    photos = []
    for file in os.listdir(photo_dir):
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            try:
                img = Image.open(os.path.join(photo_dir, file))
                img = img.convert('RGB')
                # Resize and crop to square
                width, height = img.size
                min_dim = min(width, height)
                left = (width - min_dim) / 2
                top = (height - min_dim) / 2
                right = (width + min_dim) / 2
                bottom = (height + min_dim) / 2
                img = img.crop((left, top, right, bottom))
                img = img.resize(tile_size, Image.Resampling.LANCZOS)
                photos.append(img)
            except Exception as e:
                print(f"Error loading {file}: {e}")
    
    if not photos:
        print("No photos found!")
        return

    # 2. Create text mask
    # We want the output to be large, e.g., 4000x1200
    rows = 40
    cols = 120
    width = cols * tile_size[0]
    height = rows * tile_size[1]
    
    # Create a mask image to draw text on
    mask = Image.new('L', (cols, rows), 0)
    draw = ImageDraw.Draw(mask)
    
    # Try to find a bold SimHei/Heiti font
    font_paths = [
        "/System/Library/Fonts/STHeiti Medium.ttc",  # macOS Heiti Medium
        "/System/Library/Fonts/PingFang.ttc",        # macOS PingFang
        "/Library/Fonts/SimHei.ttf",
    ]
    
    font = None
    for path in font_paths:
        if os.path.exists(path):
            try:
                # index=1 for PingFang is usually Bold
                font = ImageFont.truetype(path, 32, index=1 if "PingFang" in path else 0)
                break
            except:
                continue
    
    if font is None:
        font = ImageFont.load_default()
        print("Warning: Could not find SimHei/Heiti font, using default.")
        
    # Draw text centered
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]
    draw.text(((cols - text_w) // 2, (rows - text_h) // 2 - 2), text, font=font, fill=255)
    
    # 3. Assemble the mosaic
    mosaic_img = Image.new('RGB', (width, height), (255, 192, 203)) # Pink background
    
    mask_data = np.array(mask)
    photo_idx = 0
    
    for r in range(rows):
        for c in range(cols):
            if mask_data[r, c] > 128:
                # Place a photo here
                photo = photos[photo_idx % len(photos)]
                photo_idx += 1
                mosaic_img.paste(photo, (c * tile_size[0], r * tile_size[1]))
            else:
                # Randomly place some photos with lower opacity or just keep background
                if (r + c) % 15 == 0:
                    photo = photos[photo_idx % len(photos)].copy()
                    # Blend with pink
                    overlay = Image.new('RGB', tile_size, (255, 192, 203))
                    photo = Image.blend(photo, overlay, 0.8)
                    mosaic_img.paste(photo, (c * tile_size[0], r * tile_size[1]))

    # 4. Save the super large image
    mosaic_img.save(output_path, quality=85)
    print(f"Mosaic generated at {output_path}")

if __name__ == "__main__":
    generate_mosaic()
