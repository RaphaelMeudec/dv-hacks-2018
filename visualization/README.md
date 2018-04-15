# Visualization

This directory tackles with client-side rendering. There are two parts for this task:
- distributing the stored data -- Flask API, SQLAlchemy
- front-end visualizations (which corresponds to our demo) -- ReactJS

## Back-end API

### Installation

The API is implemented on a docker. To install and launch the API, follow these commands:

```
cd visualization/geo-score-api
make install
```


### Launching

Use the following command:

```
make start
```

This should launch a service on port 5000, with two available routes:
- a global GET which retrieves all scores stored in the database
- a region-oriented GET which retrieves scores in a bounding box (latitude1, longitude1) to (latitude2, longitude2)

## Front-End

### Installation

To install all [npm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04) dependencies, use:

```
cd ../front
npm install
```

### Launching

Use the following command:

```
npm start
```

You should be able to access our demo on http://localhost:3000/
