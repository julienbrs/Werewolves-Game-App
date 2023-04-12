# Express

- Dans `src`on va mettre toutes les routes de l'api.
- Lorsqu'on veut tester, ne pas oublier de lancer la base de données avec `docker-compose up` et de lancer le serveur avec `pnpm dev`.


## Architecture

- routes : définir les routes
- controllers : définir les fonctions qui vont être appelées par les routes
- services : "include all the business logic. It can have services that represent business objects and can run queries on the database. Depending on the need, even general services like a database can be placed here."
- utils : "directory that will have all the utilities and helpers needed for the application. It will also act as a place to put shared logic, if any. For example, a simple helper to calculate the offset for a paginated SQL query can be put in a helper.util.js file in this folder."
- test : tests unitaires

## ressources

- https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/