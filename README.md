# DealExpress API

Plateforme Node.js/Express permettant l’inscription des utilisateurs, la création de bons plans (“deals”), le vote HOT/COLD, la publication de commentaires et la modération par les administrateurs.

---

## Prérequis

- Node.js 18+ et npm
- Une instance MongoDB accessible via URI
- Variables d’environnement : `MONGODB_URL`, `JWT_SECRET`

---

## Installation

```bash
git clone <repo>
cd TpApiDealExpress
npm install
```

### Configuration

Créez un fichier `.env` à la racine :

```
MONGODB_URL=mongodb+srv://user:pass@cluster/db
JWT_SECRET=une_chaine_secrete
PORT=8080               # optionnel : l’app écoute 8080 par défaut
```

### Lancement

```bash
npm start
```

Le serveur expose les routes sur `http://localhost:8080`.

---

## Authentification & conventions

- Toutes les routes protégées attendent un en-tête `Authorization: Bearer <JWT>`.
- La pagination utilise `page` (défaut `1`) et sert 10 éléments par page.
- Les erreurs métier retournent un JSON `{ message, statusCode }`.

---

## Endpoints

### 1. Authentification (`/api/auth`)

| Méthode | Chemin      | Auth | Description |
|---------|-------------|------|-------------|
| POST    | `/register` | ❌   | Crée un compte et retourne un JWT. |
| POST    | `/login`    | ❌   | Authentifie via username ou email. |
| GET     | `/me`       | ✅   | Retourne le profil du token donné. |

**Body `POST /register`**

| Champ            | Type   | Obligatoire | Contraintes |
|------------------|--------|-------------|-------------|
| `username`       | string | ✅           | 3-30 char alphanum. |
| `email`          | string | ✅           | Email valide, ≤100 char. |
| `password`       | string | ✅           | ≥8 char. |
| `confirmPassword`| string | ✅           | Doit matcher `password`. |

**Body `POST /login`**

| Champ      | Type   | Obligatoire |
|------------|--------|-------------|
| `username` | string | ✅ (email ou pseudo) |
| `password` | string | ✅ |

---

### 2. Deals publics (`/api/deals`)

| Méthode | Chemin                    | Auth | Description |
|---------|---------------------------|------|-------------|
| GET     | `/`                       | optionnel | Liste paginée des deals approuvés (tous les deals si admin). Query `page`. |
| GET     | `/search?q=mot-clé`       | ❌    | Recherche plein texte dans titre + description (statut APPROVED). |
| GET     | `/:id`                    | ✅    | Détail d’un deal par son `ObjectId`. |
| POST    | `/`                       | ✅    | Création d’un deal en attente de modération. |
| PUT     | `/:id`                    | ✅    | Modification (auteur ou admin) tant que le deal n’est pas approuvé. |
| DELETE  | `/:id`                    | ✅    | Suppression par auteur ou admin. |

**Body `POST /api/deals`**

| Champ           | Type    | Obligatoire | Contraintes |
|-----------------|---------|-------------|-------------|
| `title`         | string  | ✅          | 5-100 char. |
| `description`   | string  | ✅          | 10-500 char. |
| `price`         | number  | ✅          | ≥0. |
| `originalPrice` | number  | ✅          | ≥0. |
| `category`      | string  | ✅          | `High-Tech` · `Maison` · `Mode` · `Loisirs` · `Autre`. |
| `url`           | string  | ❌          | ≤2048 char. |

**Body `PUT /api/deals/:id`**

Au moins un champ parmi `title`, `description`, `price`, `originalPrice`, `url`, `category`. Les mêmes contraintes que pour la création s’appliquent.

---

### 3. Votes sur un deal (`/api/deals/:id/vote`)

| Méthode | Chemin                     | Auth | Description |
|---------|----------------------------|------|-------------|
| POST    | `/:id/vote`                | ✅    | Ajoute ou met à jour un vote HOT/COLD. |
| DELETE  | `/:id/vote`                | ✅    | Retire le vote de l’utilisateur connecté. |

**Body `POST`**

| Champ | Type   | Obligatoire | Valeurs |
|-------|--------|-------------|---------|
| `type`| string | ✅          | `hot` ou `cold`. |

Chaque vote ajuste le champ `temperature` du deal (+1 pour HOT, -1 pour COLD).

---

### 4. Commentaires

#### Integrés au deal (`/api/deals/:dealId/comments`)

| Méthode | Chemin                               | Auth | Description |
|---------|--------------------------------------|------|-------------|
| GET     | `/api/deals/:dealId/comments`        | ❌   | Liste les commentaires d’un deal. |
| POST    | `/api/deals/:dealId/comments`        | ✅   | Ajoute un commentaire (champ `content`). |

#### Gestion directe (`/api/comments/:id`)

| Méthode | Chemin               | Auth | Description |
|---------|----------------------|------|-------------|
| PUT     | `/api/comments/:id`  | ✅   | Modifie un commentaire (auteur, modérateur ou admin). |
| DELETE  | `/api/comments/:id`  | ✅   | Supprime un commentaire (auteur ou admin). |

**Body comment**

| Champ    | Type   | Obligatoire | Contraintes |
|----------|--------|-------------|-------------|
| `content`| string | ✅          | 3-500 char. |

---

### 5. Administration (`/api/admin`)

Toutes les routes exigent un token, puis un rôle spécifique :

| Méthode | Chemin                       | Rôle requis           | Description |
|---------|------------------------------|-----------------------|-------------|
| GET     | `/deals/pending`             | admin · moderator     | Liste des deals à modérer. |
| PATCH   | `/deals/:id/moderate`        | admin · moderator     | Passe un deal en `approved` ou `rejected`. Body `status`. |
| GET     | `/users?page=1`              | admin                 | Liste paginée des utilisateurs. |
| PATCH   | `/users/:id/role`            | admin                 | Change le rôle d’un utilisateur (sauf soi-même). |

**Body modération**

| Route                           | Champ   | Valeurs |
|---------------------------------|---------|---------|
| PATCH `/deals/:id/moderate`     | `status`| `approved` ou `rejected`. |
| PATCH `/users/:id/role`         | `role`  | `user`, `moderator`, `admin`. |

---

## Exemples d’utilisation

> Remplacez `TOKEN` par le JWT récupéré lors du login.

### Inscription

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "massil",
    "email": "massil@example.com",
    "password": "Passw0rd!",
    "confirmPassword": "Passw0rd!"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "username": "massil", "password": "Passw0rd!" }'
```

### Création d’un deal

```bash
curl -X POST http://localhost:8080/api/deals \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nintendo Switch OLED",
    "description": "Bundle console + Zelda à 299€",
    "price": 299,
    "originalPrice": 369,
    "category": "High-Tech",
    "url": "https://boutique.example/switch"
  }'
```

### Vote HOT

```bash
curl -X POST http://localhost:8080/api/deals/6631f52e012ed1ca7cb1650ee/vote \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "type": "hot" }'
```

### Commentaire sur un deal

```bash
curl -X POST http://localhost:8080/api/deals/6631f52e012ed1ca7cb1650ee/comments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "content": "Super promo, merci !" }'
```

### Modération d’un deal

```bash
curl -X PATCH http://localhost:8080/api/admin/deals/6631f52e012ed1ca7cb1650ee/moderate \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "approved" }'
```

---

## Journalisation & gestion des erreurs

- Les requêtes sont loggées via `src/utils/logger.js` (console + fichiers `src/logs`).
- Les erreurs passent par `errorMiddleware` et répondent avec un JSON homogène.

---

