# Déploiement nginx — note post-migration SSG

Le site est désormais pré-rendu : `dist/` contient un fichier HTML par route
(`/guepes/index.html`, `/interventions/crest/index.html`, …) au lieu d'un seul
`index.html` de SPA. Il y a 115 pages HTML (7 pages fixes + 108 communes).

## Config nginx requise sur le VPS

Le bloc `location /` doit servir les fichiers pré-rendus et renvoyer un vrai 404
pour les URL inconnues — **PAS** un fallback SPA vers `/index.html` (sinon toute
URL inexistante renvoie la home en HTTP 200, ce qui nuit au référencement) :

```nginx
server {
    root /var/www/valdrome-guepes-frelons/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # cache long pour les assets fingerprintés
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Si la config actuelle contient un fallback SPA du type
`try_files $uri $uri/ /index.html;` (ou `try_files $uri /index.html;`), le
remplacer par la ligne ci-dessus, puis :

```bash
nginx -t && systemctl reload nginx
```

## Redirections

Si l'ancien domaine `valdrome-guepes-frelons.fr` (ou tout autre domaine) pointe
encore vers ce serveur, ajouter une redirection 301 permanente vers
`https://frelons-guepes-destruction.fr` pour consolider le référencement :

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name valdrome-guepes-frelons.fr www.valdrome-guepes-frelons.fr;
    return 301 https://frelons-guepes-destruction.fr$request_uri;
}
```

## Après déploiement

1. Vérifier `https://frelons-guepes-destruction.fr/sitemap.xml` (toutes les
   communes listées, une URL par page).
2. Soumettre le sitemap dans Google Search Console.
3. Tester le partage d'une URL sur Facebook / LinkedIn (aperçu OpenGraph :
   image, titre, description).
4. Rich Results Test (`https://search.google.com/test/rich-results`) sur la home
   et une page commune — vérifier LocalBusiness / PestControl, BreadcrumbList,
   FAQPage.
5. Valider le JSON-LD sur `https://validator.schema.org/` (coller le HTML de
   `dist/index.html` puis de `dist/interventions/crest/index.html`) — 0 erreur
   attendue, warnings tolérés.
