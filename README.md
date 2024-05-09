# Dashdoc - Technical Test

## Installation
Please make sure you run the following from the terminal inside the folder.

Install the packages:
```bash
npm i
```

Build (compiling from TypeScript to JavaScript):
```bash
npm run build
```

## Usage
The compiled TypeScript file exists in the dist folder
```bash
node dist/deliveryChecker.js "[[1,3],[2,5]]" "[1,2,3,4,5]"
```

In order to test via Jest:
```bash
node run test
```
