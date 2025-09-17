# MyContacts – Fullstack (React + Node/Express + MongoDB + JWT)

Carnet de contacts personnel avec authentification JWT, CRUD complet, documentation Swagger et déploiement Render + Netlify.

---

## 🚀 Liens en ligne

- **Backend (Render)** : [https://mycontacts-fljr.onrender.com](https://mycontacts-fljr.onrender.com)
- **Swagger** : [https://mycontacts-fljr.onrender.com/api-docs](https://mycontacts-fljr.onrender.com/api-docs)
- **Frontend (Netlify)** : [https://effulgent-shortbread-350bcc.netlify.app/](https://effulgent-shortbread-350bcc.netlify.app/)
- **Repo GitHub** : [https://github.com/djibril1212/MyContacts](https://github.com/djibril1212/MyContacts)

---

## 🛠️ Stack

- **Backend** : Node.js, Express, Mongoose, JWT, Swagger (OpenAPI 3)
- **Frontend** : React (Create React App), React Router, Axios
- **Database** : MongoDB Atlas

---

## 📂 Arborescence

```
MyContacts/
├─ server/        # API
│  ├─ src/
│  │  ├─ index.js            # bootstrap, listen
│  │  ├─ server.js           # middlewares, routes, swagger
│  │  ├─ lib/db.js           # connexion Mongo
│  │  ├─ models/User.js
│  │  ├─ models/Contact.js
│  │  ├─ routes/auth.routes.js
│  │  ├─ routes/contacts.routes.js
│  │  ├─ middleware/auth.js
│  │  ├─ utils/hash.js
│  │  ├─ utils/jwt.js
│  │  ├─ swagger.js
│  │  └─ swagger.yaml
│  ├─ package.json
│  └─ .env.example
└─ client/       # React frontend
   ├─ src/
   │  ├─ index.js
   │  ├─ App.js
   │  ├─ index.css
   │  ├─ lib/api.js
   │  ├─ store/auth.js
   │  └─ pages/{Login.js,Register.js,Contacts.js}
   ├─ public/index.html
   └─ package.json
```

---

## 🔧 Installation en local

### 1) Backend

```bash
cd server
cp .env.example .env
# Editer .env et remplir :
# PORT=4000
# MONGODB_URI=mongodb+srv://<USER>:<PWD>@<CLUSTER>.mongodb.net/mycontacts?retryWrites=true&w=majority
# JWT_SECRET=change_me
# JWT_EXPIRES_IN=7d
npm install
npm run dev
# Swagger: http://localhost:4000/api-docs
```

### 2) Frontend

```bash
cd client
echo "REACT_APP_API_URL=http://localhost:4000" > .env
npm install
npm start
# http://localhost:3000
```

---

## 🔐 Authentification

- `POST /api/auth/register` : crée un utilisateur, renvoie `{ token, user }`.
- `POST /api/auth/login` : renvoie `{ token, user }`.
- Le token doit être envoyé dans l'en-tête `Authorization: Bearer <token>`.
- Middleware `requireAuth` protège les routes `/api/contacts`.

---

## 📚 Endpoints principaux

| Method | Route              | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | /api/auth/register | Inscription utilisateur        |
| POST   | /api/auth/login    | Connexion utilisateur          |
| GET    | /api/contacts      | Liste des contacts (protégé)   |
| POST   | /api/contacts      | Créer un contact (protégé)     |
| PATCH  | /api/contacts/\:id | Modifier un contact (protégé)  |
| DELETE | /api/contacts/\:id | Supprimer un contact (protégé) |

---

## 📝 Notes de déploiement

- **Backend** : Render (Node 20.x)
- **Frontend** : Netlify (build via `npm run build`)
- **Database** : MongoDB Atlas (IP `0.0.0.0/0` le temps de la démo)

---

## 💡 Tests rapides

1. Créer un compte via Swagger ou le frontend.
2. Se connecter, copier le `token`.
3. Bouton **Authorize** dans Swagger → coller le token (sans "Bearer").
4. Tester les routes CRUD `/api/contacts`.

---

## 🔍 Identifiants de test (optionnel)

- Email : `demo@mail.com`
- Password : `secret123`

---

Projet réalisé dans le cadre du module **MyContacts** (EFREI) 
