# 🎨 Elementor Custom Fonts - Handleiding

## ✅ Verbinding Geverifieerd
- ✅ Site: **DokterRichard.nl** (becoming-bass.10web.cloud)
- ✅ Gebruiker: **Richard**
- ✅ API Access: **Actief**

---

## 📋 Stappen om Custom Fonts toe te voegen

### Optie 1: Via WordPress Admin (Aanbevolen)

1. **Log in op admin panel**
   ```
   https://becoming-bass.10web.cloud/wp-admin/
   ```

2. **Ga naar Elementor Settings**
   - Linkermenu → "Elementor"
   - Zoek naar "Custom Fonts" of "Typography"

3. **Voeg font toe**
   - Klik "+ Add Custom Font"
   - Vul in:
     - **Font Name**: (bijv. "Mijn Custom Font")
     - **Font Files**: Upload .ttf, .otf, .woff bestanden
   
4. **Gebruik in editor**
   - Open pagina in Elementor
   - Kies in Typography je nieuwe font

---

### Optie 2: Via Python Script (dit mapje)

**Test verbinding:**
```bash
python3 wordpress_elementor_manager.py
```

**Interactief menu:**
```bash
python3 manage_fonts.py
```

---

## 🎯 Soorten Font Formaten

| Format | Browser Support | Gr. Gebruikelijk |
|--------|-----------------|------------------|
| .woff2 | Modern (Nieuw)  | ⭐⭐⭐⭐⭐ |
| .woff  | Modern          | ⭐⭐⭐⭐ |
| .ttf   | Alle browsers   | ⭐⭐⭐⭐⭐ |
| .otf   | Meeste         | ⭐⭐⭐ |
| .eot   | Internet Explorer | ⭐ |

**Best practice**: Voeg meerdere formaten toe voor maximale compatibiliteit

---

## 💡 Tips & Tricks

### Google Fonts gebruiken
1. Ga naar https://fonts.google.com
2. Kies font
3. Klik "+ Select this style"
4. Kijk tabblad "@import" of download

### Font Bestanden Comprimeren
```bash
# macOS - verkleinen met Fonttools
pip install fonttools
fonttools subset yourfont.ttf --unicodes-file=chars.txt
```

### CDN gebruiken (sneller laden)
- Upload fonts op: Cloudflare CDN, jsDelivr, Google Fonts
- Kopieer URL in Elementor

---

## 🔧 Troubleshooting

### Fonts laden niet
- Controleer CORS headers (moet toestaan van andere domeinen)
- Zorg dat `.woff` of `.woff2` formaat gebruikt
- Check console in browser DevTools (F12)

### API verbinding mislukt
- Controleer username en application password
- Zorg dat API access is ingeschakeld in WordPress
- Check firewall/2FA instellingen

### Elementor herkent fonts niet
- Refresh pagina (Ctrl+Shift+R)
- Clear Elementor cache: Elementor → Settings → Safe Mode
- Controleer dat fonts correct geüpload zijn

---

## 📚 Bronnen

- 📖 [WordPress REST API Docs](https://developer.wordpress.org/rest-api/)
- 📖 [Elementor Custom Fonts](https://elementor.com/help/custom-fonts/)
- 📖 [Font File Best Practices](https://www.w3.org/TR/WOFF2/)

---

## 🚀 Volgende Stappen

1. ✅ **Verbinding getest** - Werkt!
2. 📥 **Fonts klaar maken** - Zorg voor .woff2 / .ttf bestanden
3. 🌐 **Fonts hosten** - Op server of CDN
4. ➕ **Toevoegen in Elementor** - Via admin panel
5. 🎨 **Gebruiken in pagina's** - Kies in Typography menu

---

**Vragen?** Check de Elementor docs of de WordPress REST API documentatie.
