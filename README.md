# ndossi_hair — Site Vitrine

Site vitrine complet pour le salon de coiffure afro ndossi_hair.

## Stack technique

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma + SQLite**
- **NextAuth.js v4**
- **Framer Motion** (toutes les animations)
- **Lenis** (smooth scroll)

## Installation en 5 étapes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
```

Modifiez `.env` avec vos valeurs (le fichier par défaut est fonctionnel pour le développement).

### 3. Créer la base de données

```bash
npm run db:push
```

### 4. Remplir la base de données (données de démo)

```bash
npm run db:seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Le site est accessible sur https://ndossi.vercel.app/


## Fonctionnalités

### Site public
- **Accueil** : Hero avec parallaxe, stats animées, services, galerie aperçu, pourquoi nous
- **Galerie** : Grille masonry avec filtre Femmes/Hommes/Tout + lightbox
- **Réservation** : Calendrier interactif, créneaux disponibles, formulaire complet

### Administration (`/admin/dashboard`)
- **Agenda** : Vue calendrier des créneaux libres et réservés
- **Disponibilités** : Ajouter / supprimer des créneaux horaires
- **Réservations** : Tableau clients avec annulation possible
- **Galerie** : Ajout / suppression d'images avec catégorie et dégradé



### Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion à la base de données |
| `NEXTAUTH_URL` | URL complète du site |
| `NEXTAUTH_SECRET` | Clé secrète NextAuth (32+ caractères) |
| `ADMIN_EMAIL` | Email de l'administrateur |
| `ADMIN_PASSWORD` | Mot de passe de l'administrateur |

## Structure du projet

```
ndossi-hair/
├── app/
│   ├── admin/          # Pages administration
│   ├── api/            # Routes API
│   ├── galerie/        # Page galerie
│   ├── reserver/       # Page réservation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx        # Page d'accueil
├── components/         # Composants React
├── lib/                # Utilitaires, Prisma, Auth
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── public/
```
