#!/usr/bin/env python3
"""
WordPress Elementor Manager
Verbinding met WordPress REST API en beheer van Elementor custom fonts
"""

import requests
import json
import base64
from typing import Dict, List, Optional

class WordPressElementorManager:
    def __init__(self, site_url: str, username: str, app_password: str):
        """
        Initialiseer de WordPress manager
        
        Args:
            site_url: Base URL van de WordPress site (bijv. https://becoming-bass.10web.cloud)
            username: WordPress gebruikersnaam
            app_password: Application password
        """
        self.site_url = site_url.rstrip('/')
        self.username = username
        self.app_password = app_password
        self.api_url = f"{self.site_url}/wp-json/wp/v2"
        self.elementor_api = f"{self.site_url}/wp-json/elementor/v1"
        
        # Authenticatie header
        credentials = base64.b64encode(f"{username}:{app_password}".encode()).decode()
        self.headers = {
            'Authorization': f'Basic {credentials}',
            'Content-Type': 'application/json'
        }
        
    def test_connection(self) -> bool:
        """Test de verbinding met WordPress"""
        try:
            response = requests.get(f"{self.api_url}/users/me", headers=self.headers)
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ Verbinding geslaagd!")
                print(f"   Ingelogd als: {user_data.get('name')} ({user_data.get('username')})")
                return True
            else:
                print(f"❌ Fout bij verbinding: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Verbindingsfout: {e}")
            return False
    
    def get_site_info(self) -> Dict:
        """Get WordPress site info"""
        try:
            response = requests.get(f"{self.site_url}/wp-json/", headers=self.headers)
            if response.status_code == 200:
                return response.json()
            return {}
        except Exception as e:
            print(f"Fout bij ophalen site info: {e}")
            return {}
    
    def add_custom_font_via_elementor(self, font_name: str, font_files: Dict[str, str]) -> bool:
        """
        Voeg custom font toe via Elementor
        
        Args:
            font_name: Naam van de font
            font_files: Dict met font types en URLs
                       bijv. {'regular': 'http://...font.ttf', 'bold': 'http://...bold.ttf'}
        """
        try:
            # Voor Elementor Pro moet je via de Elementor custom fonts API gaan
            # Dit werkt via de WordPress options
            elementor_options_url = f"{self.api_url}/elementor/fonts"
            
            font_data = {
                "name": font_name,
                "files": font_files
            }
            
            response = requests.post(
                elementor_options_url,
                headers=self.headers,
                json=font_data
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Font '{font_name}' succesvol toegevoegd")
                return True
            else:
                print(f"⚠️  Font toevoegen via API niet beschikbaar (dit is normaal)")
                print(f"   Gebruik stap 2 hieronder voor handmatige toevoeging")
                return False
                
        except Exception as e:
            print(f"❌ Fout bij font toevoeging: {e}")
            return False
    
    def get_elementor_fonts(self) -> List[Dict]:
        """Haal huidige Elementor fonts op"""
        try:
            # Probeer via options endpoint
            response = requests.get(
                f"{self.api_url}/settings/elementor_custom_fonts",
                headers=self.headers
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"Fout bij ophalen fonts: {e}")
            return []
    
    def get_posts(self, limit: int = 10) -> List[Dict]:
        """Haal posts op"""
        try:
            response = requests.get(
                f"{self.api_url}/posts?per_page={limit}",
                headers=self.headers
            )
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"Fout bij ophalen posts: {e}")
            return []
    
    def update_elementor_settings(self, settings: Dict) -> bool:
        """Update Elementor instellingen"""
        try:
            response = requests.post(
                f"{self.api_url}/settings",
                headers=self.headers,
                json=settings
            )
            if response.status_code == 200:
                print("✅ Instellingen bijgewerkt")
                return True
            return False
        except Exception as e:
            print(f"Fout bij update instellingen: {e}")
            return False


def main():
    # Configuratie
    SITE_URL = "https://becoming-bass.10web.cloud"
    USERNAME = "Richard"
    APP_PASSWORD = "kZDK dnZt 7Kbp 87vs Jtpl K3ks"
    
    print("=" * 60)
    print("WordPress Elementor Manager")
    print("=" * 60)
    
    # Initialiseer manager
    manager = WordPressElementorManager(SITE_URL, USERNAME, APP_PASSWORD)
    
    # Test verbinding
    print("\n1. Test verbinding met WordPress...")
    if not manager.test_connection():
        print("❌ Kan niet verbinden. Controleer credentials.")
        return
    
    # Get site info
    print("\n2. Site informatie:")
    site_info = manager.get_site_info()
    if site_info:
        print(f"   Site naam: {site_info.get('name', 'N/A')}")
        print(f"   Site URL: {site_info.get('home', 'N/A')}")
        print(f"   WordPress versie: {site_info.get('wp_version', 'N/A')}")
        print(f"   Elementor API beschikbaar: {'/elementor/v1' in str(site_info)}")
    
    # Get posts
    print("\n3. Recente posts:")
    posts = manager.get_posts(limit=5)
    for post in posts:
        print(f"   - {post.get('title', {}).get('rendered', 'Geen titel')} (ID: {post.get('id')})")
    
    # Custom fonts instructies
    print("\n4. Custom Fonts Toevoegen:")
    print("   Optie A (via admin panel - aanbevolen):")
    print("   ├─ Ga naar: https://becoming-bass.10web.cloud/wp-admin/")
    print("   ├─ Menu: Elementor > Settings > Custom Fonts")
    print("   └─ Klik 'Add Custom Font' en upload je fonts")
    print("\n   Optie B (via API - experimenteel):")
    print("   └─ Roep: manager.add_custom_font_via_elementor()")
    
    print("\n5. Volgende stappen:")
    print("   - Upload fonts via https://becoming-bass.10web.cloud/wp-admin/")
    print("   - Of plaats fonts op externe CDN/server")
    print("   - Gebruik ze dan in Elementor editor")
    
    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
