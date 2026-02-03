#!/usr/bin/env python3
"""
🚀 PWA Configuration Verification Script
Verifica que todos los componentes de PWA están correctamente configurados
"""

import json
import os
from pathlib import Path

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def check_file_exists(path, description):
    """Verifica si un archivo existe"""
    exists = os.path.exists(path)
    status = "✅ EXISTE" if exists else "❌ FALTA"
    print(f"{status:12} {description:40} {path}")
    return exists

def check_file_content(path, search_text, description):
    """Verifica si un archivo contiene cierto texto"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            found = search_text in content
            status = "✅ OK" if found else "❌ NO ENCONTRADO"
            print(f"{status:12} {description}")
            return found
    except Exception as e:
        print(f"❌ ERROR      {description}: {e}")
        return False

print_header("📱 PWA CONFIGURATION VERIFICATION")

# 1. Verificar Manifest
print("1️⃣  Manifest.json")
print("-" * 60)
manifest_path = "public/manifest.json"
if check_file_exists(manifest_path, "Manifest.json"):
    try:
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)
            
        print(f"   📛 Name: {manifest.get('name', '❌ NO CONFIGURADO')}")
        print(f"   🎨 Theme: {manifest.get('theme_color', '❌ NO CONFIGURADO')}")
        print(f"   🎯 Display: {manifest.get('display', '❌ NO CONFIGURADO')}")
        print(f"   🖼️  Icons: {len(manifest.get('icons', []))} configurados")
        
        if len(manifest.get('icons', [])) >= 4:
            print(f"   ✅ Iconos múltiples: OK")
        else:
            print(f"   ❌ Iconos insuficientes: Necesita al menos 4")
    except Exception as e:
        print(f"   ❌ Error leyendo manifest.json: {e}")

# 2. Verificar Service Worker
print("\n2️⃣  Service Worker (sw.js)")
print("-" * 60)
sw_path = "public/sw.js"
sw_exists = check_file_exists(sw_path, "sw.js")
if sw_exists:
    checks = [
        ("self.addEventListener('install'", "Event handler 'install'"),
        ("self.addEventListener('activate'", "Event handler 'activate'"),
        ("self.addEventListener('fetch'", "Event handler 'fetch'"),
        ("CACHE_NAME", "Cache management"),
    ]
    for search_text, description in checks:
        check_file_content(sw_path, search_text, f"  • {description}")

# 3. Verificar Icons
print("\n3️⃣  Icons (public/icons/)")
print("-" * 60)
icons_dir = Path("public/icons")
if icons_dir.exists():
    icons = list(icons_dir.glob("*.png"))
    print(f"✅ EXISTE      Directorio icons")
    print(f"   📦 Archivos PNG: {len(icons)}")
    
    sizes_found = []
    for icon in sorted(icons):
        size_str = icon.stem.split('-')[1]  # Extrae "192x192" de "icon-192x192"
        size_bytes = icon.stat().st_size
        sizes_found.append(size_str)
        print(f"   • {icon.name:25} ({size_bytes:6} bytes)")
    
    required_sizes = ["192x192", "512x512"]
    all_present = all(any(size in f.name for f in icons) for size in required_sizes)
    if all_present:
        print(f"   ✅ Tamaños esenciales: OK")
    else:
        print(f"   ❌ Faltan tamaños esenciales")
else:
    print(f"❌ NO EXISTE    Directorio icons")

# 4. Verificar index.html
print("\n4️⃣  HTML Configuration (src/index.html)")
print("-" * 60)
html_path = "src/index.html"
if check_file_exists(html_path, "index.html"):
    checks = [
        ('rel="manifest"', "Link a manifest.json"),
        ("apple-mobile-web-app-capable", "iOS PWA meta tag"),
        ("mobile-web-app-capable", "Android PWA meta tag"),
        ("serviceWorker.register", "Service Worker registration"),
        ("/sw.js", "SW route correcto"),
        ("theme-color", "Theme color meta tag"),
    ]
    for search_text, description in checks:
        check_file_content(html_path, search_text, f"  • {description}")

# 5. Verificar angular.json
print("\n5️⃣  Angular Configuration (angular.json)")
print("-" * 60)
ng_config_path = "angular.json"
if check_file_exists(ng_config_path, "angular.json"):
    try:
        with open(ng_config_path, 'r') as f:
            ng_config = json.load(f)
        
        assets = ng_config.get('projects', {}).get('gastosfront', {}).get('architect', {}).get('build', {}).get('options', {}).get('assets', [])
        
        has_public = any('public' in str(asset) for asset in assets)
        if has_public:
            print(f"✅ OK           Assets públicos incluidos")
            print(f"   • public/ → dist/")
        else:
            print(f"❌ NO ENCONTRADO Assets públicos no configurados")
    except Exception as e:
        print(f"❌ Error: {e}")

# 6. Resumen
print_header("📊 RESUMEN DE CONFIGURACIÓN")

checks_list = [
    ("manifest.json", os.path.exists("public/manifest.json")),
    ("sw.js", os.path.exists("public/sw.js")),
    ("icons (8 tamaños)", len(list(Path("public/icons").glob("*.png"))) >= 8 if Path("public/icons").exists() else False),
    ("index.html PWA meta tags", check_file_content("src/index.html", "manifest", "temp")),
    ("Service Worker registration", check_file_content("src/index.html", "serviceWorker", "temp")),
]

total = len(checks_list)
passed = sum(1 for _, result in checks_list if result)

for check_name, result in checks_list:
    status = "✅" if result else "❌"
    print(f"{status} {check_name}")

print(f"\n{'='*60}")
print(f"PUNTUACIÓN: {passed}/{total} ({int(passed/total*100)}%)")
print(f"{'='*60}")

if passed == total:
    print("\n🎉 ¡PWA COMPLETAMENTE CONFIGURADA!")
    print("\nPróximos pasos:")
    print("1. npm start")
    print("2. Abre http://localhost:4200 en navegador")
    print("3. DevTools → Application → Manifest")
    print("4. Verifica Service Worker registrado")
    print("5. Testea en móvil desde tu red local")
else:
    print(f"\n⚠️  Completa los puntos faltantes:")
    for check_name, result in checks_list:
        if not result:
            print(f"   ❌ {check_name}")

print("\n")
