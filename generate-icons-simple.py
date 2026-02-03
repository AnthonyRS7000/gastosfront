#!/usr/bin/env python3
"""
Script para generar iconos PWA en base64 para manifestos JSON.
Crea archivos PNG pequeños embebidos sin dependencias externas (excepto urllib).
"""

import base64
import struct
import zlib
import json
from pathlib import Path

def create_png_bytes(size):
    """Crea un PNG simple con gradiente rosa."""
    # PNG header
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk (width, height, bit depth, color type, etc)
    width = size
    height = size
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk - simple solid color data (pink)
    scanlines = []
    for y in range(height):
        # Filter type 0 (None) + RGB data (255, 105, 180 = #ff69b4)
        scanline = b'\x00' + b'\xff\x69\xb4' * width
        scanlines.append(scanline)
    
    raw_data = b''.join(scanlines)
    compressed_data = zlib.compress(raw_data, 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data) & 0xffffffff
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr_chunk + idat_chunk + iend_chunk

def main():
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    icons_dir = Path('public/icons')
    icons_dir.mkdir(parents=True, exist_ok=True)
    
    print("📦 Generando iconos PWA...")
    
    icon_entries = []
    
    for size in sizes:
        try:
            png_data = create_png_bytes(size)
            filename = f'icon-{size}x{size}.png'
            filepath = icons_dir / filename
            filepath.write_bytes(png_data)
            
            # Base64 para manifest
            base64_data = base64.b64encode(png_data).decode('ascii')
            
            icon_entries.append({
                "src": f"/icons/{filename}",
                "sizes": f"{size}x{size}",
                "type": "image/png",
                "purpose": "any"
            })
            
            # Versión maskable para Android
            icon_entries.append({
                "src": f"/icons/{filename}",
                "sizes": f"{size}x{size}",
                "type": "image/png",
                "purpose": "maskable"
            })
            
            print(f"✅ Generado: {filename}")
        except Exception as e:
            print(f"❌ Error generando {size}x{size}: {e}")
    
    print(f"\n✨ {len(icon_entries)//2} iconos generados en public/icons/")
    
    # Mostrar cómo actualizar manifest.json
    print("\n📝 Actualiza 'icons' en manifest.json con:")
    print(json.dumps(icon_entries[:2], indent=2))
    print("... (más entradas)")

if __name__ == '__main__':
    main()
