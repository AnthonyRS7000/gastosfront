#!/usr/bin/env python3
"""
Convertir foto1.jpg en iconos PWA de múltiples tamaños
"""

from PIL import Image
import os

def create_pwa_icons():
    """Convierte foto1.jpg en iconos PWA"""
    
    # Abrir la imagen
    source_image = Image.open('public/foto1.jpg')
    
    # Tamaños necesarios
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    print("📦 Generando iconos PWA desde foto1.jpg...")
    
    for size in sizes:
        try:
            # Redimensionar (manteniendo aspect ratio)
            img = source_image.copy()
            img.thumbnail((size, size), Image.Resampling.LANCZOS)
            
            # Crear imagen con fondo rosa si es necesario
            background = Image.new('RGB', (size, size), '#ff69b4')
            offset = ((size - img.size[0]) // 2, (size - img.size[1]) // 2)
            background.paste(img, offset)
            
            # Guardar
            filename = f'public/icons/icon-{size}x{size}.png'
            background.save(filename)
            
            print(f"✅ Generado: {filename}")
        except Exception as e:
            print(f"❌ Error en {size}x{size}: {e}")
    
    print("✨ Iconos generados exitosamente")

if __name__ == '__main__':
    create_pwa_icons()
