# Tekninen määrittely: Elokuvaharrastajien yhteisöpalvelu

**Versio:** 0.1 (luonnos)
**Päivämäärä:** 11.11.2026
**Laatija:** Projektiryhmä SG 8
**Tila:** Luonnos. Perustuu vaatimusmäärittelyyn 0.1 (29.10.2026) ja projektin nykyiseen lähdekoodiin.


---

## 1. Johdanto

Tämä on tekninen määrittely.

## 2. Suunnittelun lähtökohdat ja rajaus

### 2.1 Lähtötiedot

- Vaatimusmäärittely 0.1: roolit, käyttötilanteet, FR/NFR-vaatimukset ja Prioriteetit.
- Asiakkaan linjaukset 26.10. ja QA-tilaisuus 28.–29.10.
- Projektin runko: React 19 + Vite -frontend, Express 5 -backend, PostgreSQL 18, Docker Compose, Azure-julkaisu GitHub Actionsilla.


---

## 3. Teknologiavalinnat

| Osa-alue | Teknologia | Versio |
| --- | --- | --- |
| Frontend | React | 19.x |
| Build | Vite | 7.x |
| Reititys | React Router | 7.x |
| UI-tyyli | Bootstrap + Bootstrap Icons | 5.3.x |
| Backend | Node.js + Express | 24.x / 5.x |
| Tietokanta | PostgreSQL | 18.x |
| Tietokanta-ajuri | `pg` | 8.x |
| Autentikointi | JWT evästeessä + argon2 | jsonwebtoken 9.x, argon2 0.45.x |
| Validointi | `validator` | 13.x |
| HTTP-asiakas | `axios` | 1.x |
| Testaus | Vitest + Supertest + Playwright | 5.x / 7.x / 1.65.x |
| Kontitus | Docker + Docker Compose | - |
| CI/CD | GitHub Actions | - |
| Hosting | Azure Web App | - |


---

## 4. Arkkitehtisuunnittelu

### 4.1 Arkkitehtuurimalli ja kerrokset



**Kerrosten vastuut:**

| Kerros | Vastuu | Sijainti koodissa |
| --- | --- | --- |
| View | Käyttöliittymä, reititys, lomakkeet, tilanhallinta | `src/` |
| Controller | Pyynnön validointi, liiketoimintalogiikka, vastauksen muodostus | `api/controllers/` |
| Model | Tietokantakyselyt ja rivien muunnos | `api/models/` |
| Route | Polut ja HTTP-metodit | `api/routes/` |
| Middleware | Autentikointi, CSRF, virheenkäsittely | `api/middleware/` |

### 4.2 ER-Kaaviot

WIP


### 4.3 Moduulit ja vastuut

| Moduuli | Vastuu | Keskeiset vaatimukset |
| --- | --- | --- |
| Auth | Rekisteröinti, kirjautuminen, uloskirjautuminen, istunto, salasanan palautus, tilin poisto, 2FA | FR-13–FR-18, NFR-04, NFR-12 |
| Movie | Haku, suodatus, elokuvan tiedot, samankaltaiset elokuvat, näytösajat | FR-01–FR-12, NFR-01, NFR-11 |
| Group | Ryhmien luonti, liittymispyynnöt, jäsenhallinta, ryhmän elokuvat, chat | FR-20–FR-32 |
| Review | Tähtiarvostelut, kommentit, näkyvyys, muokkaus | FR-33–FR-42 |
| List | Toive- ja suosikkilistat, jakaminen | FR-43–FR-46 |
| Recommendation | Suositukset katseluhistorian perusteella | FR-47–FR-48 |
| Shared | Autentikointi, CSRF, virheenkäsittely, validointi | NFR-04–NFR-07 |

### 4.4 Moduulien väliset rajapinnat ja riippuvuudet

- Frontend kutsuu backendia vain `src/api.js`-asiakkaan kautta. Suoraa `fetch`-kutsua komponenteissa ei käytetä.
- Backendin moduulit eivät kutsu toisiaan suoraan, vaan jakavat `models`-kerroksen ja middlewaret.
- Ulkoiset riippuvuudet on eristetty omiin palveluihinsa:
  - TMDB-asiakas (NFR-11)
  - Näytösaikojen tarjoaja (FR-10, FR-11)
  - Sähköpostipalvelu (FR-15)

---

## 5. Tietokantasuunnittelu

### 5.1 Periaatteet

- Relaatiomalli, PostgreSQL.
- Salasanoja ei koskaan tallenneta selkokielisenä (NFR-04).
- Elokuvista tallennetaan vain TMDB-tunniste, muut tiedot haetaan TMDB:stä (FR-07).

### 5.2 Toteutettu tietokanta

Tietokanta on toistaiseksi kehitysvaiheessa. Toteutettu on vain käyttäjähallinnan taulu.

```mermaid
erDiagram
    USERS {
        bigint id PK
        text username UK
        text email UK
        text hashed_password
    }
```


### 5.3 Toteutetut taulut

**users**

| Sarake | Tyyppi | Rajoite | Kuvaus |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Käyttäjän tunniste |
| username | TEXT | NOT NULL, UNIQUE | Nimimerkki |
| email | TEXT | NOT NULL, UNIQUE | Sähköposti |
| hashed_password | TEXT | NOT NULL | Argon2-tiiviste |

### 5.4 Suunniteltavat taulut (TODO)


| Taulu | Vastaa vaatimuksia | Tila |
| --- | --- | --- |
| movies | FR-07 | Suunnittelematta |
| groups | FR-20–FR-28 | Suunnittelematta |
| group_members | FR-21, FR-26–FR-28 | Suunnittelematta |
| group_movies | FR-29 | Suunnittelematta |
| reviews | FR-33–FR-42 | Suunnittelematta |
| lists | FR-43–FR-46 | Suunnittelematta |
| list_items | FR-43–FR-46 | Suunnittelematta |
| password_reset_tokens | FR-15 | Suunnittelematta |
| group_messages | FR-32 | Suunnittelematta |


---

## 6. Rajapinnat


### 6.1 Virhevastaukset

Tavoitemuoto:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Anna kelvollinen käyttäjänimi, sähköposti ja salasana"
  }
}
```

| HTTP-tila | Merkitys |
| --- | --- |
| 200 | Onnistunut haku tai päivitys |
| 201 | Luotu |
| 204 | Poistettu, ei sisältöä |
| 400 | Virheellinen syöte |
| 401 | Kirjautuminen puuttuu tai istunto vanhentunut |
| 403 | Ei oikeutta tai CSRF-virhe |
| 404 | Kohdetta ei löydy |
| 409 | Ristiriita, esim. varattu nimimerkki |
| 422 | Liiketoimintasääntö estää toiminnon |
| 429 | Liikaa pyyntöjä |
| 500 | Palvelinvirhe |


### 6.2 Toteutetut endpointit

| Metodi | Polku | Kuvaus | Auth | Tila |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | Terveystarkistus | – | Toteutettu |
| GET | `/api/tests` | Kehityksen testidata | – | Kehitysoikopolku, poistetaan |
| POST | `/api/auth/register` | Rekisteröityminen | – | Toteutettu |
| POST | `/api/auth/login` | Kirjautuminen | – | Toteutettu |
| GET | `/api/auth/me` | Nykyinen käyttäjä | Kyllä | Toteutettu |

> **Nykytila:** `authRouter.js` sisältää vain `register`, `login` ja `me` -reitit. Frontend kutsuu jo `/auth/logout`-reittiä, jota ei ole vielä toteutettu.

### 6.3 Suunniteltavat endpointit (TODO)

| Moduuli | Suunnitellut endpointit | Vaatimukset | Tila |
| --- | --- | --- | --- |
| Auth | `POST /api/auth/logout`, `PATCH /api/auth/password`, `DELETE /api/auth/account`, salasanan palautus, 2FA | FR-14–FR-18 | Suunnittelematta |
| Movies | `GET /api/movies`, `/trending`, `/:tmdbId`, `/:tmdbId/similar`, `/:tmdbId/showtimes` | FR-01–FR-12 | Suunnittelematta |
| Reviews | `GET/POST /api/movies/:tmdbId/reviews`, `PATCH/DELETE /api/reviews/:id` | FR-33–FR-42 | Suunnittelematta |
| Groups | `/api/groups`, jäsenyydet, liittymispyynnöt, ryhmän elokuvat, chat | FR-20–FR-32 | Suunnittelematta |
| Lists | `/api/lists`, `/api/lists/:type/items`, jakolinkit, `/api/shared/:token` | FR-43–FR-46 | Suunnittelematta |
| Recommendations | `GET /api/recommendations`, `DELETE /api/recommendations/:tmdbId` | FR-47–FR-48 | Suunnittelematta |

> **TODO:** Täydennä jokaisen endpointin metodi, polku, pyyntö- ja vaste-esimerkki, virhetilat ja autorisaatio, kun se toteutetaan.

### 6.4 Esimerkit

**Rekisteröityminen**

```http
POST /api/auth/register
Content-Type: application/json
X-CSRF-Token: <token>

{
  "username": "elokuvafani",
  "email": "fani@example.com",
  "password": "vahva-salasana-123"
}
```

```http
HTTP/1.1 201 Created

{
  "message": "Käyttäjä luotu",
  "user": { "id": 1, "username": "elokuvafani", "email": "fani@example.com" }
}
```

### 6.5 Ulkoiset integraatiot (TODO)

| Integraatio | Käyttötarkoitus | Vaatimus | Tila |
| --- | --- | --- | --- |
| TMDB API | Elokuvien haku ja tiedot | FR-07, NFR-11 | Suunnittelematta |
| Näytösaika tietolähde | Teatterinäytösajat | FR-10, FR-11 | Suunnittelematta |
| Sähköposti palvelu | Salasanan palautus | FR-15 | Suunnittelematta |

> **TODO:** Valitse toteutustapa, API-avainten käsittely, lisenssiehdot ja pyyntöjen rajoitus, kun integraatio toteutetaan.

---

## 7. Moduulisuunnittelu

### 7.1 Backend-rakenne

```text
api/
├── app.js                 # Express-sovellus, middlewaret, reititys
├── index.js               # Palvelimen käynnistys
├── config.js              # Evästeen nimi ja JWT-claimsit
├── init.sql               # Kehityksen tietokantaskeema
├── controllers/           # Liiketoimintalogiikka
├── middleware/            # csrf, requireAuth, errorHandler
├── models/                # Tietokantakyselyt
└── routes/                # Express-routerit
```


### 7.2 Frontend-rakenne

```text
src/
├── api.js                 # Yhteinen fetch-asiakas + CSRF
├── App.jsx                # Reititys
├── components/
│   ├── AuthProvider.jsx   # Istunnon tila
│   ├── ProtectedRoute.jsx # Suojatut reitit
│   └── ...
└── pages/                 # Sivut
```

**Suunnitellut sivut:**

| Reitti | Sivu | Auth | FR |
| --- | --- | --- | --- |
| `/movies` | Haku ja suodatus | – | FR-02–FR-05 |
| `/movies/:tmdbId` | Elokuvan sivu | – | FR-06–FR-10 |
| `/profile` | Profiili ja salasanan vaihto | Kyllä | FR-17 |
| `/groups` | Ryhmät | – | FR-23 |
| `/groups/:id` | Ryhmän sivu | Jäsen | FR-29–FR-32 |
| `/lists` | Omat listat | Kyllä | FR-43, FR-44 |
| `/shared/:token` | Jaettu lista | – | FR-45 |

### 7.3 Luokkakaavio

> **Nykytila:** Kaavio on tavoitesuunnitelma. Toteutettu on `AuthController` (`register`, `login`, `me`) ja `User` (`createUser`, `findByIdentifier`, `findById`). Muut luokat toteutetaan vaiheittain.

```mermaid
classDiagram
    class AuthController {
        +register(req, res)
        +login(req, res)
        +logout(req, res)
        +me(req, res)
        +requestPasswordReset(req, res)
        +confirmPasswordReset(req, res)
    }

    class User {
        +id
        +username
        +email
        +passwordHash
        +createUser()
        +findByIdentifier()
        +findById()
        +deleteUser()
    }

    class MovieService {
        +search(params)
        +getById(tmdbId)
        +getSimilar(tmdbId)
        +getShowtimes(tmdbId, city)
    }

    class GroupController {
        +create(req, res)
        +requestJoin(req, res)
        +approve(req, res)
        +removeMember(req, res)
        +addMovie(req, res)
    }

    class ReviewController {
        +listPublic(tmdbId)
        +create(req, res)
        +update(req, res)
        +remove(req, res)
    }

    class ListController {
        +getList(req, res)
        +addItem(req, res)
        +removeItem(req, res)
        +share(req, res)
        +unshare(req, res)
    }

    AuthController --> User
    GroupController --> User
    ReviewController --> User
    ListController --> User
    MovieService --> User
```

### 7.4 Keskeiset algoritmit

- **Haku (FR-02):** TMDB-haku ensisijaisesti, tulokset järjestetään osumatarkkuuden mukaan. Epätäydellinen nimi sallitaan TMDB:n hakulogiikalla.
- **Suodatus (FR-04, FR-05):** genre- ja vuosikymmensuodattimet yhdistetään kyselyparametreiksi.
- **Näkyvyys (FR-38):** arvostelun `visibility=group` palautetaan vain, jos pyytäjä on kyseisen ryhmän hyväksytty jäsen.
- **Suositukset (FR-47):** vältetään yhden genren ylikorostumista, ehdokkaisiin lisätään monipuolisuutta.


### 7.5 Virheenkäsittely

- Controllerit palauttavat tunnetut virheet `next(error)`-kutsulla tai suoraan tilakoodilla.
- `errorHandler` muodostaa yhtenäisen vastauksen.
- Odottamattomat virheet kirjataan palvelinlokiiin ilman henkilötietoja.
- Tietokantavirheistä käsitellään erikseen ainutlaatuisuusrikkomus (`23505`).

---

## 8. Käyttöliittymäsuunnittelu teknisellä tasolla


### 8.1 Komponenttirakenne

- Sivut kokoavat uudelleenkäytettäviä komponentteja.
- Lomakkeet validoivat syötteen sekä selaimessa että palvelimella.
- Virheet näytetään käyttäjälle suomeksi.


---

## 9. Tietoturva

### 9.1 Salaisuudet ja ympäristöt

- `JWT_SECRET`, tietokannan tunnukset, TMDB-avain ja sähköpostin tunnukset vain ympäristömuuttujissa.
- `.env` ei koskaan versionhallintaan.
- Tuotannossa Azure App Servicen asetukset ja GitHub Actions -salaisuudet.

### 9.2 Tietosuoja ja GDPR

- Kerätään vain nimimerkki ja sähköposti (NFR-07).
- Käyttäjä voi poistaa tilinsä ja tietonsa (FR-16).
- Käyttöehdot ja tietosuojaseloste ennen todellisia käyttäjiä (NFR-08).
- Henkilötietoja ei myydä eikä luovuteta (FR-50).

---

## 10. Suorituskyky ja skaalautuvuus

### 10.1 NFR-tavoitteet

| ID | Tavoite | Ratkaisu | Todentaminen |
| --- | --- | --- | --- |
| NFR-01 | Haku ja sivun avautuminen alle 1 s | Indeksit, välimuisti, kevyt JSON, paginointi | Suorituskykytesti |
| NFR-02 | Mobiilikäyttö 360–430 px | Responsiivinen Bootstrap-grid | Käyttöliittymätesti |
| NFR-06 | HTTPS tuotannossa | Azure-päätepiste, pakotettu HTTPS | Julkaisun tarkistus |

### 10.2 Ratkaisut

- Tietokantakyselyt indeksoidaan hakujen ja listausten mukaan.
- TMDB-vastauksia voidaan välimuistittaa lyhytaikaisesti (esim. 5–15 min).
- Suuret listat paginoidaan.
- Staattiset tiedostot tarjoillaan Expressin `static`-middlewarella ja selaimen välimuistilla.


---

## 11. Testaus ja laadunvarmistus

### 11.1 Testitasot

| Taso | Työkalu | Sijainti | Kattavuus |
| --- | --- | --- | --- |
| Yksikkötestit | Vitest | `tests/api/` | Controllerit, mallit, middlewaret |
| Integraatiotestit | Vitest + Supertest | `tests/integration/` | API-polut ja tietokanta |
| E2E-testit | Playwright | `tests/e2e/` | Kirjautuminen ja keskeiset käyttöpolut |
| Linttaus | ESLint | koko repo | Tyylivirheet ja mahdolliset bugit |


### 11.2 CI/CD

- Jokainen `main`-haaran push rakentaa, testaa ja julkaisee Azureen.
- Testit ajetaan myös Docker Composella (`docker-compose.test.yml`).
- Definition of Done edellyttää, että ominaisuus toimii käyttöliittymästä tietokantaan ja on testattu.


---

## 12. Julkaisu ja ympäristöt

### 12.1 Ympäristöt

| Ympäristö | Käyttö | Tietokanta | Osoite |
| --- | --- | --- | --- |
| Kehitys | Paikallinen Docker Compose | PostgreSQL-kontti | `localhost:5173` / `localhost:3000` |
| Testi | Docker Compose test-profiili | PostgreSQL-kontti | `frontend:5173` |
| Tuotanto | Azure Web App | Erillinen PostgreSQL | Julkinen HTTPS-osoite |



### 12.2 Julkaisuprosessi

1. Kehittäjä tekee muutoksen ja testaa paikallisesti.
2. Muutos viedään `main`-haaraan. Edellyttää toisen käyttäjän hyväksynnän.
3. GitHub Actions rakentaa, testaa ja julkaisee.

---

## 13. Avoimet tekniset kysymykset

| ID | Kysymys | Vastuu | Tila |
| --- | --- | --- | --- |
| T-01 | Mikä migraatiotyökalu otetaan käyttöön? | Projektiryhmä | Avoin |
| T-02 | Miten TMDB-pyynnöt välimuistitetaan ja rajataan? | Projektiryhmä | Avoin |
| T-03 | Mistä näytösaikatiedot saadaan ja millä lisenssillä (Q-04)? | Projektiryhmä | Avoin |
| T-04 | Mikä sähköpostipalvelu valitaan salasanan palautukseen? | Projektiryhmä | Avoin |
| T-05 | Sallitaanko useampi arvostelu samasta elokuvasta (Q-02)? | Asiakas | Avoin |
| T-06 | Toteutetaanko ryhmächat MVP:ssä (Q-03)? | Asiakas | Avoin |
| T-07 | Mikä on suosituksen algoritmi ja monipuolisuuden mittari? | Projektiryhmä | Avoin |
| T-08 | Mikä on arvostelun enimmäispituus ja tiivistysraja (Q-01)? | Projektiryhmä | Avoin |
| T-09 | Miten 2FA palautuskoodit toteutetaan? | Projektiryhmä | Avoin |
| T-10 | Mitä seurantaa ja lokitusta tuotantoon otetaan? | Projektiryhmä | Avoin |

---

## 14. Versiohistoria

| Versio | Päivä | Muutos |
| --- | --- | --- |
| 0.1 | 11.11.2026 | Alustava tekninen määrittely vaatimusmäärittelyn ja nykyisen toteutuksen pohjalta |
