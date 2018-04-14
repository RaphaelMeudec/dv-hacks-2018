# Visualization

This directory tackles with client-side rendering. There are two parts for this task:
- distributing the stored data -- Flask API, SQLAlchemy
- front-end visualizations (which corresponds to our demo) -- ReactJS

## Back-end API

### Installation

The API is implemented on a docker. To install and launch the API, follow these commands:

```
make install
make db/init
```


### Launching

Use the following command:

```
make start
```

This should launch a service on port 5000, with two available routes:
- a global GET which retrieves all scores stored in the database
- a region-oriented GET which retrieves scores in a bounding box (latitude1, longitude1) to (latitude2, longitude2)


## Front-end

### Installation

To install all npm dependencies, use:

```
yarn install
```

### Launching

Use the following command:

```
yarn start
```

You should be able to access our demo on http://localhost:3000/
