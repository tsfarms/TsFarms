import os
import subprocess
import json
from PIL import Image, ImageOps
import pillow_heif
import imageio_ffmpeg

pillow_heif.register_heif_opener()
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

INPUT_DIR = 'NewImagesandVideos'
OUTPUT_DIR = 'public/farm-gallery'
os.makedirs(OUTPUT_DIR, exist_ok=True)

manifest = []

# Friendly titles for the farm scenes
titles = {
    'IMG_2596': 'Sunlit Mango Canopy in Full Season',
    'IMG_2597': 'Thriving Mango Groves at TS Farms',
    'IMG_2598': 'Golden Fruit Clusters on Mature Trees',
    'IMG_2599': 'Traditional Orchard Irrigation Channels',
    'IMG_2600': 'Lush Foliage and Ripening Harvest',
    'IMG_2601': 'Hand-Nurtured Mango Branches',
    'IMG_2603': 'Morning Breeze Through the Orchard',
    'IMG_2604': 'Farm Pathways Under Mango Shade',
    'IMG_2606': 'Clusters of Sweet Native Mangoes',
    'IMG_2612': 'Panoramic Vista of Devadanapatti Farm',
    'IMG_2613': 'Farm Water Streams & Pure Soil',
    'IMG_2615': 'Traditional Honeycomb Extraction',
    'IMG_2616': 'Freshly Harvested Honey Dippers',
    'IMG_2617': 'Beekeeping in Mountain Air',
    'IMG_2618 (1)': 'Ripe Golden Mangoes on Bough',
    'IMG_2624': 'Natural Farming in Western Ghats foothills',
    'IMG_2625': 'Organic Soil Care and Tree Health',
    'IMG_2628': 'Sweet Fragrance of Peak Summer',
    'IMG_2631': 'Carefully Inspected Fruit Clusters',
    'IMG_2634': 'Walking the Grove Rows',
    'IMG_2637': 'Traditional Farm Care & Pruning',
    'IMG_2638': 'Sunshine Filtering Through Leaves',
    'IMG_2639': 'Gentle Tree Shaking & Inspection',
    'IMG_2643': 'Active Bee Colony on Natural Comb',
    'IMG_2645': 'Harvest Basket Inspection',
    'IMG_2650': 'Wild Flora Pollination',
    'IMG_2652': 'Farm Canopy Greenery',
    'IMG_2659': 'Bountiful Summer Mango Yield',
    'IMG_2660': 'Sun-Ripened Mango Bough',
    'IMG_2661': 'Orchard Wind & Leaf Rustle',
    'IMG_2692': 'Raw Unfiltered Honey Flow',
    'IMG_2694': 'Hand-Inspecting Tree Health',
    'IMG_2695': 'Pristine Mountain Backdrop',
    'IMG_2697': 'Devadanapatti Farm Horizon',
    'beekeepers': 'Beekeepers with Fresh Mountain Honeycomb',
}

files = sorted(os.listdir(INPUT_DIR))

# First process images
for f in files:
    base, ext = os.path.splitext(f)
    ext = ext.lower()
    in_path = os.path.join(INPUT_DIR, f)

    if ext in ['.heic', '.jpg', '.jpeg', '.png']:
        out_name = base.replace(' ', '_').replace('(', '').replace(')', '') + '.webp'
        out_path = os.path.join(OUTPUT_DIR, out_name)

        try:
            im = Image.open(in_path)
            im = ImageOps.exif_transpose(im)
            w, h = im.size

            # Resize if very large (e.g. > 1600px on max dimension)
            max_dim = 1600
            if max(w, h) > max_dim:
                scale = max_dim / float(max(w, h))
                new_w, new_h = int(w * scale), int(h * scale)
                im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
                w, h = new_w, new_h

            # Convert RGBA/P to RGB if saving as webp
            if im.mode not in ('RGB', 'RGBA'):
                im = im.convert('RGB')

            im.save(out_path, 'WEBP', quality=85, method=6)
            print(f'[IMG OK] {f} -> {out_name} ({w}x{h})')

            orientation = 'landscape' if w > h else 'portrait'
            manifest.append({
                'id': base,
                'type': 'image',
                'src': f'/farm-gallery/{out_name}',
                'poster': f'/farm-gallery/{out_name}',
                'width': w,
                'height': h,
                'orientation': orientation,
                'title': titles.get(base, 'TS Farms Orchard Life'),
            })
        except Exception as e:
            print(f'[IMG ERR] {f}: {e}')

# Next process videos
for f in files:
    base, ext = os.path.splitext(f)
    ext = ext.lower()
    in_path = os.path.join(INPUT_DIR, f)

    if ext in ['.mov', '.mp4']:
        clean_base = base.replace(' ', '_').replace('(', '').replace(')', '')
        out_name = f'{clean_base}.mp4'
        poster_name = f'{clean_base}_poster.webp'
        out_path = os.path.join(OUTPUT_DIR, out_name)
        poster_path = os.path.join(OUTPUT_DIR, poster_name)

        try:
            # 1. Transcode video with 720p/1080p max constraint for silky smooth streaming
            # Scale so max dimension is at most 1280
            # vf scale: if portrait (h>w) scale to height 1280, if landscape scale to width 1280
            vf = "scale='if(gt(iw,ih),1280,-2)':'if(gt(iw,ih),-2,1280)',fps=30"
            cmd = [
                ffmpeg, '-y', '-i', in_path,
                '-vf', vf,
                '-c:v', 'libx264',
                '-crf', '26',
                '-preset', 'fast',
                '-movflags', '+faststart',
                '-an',  # muted background video for performance
                out_path
            ]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            # 2. Extract poster image from 0.5s mark
            poster_tmp = os.path.join(OUTPUT_DIR, f'{clean_base}_poster.jpg')
            cmd_poster = [
                ffmpeg, '-y', '-ss', '00:00:00.500', '-i', in_path,
                '-vframes', '1',
                '-vf', "scale='if(gt(iw,ih),1280,-2)':'if(gt(iw,ih),-2,1280)'",
                poster_tmp
            ]
            subprocess.run(cmd_poster, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            # Convert poster to webp using PIL
            if os.path.exists(poster_tmp):
                pim = Image.open(poster_tmp)
                pw, ph = pim.size
                pim.save(poster_path, 'WEBP', quality=85)
                os.remove(poster_tmp)
                video_orient = 'landscape' if pw > ph else 'portrait'
            else:
                pw, ph = 720, 1280
                video_orient = 'portrait'

            sz_mb = os.path.getsize(out_path) / (1024*1024)
            print(f'[VID OK] {f} -> {out_name} ({sz_mb:.2f}MB, {pw}x{ph})')

            manifest.append({
                'id': base,
                'type': 'video',
                'src': f'/farm-gallery/{out_name}',
                'poster': f'/farm-gallery/{poster_name}',
                'width': pw,
                'height': ph,
                'orientation': video_orient,
                'title': titles.get(base, 'TS Farms Farm Moments'),
            })
        except Exception as e:
            print(f'[VID ERR] {f}: {e}')

# Save manifest to JSON
manifest_path = os.path.join(OUTPUT_DIR, 'media.json')
with open(manifest_path, 'w', encoding='utf-8') as mf:
    json.dump(manifest, mf, indent=2)

print(f'\nFinished processing {len(manifest)} items. Manifest saved to {manifest_path}')
