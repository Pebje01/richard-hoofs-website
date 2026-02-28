#!/usr/bin/env python3
"""
HTML to Elementor JSON Converter
Zet HTML met metadata om naar Elementor JSON format
"""

import json
import re
from bs4 import BeautifulSoup
from typing import Dict, List, Any
import uuid

class HTMLToElementorConverter:
    def __init__(self, html_file: str):
        """Load HTML file"""
        with open(html_file, 'r', encoding='utf-8') as f:
            self.html_content = f.read()
        self.soup = BeautifulSoup(self.html_content, 'html.parser')
        self.elementor_data = []
        self.element_id = 0
    
    def get_unique_id(self) -> str:
        """Generate unique element ID"""
        self.element_id += 1
        return f"element-{self.element_id}"
    
    def extract_styles(self, element) -> Dict:
        """Extract inline styles"""
        style_attr = element.get('style', '')
        styles = {}
        if style_attr:
            for style in style_attr.split(';'):
                if ':' in style:
                    key, value = style.split(':', 1)
                    styles[key.strip()] = value.strip()
        return styles
    
    def parse_hero_section(self, section) -> Dict:
        """Parse hero section"""
        title = section.find(attrs={'data-field': 'title'})
        subtitle = section.find(attrs={'data-field': 'subtitle'})
        cta = section.find(attrs={'data-field': 'cta_text'})
        
        return {
            'id': self.get_unique_id(),
            'elType': 'section',
            'settings': {
                'title': 'Hero Section',
                'padding': '120px 20px',
                'background_color': '#2C5F4F',
            },
            'elements': [
                {
                    'id': self.get_unique_id(),
                    'elType': 'column',
                    'settings': {
                        'title': 'Hero Content',
                    },
                    'elements': [
                        {
                            'id': self.get_unique_id(),
                            'elType': 'widget',
                            'widgetType': 'heading',
                            'settings': {
                                'title': title.text if title else 'Hero Title',
                                'header_tag': 'h1',
                                'text_align': 'center',
                                'font_size': '48px',
                                'font_weight': 'bold',
                            }
                        },
                        {
                            'id': self.get_unique_id(),
                            'elType': 'widget',
                            'widgetType': 'text-editor',
                            'settings': {
                                'editor': subtitle.text if subtitle else 'Subtitle text',
                                'text_align': 'center',
                                'font_size': '20px',
                            }
                        },
                        {
                            'id': self.get_unique_id(),
                            'elType': 'widget',
                            'widgetType': 'button',
                            'settings': {
                                'text': cta.text if cta else 'Button',
                                'link': '#contact',
                                'button_type': 'primary',
                                'alignment': 'center',
                            }
                        }
                    ]
                }
            ]
        }
    
    def parse_service_cards(self, section) -> List[Dict]:
        """Parse service cards"""
        cards_data = []
        cards = section.find_all(attrs={'data-elementor-type': 'card'})
        
        for card in cards:
            title = card.find(attrs={'data-field': 'title'})
            desc = card.find(attrs={'data-field': 'description'})
            
            cards_data.append({
                'id': self.get_unique_id(),
                'elType': 'widget',
                'widgetType': 'icon-box',
                'settings': {
                    'title': title.text if title else 'Service Title',
                    'description_text': desc.text if desc else 'Description',
                }
            })
        
        return cards_data
    
    def parse_testimonials(self, section) -> List[Dict]:
        """Parse testimonial cards"""
        testimonials_data = []
        testimonials = section.find_all(attrs={'data-elementor-type': 'testimonial'})
        
        for testimonial in testimonials:
            text = testimonial.find(attrs={'data-field': 'text'})
            author = testimonial.find(attrs={'data-field': 'author'})
            
            testimonials_data.append({
                'id': self.get_unique_id(),
                'elType': 'widget',
                'widgetType': 'testimonial',
                'settings': {
                    'testimonial_content': text.text if text else 'Quote',
                    'testimonial_name': author.text if author else 'Author',
                    'testimonial_job': 'Patient',
                }
            })
        
        return testimonials_data
    
    def convert(self) -> Dict:
        """Главная конвертация HTML → Elementor JSON"""
        
        sections = self.soup.find_all(attrs={'data-elementor-type': True})
        
        for section in sections:
            section_type = section.get('data-elementor-type')
            
            if section_type == 'hero':
                self.elementor_data.append(self.parse_hero_section(section))
            
            elif section_type == 'section':
                # Parse generic section
                title = section.find('h2')
                
                section_obj = {
                    'id': self.get_unique_id(),
                    'elType': 'section',
                    'settings': {
                        'title': title.text if title else 'Section',
                    },
                    'elements': [
                        {
                            'id': self.get_unique_id(),
                            'elType': 'column',
                            'elements': []
                        }
                    ]
                }
                
                # Check for service cards
                if section.find(attrs={'data-elementor-type': 'card'}):
                    section_obj['elements'][0]['elements'].extend(self.parse_service_cards(section))
                
                # Check for testimonials
                elif section.find(attrs={'data-elementor-type': 'testimonial'}):
                    section_obj['elements'][0]['elements'].extend(self.parse_testimonials(section))
                
                self.elementor_data.append(section_obj)
            
            elif section_type == 'cta':
                title = section.find(attrs={'data-field': 'title'})
                desc = section.find(attrs={'data-field': 'description'})
                btn = section.find(attrs={'data-field': 'button_text'})
                
                self.elementor_data.append({
                    'id': self.get_unique_id(),
                    'elType': 'section',
                    'settings': {
                        'title': 'CTA Section',
                        'background_color': '#2C5F4F',
                    },
                    'elements': [
                        {
                            'id': self.get_unique_id(),
                            'elType': 'column',
                            'elements': [
                                {
                                    'id': self.get_unique_id(),
                                    'elType': 'widget',
                                    'widgetType': 'heading',
                                    'settings': {
                                        'title': title.text if title else 'CTA Title',
                                        'text_align': 'center',
                                    }
                                },
                                {
                                    'id': self.get_unique_id(),
                                    'elType': 'widget',
                                    'widgetType': 'button',
                                    'settings': {
                                        'text': btn.text if btn else 'Call to Action',
                                    }
                                }
                            ]
                        }
                    ]
                })
            
            elif section_type == 'form':
                self.elementor_data.append({
                    'id': self.get_unique_id(),
                    'elType': 'section',
                    'settings': {'title': 'Contact Form'},
                    'elements': [
                        {
                            'id': self.get_unique_id(),
                            'elType': 'column',
                            'elements': [
                                {
                                    'id': self.get_unique_id(),
                                    'elType': 'widget',
                                    'widgetType': 'form',
                                    'settings': {
                                        'form_name': 'contact_form'
                                    }
                                }
                            ]
                        }
                    ]
                })
            
            elif section_type == 'footer':
                self.elementor_data.append({
                    'id': self.get_unique_id(),
                    'elType': 'section',
                    'settings': {'title': 'Footer'},
                    'elements': [
                        {
                            'id': self.get_unique_id(),
                            'elType': 'column',
                            'elements': []
                        }
                    ]
                })
        
        return {
            'title': 'Richard - Holistische Huisarts',
            'elements': self.elementor_data,
            'version': '1.0.0'
        }
    
    def save_json(self, output_file: str):
        """Save to JSON file"""
        result = self.convert()
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"✅ Gebeureurrd naar: {output_file}")
        return result


def main():
    print("=" * 60)
    print("🔄 HTML to Elementor JSON Converter")
    print("=" * 60)
    
    input_file = "index.html"
    output_file = "elementor_page.json"
    
    try:
        print(f"\n📂 Lees HTML bestand: {input_file}")
        converter = HTMLToElementorConverter(input_file)
        
        print("🔄 Converteert naar Elementor JSON...")
        result = converter.convert()
        
        print(f"📊 Gevonden {len(result['elements'])} secties")
        
        converter.save_json(output_file)
        
        print("\n✅ Conversie voltooid!")
        print(f"\n📢 Output bestand: {output_file}")
        print("\n📋 Stappen om in WordPress te importeren:")
        print("   1. Ga naar https://becoming-bass.10web.cloud/wp-admin/")
        print("   2. Elementor → Dashboard")
        print("   3. 'Import' kies het elementor_page.json bestand")
        print("   4. Pas styling aan in de Elementor editor")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ Fout: {e}")


if __name__ == "__main__":
    main()
