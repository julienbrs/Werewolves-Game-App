# Database

Ne pas oublier de créer un fichier `.env` à la racine du projet avec les variables d'environnement (voir `.env.example`)

Pour lancer la base de données

```bash
docker-compose up -d
```

Lorsqu'on modifie le model de la base de données, il faut faire un `prisma migrate dev` pour mettre à jour la base de données.
