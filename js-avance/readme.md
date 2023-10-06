# Projet

## Objectifs

* Récupérer des données en asynchrone
* Manipuler les données des tableaux
* Afficher des données dynamiques dans la page html
* Utiliser les promesses
* Consommer une API
* Utiliser une bibliothèque externe
* Organiser son code en module, pour le rendre plus flexible et facile à réutiliser
* Déposer son code sur un dépôt github

## Données

Pour cet exercice vous récupérerez les données depuis une API publique : 
* [Url api liste des cinémas](https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records)
* [Lien documentation](https://data.culture.gouv.fr/explore/dataset/etablissements-cinematographiques/api/)

## Instructions

Après chaque étape essayez de refactoriser votre code.

### 1. Créer le dépôt github

Créez un dépôt github "Projet JS avancé". Ce dépôt servira pour l'évaluation des compétences du module. Pensez à faire des commit régulièrement (après chaque étape par exemple).

### 2. Mettre en place les fichiers du projet

* Créez un fichier *index.html*
* Créez un sous-dossier *js* et un fichier *main.js* à l'intérieur
* Chargez le fichier *main.js* dans l'index en type module
* Lancez le projet depuis un serveur web

### 3. Liste des cinémas

* Au chargement de la page, récupérez la liste des cinémas depuis l'API
* Affichez la liste dans la page web (nom et adresse + commune du cinéma)
* Triez les résultats par nombre de fauteuils

### 4. Géolocalisation

* Au chargement de la page, récupérez la latitude et la longitude de l'utilisateur
* Lorsque cette dernière a été récupérée, affichez les résultats des cinémas avec une information supplémentaire : la distance entre le cinéma et l'utilisateur

Pour récupérer la distance en km entre 2 points de coordonnées, vous pouvez utiliser la formule de Haversine :

```javascript
/**
 * Calcule la distance entre 2 points de coordonnées GPS
 * Les 2 paramètres de cette fonction sont des tableaux respectant le format [latitude, longitude]
 *
 * @param {Array} origin La latitude et la longitude du premier point
 * @param {Array} target La latitude et la longitude du second point
 * @return {int} La distance en km
 */
function haversine(origin, target) {
	const [lat1, lon1] = origin;
	const [lat2, lon2] = target;

    // Rayon de la Terre en kilomètres (approximatif)
    const earthRadius = 6371;

    // Conversion des degrés en radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;

    // Différence de latitude et de longitude
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Calcul de la distance en utilisant la formule de la haversine
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance en kilomètres
    const distance = earthRadius * c;

    return distance;
}
```

Mettez cette fonction dans un fichier *math.js* dans le dossier "module/utils". Il faudra que cette fonction puisse être exportée.

### 5. [BONUS] Pagination des résultats

L'API ne renvoie par défaut que les 10 premiers résultats. Il est possible de modifier le nombre de résultats par page grâce au paramètre *limit* de la chaîne de requête et on peut également afficher les résultats d'une autre page à l'aide du paramètre *offset*.


Exemple : url-de-l-api?offset=40&limit=20 -> affiche les 20 résultats de la page 3

Affichez une pagination pour la liste des cinémas.

### 6. [BONUS] Cinémas de proximité

Récupérez les cinémas proches de ma position et les afficher. Cela peut se faire à l'aide des filtres de l'API. Utilisez la fonction *haversine* pour calculer la distance de ces cinémas par rapport à votre position et les trier du plus proche au plus éloigné.

### 7. [BONUS++] Cinémas à la carte

Mettez en place une carte type google maps sur laquelle vous allez afficher la liste de tous les cinémas proches de votre position. Il vous faudra filtrer là encore les résultats de l'API pour ne récupérer que les cinémas présents dans les limites de la carte.

Liens utiles : 
* [mapquest](https://developer.mapquest.com/)
* [leaflet](https://leafletjs.com/)