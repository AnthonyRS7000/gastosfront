#!/usr/bin/env python3
"""
Script para generar iconos PWA automáticamente
Requiere: pip install Pillow
"""

from PIL import Image, ImageDraw
import os

# Crear directorio si no existe
os.makedirs('public/icons', exist_ok=True)

# Colores de la app
MAIN_COLOR = '#ff69b4'  # Rosa principal
SECONDARY_COLOR = '#ffb6d9'  # Rosa claro
WHITE = '#ffffff'
BG_COLOR = '#ffffff'

# Tamaños de iconos requeridos
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

def hex_to_rgb(hex_color):
    """Convierte hex a RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_icon(size, maskable=False):
    """Crea un icono con gradiente"""
    # Crear imagen con fondo blanco
    img = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Colores RGB
    main_rgb = hex_to_rgb(MAIN_COLOR)
    secondary_rgb = hex_to_rgb(SECONDARY_COLOR)
    
    # Dibujar gradiente simple (rectángulos)
    for i in range(size):
        ratio = i / size
        r = int(main_rgb[0] * (1 - ratio) + secondary_rgb[0] * ratio)
        g = int(main_rgb[1] * (1 - ratio) + secondary_rgb[1] * ratio)
        b = int(main_rgb[2] * (1 - ratio) + secondary_rgb[2] * ratio)
        draw.line([(0, i), (size, i)], fill=(r, g, b, 255))
    
    # Dibujar círculo blanco con icono de billetera
    margin = int(size * 0.15)
    circle_bbox = [margin, margin, size - margin, size - margin]
    draw.ellipse(circle_bbox, fill=(255, 255, 255, 255))
    
    # Dibujar símbolo de dinero (💰 simplificado)
    center_x = size // 2
    center_y = size // 2
    radius = int(size * 0.08)
    
    # Círculo con símbolo de moneda
    draw.ellipse(
        [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
        outline=main_rgb,
        width=max(1, size // 32)
    )
    
    # Línea horizontal (símbolo de dinero)
    line_width = max(1, size // 32)
    y_pos = center_y - int(radius * 0.3)
    draw.line([(center_x - radius, y_pos), (center_x + radius, y_pos)], fill=main_rgb, width=line_width)
    y_pos = center_y + int(radius * 0.3)
    draw.line([(center_x - radius, y_pos), (center_x + radius, y_pos)], fill=main_rgb, width=line_width)
    
    if maskable:
        # Para iconos maskable, crear versión con bordes transparentes
        img = img.convert('RGBA')
        return img
    
    return img

def main():
    print("🎨 Generando iconos PWA...")
    
    # Generar iconos normales
    for size in ICON_SIZES:
        icon = create_icon(size)
        filename = f'public/icons/icon-{size}x{size}.png'
        icon.save(filename, 'PNG')
        print(f"✅ Creado: {filename}")
    
    # Generar iconos maskable (para Android)
    for size in [192, 512]:
        icon = create_icon(size, maskable=True)
        filename = f'public/icons/icon-{size}x{size}-maskable.png'
        icon.save(filename, 'PNG')
        print(f"✅ Creado: {filename}")
    
    # Crear screenshots (simplificados)
    create_screenshot('public/icons/screenshot-1.png', 540, 720)
    create_screenshot('public/icons/screenshot-2.png', 1080, 1440)
    
    print("\n✨ ¡Iconos generados exitosamente!")
    print("📁 Los archivos están en: public/icons/")

def create_screenshot(filename, width, height):
    """Crea un screenshot de demostración"""
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Fondo con gradiente
    main_rgb = hex_to_rgb(MAIN_COLOR)
    secondary_rgb = hex_to_rgb(SECONDARY_COLOR)
    
    for i in range(height):
        ratio = i / height
        r = int(main_rgb[0] * (1 - ratio) + secondary_rgb[0] * ratio)
        g = int(main_rgb[1] * (1 - ratio) + secondary_rgb[1] * ratio)
        b = int(main_rgb[2] * (1 - ratio) + secondary_rgb[2] * ratio)
        draw.line([(0, i), (width, i)], fill=(r, g, b))
    
    # Agregar rectángulo blanco simulando UI
    ui_margin = int(width * 0.1)
    ui_height = int(height * 0.5)
    draw.rectangle(
        [ui_margin, ui_margin, width - ui_margin, ui_height],
        fill=(255, 255, 255),
        outline=main_rgb,
        width=3
    )
    
    img.save(filename, 'PNG')
    print(f"✅ Creado: {filename}")

if __name__ == '__main__':
    main()
