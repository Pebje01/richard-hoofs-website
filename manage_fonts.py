#!/usr/bin/env python3
"""
Interactief Elementor Custom Fonts Manager
"""

import os
import sys
from wordpress_elementor_manager import WordPressElementorManager

SITE_URL = "https://becoming-bass.10web.cloud"
USERNAME = "Richard"
APP_PASSWORD = "kZDK dnZt 7Kbp 87vs Jtpl K3ks"

def show_menu():
    print("\n" + "=" * 60)
    print("📝 Elementor Custom Fonts Manager")
    print("=" * 60)
    print("1. Test verbinding")
    print("2. Site informatie ophalen")
    print("3. Posts ophalen")
    print("4. Custom font toevoegen (via settings)")
    print("5. Huizenstijlen aanpassen")
    print("0. Afsluiten")
    print("=" * 60)

def main():
    # Initialiseer
    try:
        manager = WordPressElementorManager(SITE_URL, USERNAME, APP_PASSWORD)
    except Exception as e:
        print(f"Fout bij initialisatie: {e}")
        return
    
    while True:
        show_menu()
        choice = input("Kies optie (0-5): ").strip()
        
        if choice == "1":
            print("\n🔍 Test verbinding...")
            manager.test_connection()
            
        elif choice == "2":
            print("\n📊 Site informatie:")
            info = manager.get_site_info()
            if info:
                for key, value in info.items():
                    if not key.startswith("_"):
                        print(f"  {key}: {value}")
            
        elif choice == "3":
            print("\n📄 Posts ophalen:")
            posts = manager.get_posts(limit=10)
            if posts:
                for i, post in enumerate(posts, 1):
                    title = post.get('title', {}).get('rendered', 'Geen titel')
                    print(f"  {i}. {title} (ID: {post.get('id')})")
            else:
                print("  Geen posts gevonden")
        
        elif choice == "4":
            print("\n➕ Custom Font Toevoegen:")
            font_name = input("  Font naam: ").strip()
            
            print("\n  Font bestanden (laat leeg als klaar):")
            font_files = {}
            while True:
                font_type = input("    Type (regular/bold/italic/etc): ").strip()
                if not font_type:
                    break
                font_url = input(f"    URL voor {font_type}: ").strip()
                if font_url:
                    font_files[font_type] = font_url
            
            if font_files:
                print("\n  Font data:")
                print(f"    Naam: {font_name}")
                print(f"    Bestanden: {font_files}")
                confirm = input("\n  Toevoegen? (ja/nee): ").strip().lower()
                if confirm == "ja":
                    manager.add_custom_font_via_elementor(font_name, font_files)
        
        elif choice == "5":
            print("\n🎨 Elementor Settings Menu:")
            print("  1. Kleurschema's")
            print("  2. Typografie")
            print("  3. Spacing")
            print("  Terug naar hoofd menu")
            sub_choice = input("  Kies: ").strip()
            if sub_choice in ["1", "2", "3"]:
                print("  🔧 Onder constructie - gebruik wp-admin voor nu")
        
        elif choice == "0":
            print("\n👋 Tot ziens!")
            break
        
        else:
            print("\n❌ Ongeldige keuze, probeer opnieuw")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Programma onderbroken")
