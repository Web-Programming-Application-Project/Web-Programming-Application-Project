# Web-Programming-Application-Project
```
git switch [branch]
```
```
git pull origin main
```
kopsaa envi ja installaa depsit
```
cp .env.example .env
```
```
npm install
```
testaus
```
docker compose -f docker-compose.test.yml up --build --exit-code-from tester tester && docker compose -f docker-compose.test.yml --profile test down
```
- avaa docker sovellus 
```
docker compose up --build --force-recreate
```

Yksittäiset: `npm test`, `npm run test:integration`, `npm run test:e2e`.
