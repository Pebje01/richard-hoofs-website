#!/bin/bash
# WordPress REST API - Handige commando's

SITE="https://becoming-bass.10web.cloud"
USERNAME="Richard"
PASSWORD="kZDK dnZt 7Kbp 87vs Jtpl K3ks"

# Basis64 encoding van credentials
CREDENTIALS=$(echo -n "$USERNAME:$PASSWORD" | base64)

echo "🔗 WordPress REST API Commands"
echo "==============================="
echo ""

# 1. Test verbinding
echo "1️⃣  Test verbinding:"
echo "curl -H 'Authorization: Basic $CREDENTIALS' \\"
echo "  $SITE/wp-json/wp/v2/users/me"
echo ""

# 2. Posts ophalen
echo "2️⃣  Posts ophalen:"
echo "curl -H 'Authorization: Basic $CREDENTIALS' \\"
echo "  '$SITE/wp-json/wp/v2/posts?per_page=10'"
echo ""

# 3. Site informatie
echo "3️⃣  Site informatie:"
echo "curl -H 'Authorization: Basic $CREDENTIALS' \\"
echo "  $SITE/wp-json/"
echo ""

# 4. Custom post type (als beschikbaar)
echo "4️⃣  Descriptions of Elementor posts:"
echo "curl -H 'Authorization: Basic $CREDENTIALS' \\"
echo "  '$SITE/wp-json/wp/v2/posts?_fields=id,title,slug,meta'"
echo ""

echo "==============================="
echo "💡 Tip: Voeg -v toe voor verbose output"
echo "   bijv: curl -v -H 'Authorization: ...' ..."
echo ""
echo "💡 Tip: Pretty print JSON met jq:"
echo "   bijv: curl ... | jq ."
