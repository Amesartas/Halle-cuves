# Guide de déploiement — Halle Menu

## Ce que tu vas faire (30 min)

1. Créer un projet Supabase (base de données)
2. Pousser le code sur GitHub
3. Déployer sur Vercel (gratuit)
4. Configurer les formulaires GoHighLevel

---

## Étape 1 — Supabase

1. Va sur [supabase.com](https://supabase.com) → **New project**
2. Choisis un nom (ex: `halle-menu`) et un mot de passe
3. Une fois créé → **SQL Editor** → colle tout le contenu de `supabase-setup.sql` → **Run**
4. Va dans **Project Settings → API** et copie :
   - **Project URL** → c'est ta `SUPABASE_URL`
   - **service_role (secret)** → c'est ta `SUPABASE_SERVICE_KEY`

---

## Étape 2 — GitHub

1. Va sur [github.com](https://github.com) → **New repository** → nom : `halle-menu` → Create
2. Sur ton Mac, ouvre le Terminal dans le dossier `halle-menu` et lance :

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TON-USERNAME/halle-menu.git
git push -u origin main
```

---

## Étape 3 — Vercel

1. Va sur [vercel.com](https://vercel.com) → **Add New Project** → importe ton repo GitHub `halle-menu`
2. Avant de déployer, ajoute ces **Environment Variables** :

| Nom | Valeur |
|-----|--------|
| `SUPABASE_URL` | ta Project URL Supabase |
| `SUPABASE_SERVICE_KEY` | ta service_role key Supabase |
| `CRON_SECRET` | invente un mot de passe (ex: `halle2024secure`) |

3. Clique **Deploy** → attends 1-2 min

Ton app sera disponible sur une URL du type :
`https://halle-menu-xxxx.vercel.app`

### Tes URLs

| Fonction | URL |
|----------|-----|
| Exporter le tableau Excel | `https://halle-menu-xxxx.vercel.app/api/export` |
| Reset manuel (si besoin) | automatique chaque jeudi à minuit |

---

## Étape 4 — Configurer GoHighLevel

Pour **chaque stand**, tu vas créer un formulaire GHL :

### Créer le formulaire

1. GHL → **Sites → Forms → Add Form**
2. Ajoute 2 champs :
   - **Champ 1** : Label = "Plat du jour", Type = Texte court, **Field Key = `plat`**, limite 60 caractères
   - **Champ 2** : Label = "Prix", Type = Texte court, **Field Key = `prix`**
3. Dans les paramètres du formulaire → **Webhook URL** = l'URL du stand (voir tableau ci-dessous)

### URLs webhook par stand

| Stand | URL webhook à coller dans GHL |
|-------|-------------------------------|
| L'accolade | `https://VOTRE-URL.vercel.app/api/submit/acc-7k2m9p` |
| Bap | `https://VOTRE-URL.vercel.app/api/submit/bap-3n8xq1` |
| Chez Baba | `https://VOTRE-URL.vercel.app/api/submit/bab-5r4tw6` |
| Glacier Catalan | `https://VOTRE-URL.vercel.app/api/submit/gla-9j2ks8` |
| Break | `https://VOTRE-URL.vercel.app/api/submit/brk-1m7vd3` |
| Stan Dog | `https://VOTRE-URL.vercel.app/api/submit/std-4e9nb5` |
| La casa di fratelli | `https://VOTRE-URL.vercel.app/api/submit/cas-8p3yl7` |
| Pappadum | `https://VOTRE-URL.vercel.app/api/submit/pap-2x6hc4` |
| Focaccia & amici | `https://VOTRE-URL.vercel.app/api/submit/foc-6q1rz9` |
| La famille | `https://VOTRE-URL.vercel.app/api/submit/fam-3w8dt2` |
| Maximus | `https://VOTRE-URL.vercel.app/api/submit/max-7b4mk5` |
| Skewy | `https://VOTRE-URL.vercel.app/api/submit/skw-9n2pe8` |
| La frabrique à choux | `https://VOTRE-URL.vercel.app/api/submit/fra-5j7xv1` |
| Tonnerre de breizh | `https://VOTRE-URL.vercel.app/api/submit/ton-1y4ks6` |
| La Kaz'odile | `https://VOTRE-URL.vercel.app/api/submit/kaz-8m3qt9` |
| Ban aloun | `https://VOTRE-URL.vercel.app/api/submit/ban-4c7rn2` |
| Bar à viandes | `https://VOTRE-URL.vercel.app/api/submit/bar-6h1pw5` |
| Tata yoyo | `https://VOTRE-URL.vercel.app/api/submit/tat-2e9bm7` |
| Abba | `https://VOTRE-URL.vercel.app/api/submit/abb-5v3dk4` |

> Remplace `VOTRE-URL` par ton URL Vercel réelle.

### Page du stand (URL publique)

Dans GHL, chaque formulaire est embarqué dans une **Funnel page**.  
L'URL de cette page = le lien que tu donnes au restaurateur pour remplir son menu.

---

## Fonctionnement résumé

- **Chaque jeudi à minuit** (heure de Paris) → toutes les données sont effacées automatiquement
- **Si un stand resoumet** → ses données précédentes sont écrasées
- **Export Excel** → ouvre simplement l'URL `/api/export` dans un navigateur → le fichier se télécharge
