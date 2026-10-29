# Vaatimusmäärittely: Elokuvaharrastajien yhteisöpalvelu

**Versio:** 0.1 (luonnos asiakastapaamista varten)  
**Päivämäärä:** 29.10.2026  
**Laatija:** Projektiryhmä SG 8  
**Tila:** Luonnos, perustuu asiakkaan kertomukseen 28.10 ja 29.10. QA -Tilaisuuteen. Ei vielä hyväksytty.

## 1. Tausta ja tavoite

Asiakas on elokuvaharrastajien porukka. Elokuvista keskustellaan ja suosituksia jaetaan nykyisin WhatsApp-ryhmissä, mutta se ei toimi hyvin:

- Elokuvia on tarjolla paljon (suoratoistopalvelut, teatterit), mutta hyviä elokuvia on vähän ja suositukset unohtuvat.
- Kuukausia vanhoja suosituksia ja reaktioita on vaikea hakea WhatsApp-viesteistä.
- Excel-taulukot ja vastaavat on kokeiltu, mutta niitä ei jakseta ylläpitää.
- Harrastajat asuvat eri paikkakunnilla ja heillä on perheet ja vähän aikaa, joten yhteinen elokuvaharrastus tarvitsee helpon verkkotyökalun.

**Tuote:** Verkkopalvelu elokuvaharrastajille ja heidän porukoilleen (kaveriporukat, kerhot). Palvelussa löydetään elokuvia, keskustellaan niistä ja tallennetaan suosikit.

**Tavoite:** Käyttäjä löytää helposti uutta katsottavaa, voi perustaa ryhmän tai liittyä siihen, arvostella elokuvia ja koota toive- ja suosikkilistoja. Palvelun arvo on henkilökohtaisuudessa: kaverin neljä tähteä painaa enemmän kuin tuhannen tuntemattoman arvio.

**Rajaus tuotteen luonteesta:**

- Palvelu **ei ole suoratoistopalvelu** eikä siinä esitetä elokuvia (ei esitysoikeuksia).
- Palvelu **ei ole IMDb- tai Letterboxd-kopio**. Painopiste on yhteisöllisyydessä, ei yleisessä arvostelutietokannassa.
- Palvelu on käyttäjille ilmainen. Maksullisia lisäpalveluita (esim. kerhoille, yhteistyö teattereiden kanssa) voidaan harkita myöhemmin, jos mukaan saadaan isompia tahoja.
- Käyttö on selainpohjaista, palvelun pitää toimia hyvin puhelimella.
- Palvelun on tarkoitus kasvaa orgaanisesti: yksi perustaa ryhmän, muut liittyvät ja tieto leviää suusta suuhun. Palvelu otetaan käyttöön siten, että asiakkaan oma porukka voi alkaa testata sitä heti.

**Onnistumisen mittarit (ehdotus, sovittava asiakkaan kanssa):**

- Asiakkaan oma testiporukka ottaa palvelun käyttöön ja pystyy tekemään ryhmän, lisäämään elokuvia ja arvosteluja ilman ohjeistusta.
- Elokuvan voi löytää haulla alle sekunnissa (ks. NFR-01).
- Seuraava asiakastapaaminen (palaveri) 30.10.2026.

## 2. Käyttäjät ja roolit

| Rooli                       | Tarve                                                             | Oikeudet                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Vierailija (ei kirjautunut) | Tutustua palveluun ja löytää elokuvia ilman rekisteröitymispakkoa | Selata ja hakea elokuvia, lukea julkisia arvosteluja, avata jaettuja listalinkkejä, nähdä julkiset ryhmät                           |
| Rekisteröitynyt käyttäjä    | Arvostella elokuvia, koota listoja ja osallistua ryhmiin          | Vierailijan oikeuksien lisäksi arvostella, hallita omia listoja ja profiilia, luoda ryhmiä, pyytää liittymistä ryhmiin              |
| Ryhmän jäsen                | Jakaa elokuvia ja arvosteluja oman porukan kanssa                 | Rekisteröityneen käyttäjän oikeuksien lisäksi lisätä elokuvia ryhmän sivulle ja nähdä ryhmän sisältö                                |
| Ryhmän ylläpitäjä           | Hallita omaa ryhmäänsä                                            | Jäsenen oikeuksien lisäksi hyväksyä jäseniä, poistaa jäseniä, muokata ryhmän tietoja, nimetä lisää ylläpitäjiä ja siirtää oikeuksia |
| Sivuston ylläpitäjä (admin) | Valvoa koko palvelua                                              | Laajuus sovitaan myöhemmin. Ei kuulu ensimmäiseen versioon.                                                                         |

**Huomioita:**

- Rekisteröitymiseen tarvitaan vain nimimerkki, sähköposti ja salasana. Muita henkilötietoja ei tässä vaiheessa kerätä.
- Arvosteluissa näytetään käyttäjän valitsema nimimerkki, ei oikeaa nimeä.
- Ryhmän ylläpitäjä -rooli koskee vain omaa ryhmää. Koko sivuston laajuinen ylläpitäjä on myöhempi jatkokehitysidea.
- Käyttäjälle ei toteuteta erillistä kaverilistaa. Ryhmät ja yhteisöt toimivat sosiaalisena rakenteena.

## 3. Käyttötilanteet

**Käyttötilanne A: uusi käyttäjä tutustuu**

1. Vierailija avaa palvelun ja näkee etusivulla ajankohtaisia elokuvia. Rekisteröitymistä tai kirjautumisikkunaa ei pakoteta.
2. Hän hakee elokuvaa, esimerkiksi suodattamalla 1980-luvun toimintaelokuvat.
3. Hän avaa elokuvan sivun, näkee julisteen, kuvauksen, perustiedot ja mahdollisen trailerin sekä lukee julkisia arvosteluja.

**Käyttötilanne B: porukka aloittaa**

1. Käyttäjä rekisteröityy (nimimerkki, sähköposti, salasana) ja luo ryhmän _Perjantain elokuvakerho_.
2. Ystävät löytävät ryhmän ja lähettävät liittymispyynnön. Ylläpitäjä hyväksyy heidät.
3. Jäsen lisää elokuvan ryhmän sivulle ja antaa sille neljä tähteä sekä lyhyen kommentin.
4. Toinen jäsen näkee arvostelun nimimerkillä ja ajankohdalla varustettuna.

**Käyttötilanne C: lista kaverille**

1. Käyttäjä lisää elokuvia toivelistalleen ja suosikkilistalleen.
2. Hän jakaa suosikkilistan linkkinä kaverille.
3. Kaveri avaa linkin ilman käyttäjätiliä ja näkee listan.

## 4. Toiminnalliset vaatimukset

Jokaisella vaatimuksella on yksilöllinen tunniste. Prioriteetit:

- **Must** = välttämätön ensimmäisen käyttökelpoisen version (MVP) kannalta.
- **Should** = tärkeä, mutta voidaan lykätä MVP:n jälkeen.
- **Could** = mahdollinen lisäominaisuus, ei korkea prioriteetti.

Asiakkaan ja tiimin yhteisesti sovittavat Must-vaatimukset ovat MVP:n sisältö.

### 4.1 Elokuvien selaus ja haku

| ID    | Vaatimus                                                                                                                                                        | Prioriteetti |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-01 | Etusivulla näytetään ajankohtaisia elokuvia. Käyttäjä pääsee selaamaan elokuvia heti ilman rekisteröitymispakkoa tai kirjautumisikkunaa.                        | Must         |
| FR-02 | Elokuvia voi hakea nimellä. Haku löytää elokuvan, vaikka nimeä ei kirjoittaisi täysin oikein.                                                                   | Must         |
| FR-03 | Elokuvia voi hakea näyttelijän nimellä.                                                                                                                         | Must         |
| FR-04 | Elokuvia voi suodattaa genren mukaan.                                                                                                                           | Must         |
| FR-05 | Suodattimia voi yhdistää, esimerkiksi vuosikymmen ja genre ("kasari action"), jotta käyttäjä löytää uutta myös tuntemansa ulkopuolelta.                         | Should       |
| FR-06 | Elokuvan sivulla näytetään juliste, kuvaus ja perustiedot (nimi, julkaisuvuosi, kesto, ohjaaja, näyttelijät, genre, ikäraja) kuten esim. Finkinon sivuilla.     | Must         |
| FR-07 | Elokuvatiedot haetaan TMDB tietokannasta. Palvelu ei rakenna omaa elokuvatietokantaa.                                                                           | Must         |
| FR-08 | Elokuvan sivulla näytetään traileri, jos sellainen on saatavilla.                                                                                               | Could        |
| FR-09 | Elokuvan sivulla ja haun yhteydessä ehdotetaan samankaltaisia elokuvia, jotta palvelu auttaa löytämään uutta katsottavaa.                                       | Should       |
| FR-10 | Elokuvan sivulla näytetään teatterinäytösajat rajatuilla paikkakunnilla (aluksi esim. Oulu, Tampere, Helsinki), jos tiedot ovat saatavilla kohtuullisin ehdoin. | Should       |
| FR-11 | Näytösaikatuki laajennetaan useammalle paikkakunnalle (tavoitteena koko Suomi, myös pienemmät paikkakunnat).                                                    | Could        |
| FR-12 | Näytösajoissa voi suodattaa teatterin ominaisuuden mukaan (esim. IMAX).                                                                                         | Could        |

### 4.2 Käyttäjätili

| ID    | Vaatimus                                                                                                                           | Prioriteetti |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-13 | Käyttäjä voi rekisteröityä antamalla nimimerkin, sähköpostiosoitteen ja salasanan.                                                 | Must         |
| FR-14 | Käyttäjä voi kirjautua sisään ja ulos.                                                                                             | Must         |
| FR-15 | Käyttäjä voi palauttaa unohtuneen salasanan sähköpostitse (esim. palautuslinkki tai -koodi).                                       | Must         |
| FR-16 | Käyttäjä voi poistaa oman käyttäjätilinsä. Tilin poistaminen poistaa myös käyttäjän arvostelut ja muut hänen tallentamansa tiedot. | Must         |
| FR-17 | Käyttäjä voi muokata profiiliaan ja vaihtaa salasanansa. Nimimerkkiä ei voi vaihtaa. Muita henkilötietoja ei tallenneta.           | Should       |
| FR-18 | Käyttäjä voi ottaa käyttöön kaksivaiheisen tunnistautumisen (authenticator-sovellus).                                              | Should       |
| FR-19 | Profiiliin voi liittää tunnisteita, kuten lempigenren. Toimintatapa ja käyttö suosituksissa on vielä suunnittelematta.             | Could        |

### 4.3 Ryhmät

| ID    | Vaatimus                                                                                                                       | Prioriteetti |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| FR-20 | Rekisteröitynyt käyttäjä voi luoda ryhmän ja nimetä sen. Luoja on ryhmän ylläpitäjä.                                           | Must         |
| FR-21 | Ryhmään ei pääse kuka tahansa. Käyttäjä lähettää liittymispyynnön ryhmän sivulla ja ryhmän ylläpitäjä hyväksyy tai hylkää sen. | Must         |
| FR-22 | Ryhmän ylläpitäjä voi valita, onko ryhmä julkinen (näkyy palvelussa) vai yksityinen.                                           | Should       |
| FR-23 | Julkiset ryhmät ovat löydettävissä palvelun kautta, jotta käyttäjä voi löytää uusia porukoita.                                 | Should       |
| FR-24 | Ryhmä voidaan asettaa kaikille avoimeksi, jolloin liittyminen ei vaadi hyväksyntää.                                            | Could        |
| FR-25 | Ryhmän ylläpitäjä voi kutsua käyttäjiä kutsulinkillä.                                                                          | Could        |
| FR-26 | Jäsen voi poistua ryhmästä.                                                                                                    | Must         |
| FR-27 | Ryhmän ylläpitäjä voi poistaa jäseniä ryhmästä.                                                                                | Must         |
| FR-28 | Ryhmällä voi olla useita ylläpitäjiä ja ylläpitäjän oikeuksia voi siirtää.                                                     | Should       |
| FR-29 | Ryhmän sivulla on ryhmän omat elokuvat, joita ryhmän jäsenet voivat lisätä.                                                    | Must         |
| FR-30 | Ryhmän sivulla näkyy jäsenten määrä.                                                                                           | Should       |
| FR-31 | Samassa ryhmässä olevat jäsenet näkevät toistensa muita ryhmiä vain, jos ne ovat julkisia. Yksityiset ryhmät eivät näy.        | Could        |
| FR-32 | Ryhmällä on oma keskustelu (chat), jolla WhatsApp-ryhmän keskustelu voidaan korvata.                                           | Should       |

### 4.4 Arvostelut

| ID    | Vaatimus                                                                                                                             | Prioriteetti |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| FR-33 | Arvostelun tekeminen vaatii kirjautumisen. Anonyymejä arvosteluja ei ole.                                                            | Must         |
| FR-34 | Käyttäjä voi antaa elokuvalle tähtiarvosanan 1–5. Tähdet voi antaa ilman kirjallista arvostelua.                                     | Must         |
| FR-35 | Tähtien lisäksi käyttäjä voi kirjoittaa lyhyen vapaan kommentin.                                                                     | Must         |
| FR-36 | Arvostelussa näytetään kirjoittajan nimimerkki (ei oikeaa nimeä) ja arvostelun tekoajankohta.                                        | Must         |
| FR-37 | Julkisia arvosteluja voi lukea ilman kirjautumista.                                                                                  | Must         |
| FR-38 | Arvostelun kirjoittaja valitsee arvostelun näkyvyyden: vain ryhmälle tai julkinen.                                                   | Must         |
| FR-39 | Käyttäjä voi muokata ja poistaa omia arvostelujaan. Alkuperäinen ajankohta säilyy ja muokkaus merkitään.                             | Should       |
| FR-40 | Pitkät arvostelut tiivistetään listanäkymässä ja loppuosa avataan "Lue lisää" -painikkeella. Sopiva pituus selvitetään kokeilemalla. | Should       |
| FR-41 | Sama käyttäjä voi arvioida saman elokuvan useita kertoja (esim. uudelleenkatselu). Ratkaisu tarkentuu avoimessa kysymyksessä Q-02.   | Could        |
| FR-42 | Käyttäjä voi lisätä toisen henkilön suosikikseen, jolloin tämän arvostelut näkyvät käyttäjälle aina listan kärjessä.                 | Could        |

### 4.5 Listat

| ID    | Vaatimus                                                                                     | Prioriteetti |
| ----- | -------------------------------------------------------------------------------------------- | ------------ |
| FR-43 | Käyttäjällä on toivelista: elokuvat, jotka hän haluaa katsoa ja joita ei ole vielä katsottu. | Must         |
| FR-44 | Käyttäjällä on suosikkilista: elokuvat, jotka hän on katsonut ja joita hän suosittelee.      | Must         |
| FR-45 | Käyttäjä voi jakaa listansa linkkinä. Linkin avaaminen ei vaadi käyttäjätiliä.               | Should       |
| FR-46 | Lista voi olla piilotettu, jolloin se on nähtävissä vain linkin kautta.                      | Could        |

### 4.6 Suositukset

| ID    | Vaatimus                                                                                                                                                                            | Prioriteetti |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-47 | Palvelu ehdottaa elokuvia käyttäjän historian perusteella. Suositukset eivät jumitu yhteen tyyliin (esim. pelkkiä Stallone-elokuvia katsova saa ehdotuksia myös muista elokuvista). | Could        |
| FR-48 | Käyttäjä voi poistaa ehdotuksen omasta suosituslistastaan.                                                                                                                          | Could        |

### 4.7 Ylläpito ja data

| ID    | Vaatimus                                                                                                                    | Prioriteetti |
| ----- | --------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-49 | Sivuston ylläpitäjä (admin) -käyttäjä, jolla on koko palvelun laajuiset oikeudet. Roolit ja laajuus sovitaan myöhemmin.     | Could        |
| FR-50 | Palvelu voi koostaa tilastoa siitä, mistä elokuvista käyttäjät pitävät. Yksittäisiä henkilötietoja ei myydä eikä luovuteta. | Could        |

### 4.8 Tarkemmat hyväksymiskriteerit: FR-21 (liittymispyyntö)

- **Tilanne:** kirjautunut käyttäjä, joka ei kuulu ryhmään. **Kun:** hän painaa ryhmän sivulla _Pyydä liittymistä_. **Niin:** pyyntö tallentuu ja ryhmän ylläpitäjä näkee sen.
- **Kun:** ylläpitäjä hyväksyy pyynnön. **Niin:** käyttäjästä tulee ryhmän jäsen ja hän näkee ryhmän sisällön.
- **Kun:** ylläpitäjä hylkää pyynnön. **Niin:** käyttäjä ei näe ryhmän yksityistä sisältöä.
- **Kun:** ryhmään kuulumaton käyttäjä yrittää avata ryhmän sisällön suoralla osoitteella. **Niin:** sovellus estää pääsyn.

### 4.9 Tarkemmat hyväksymiskriteerit: FR-33–FR-38 (arvostelu)

- Kirjautumaton käyttäjä ei voi tallentaa arvostelua, mutta voi lukea julkisia arvosteluja.
- Käyttäjä voi tallentaa pelkän tähtiarvosanan ilman tekstiä.
- Tallennetussa arvostelussa näkyvät nimimerkki, tähdet, mahdollinen teksti ja tekoajankohta.
- Arvostelun näkyvyydeksi valittu _ryhmä_ ei näy ryhmän ulkopuolisille eikä julkisessa arvostelulistassa.
- Arvostelun muokkaaminen säilyttää alkuperäisen ajankohdan ja merkitsee arvostelun muokatuksi.

### 4.10 Tarkemmat hyväksymiskriteerit: FR-44 (listan jakaminen)

- Käyttäjä voi kopioida listalle linkin.
- Linkin avaava kirjautumaton henkilö näkee listan elokuvat, mutta ei voi muokata listaa.
- Käyttäjä voi poistaa jakamisen, jolloin vanha linkki lakkaa toimimasta.

## 5. Ei-toiminnalliset vaatimukset

Numeeriset rajat ovat **tavoitteita**, jotka sovitaan asiakkaan kanssa ja testataan.

| ID     | Vaatimus                                                                                                                                                                          | Prioriteetti | Todentaminen                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------ |
| NFR-01 | Palvelu on nopea. Haku ja sivujen avautuminen kestävät tavoitteena alle 1 sekunnin tavallisessa käytössä.                                                                         | Must         | Suorituskykytesti                    |
| NFR-02 | Palvelu toimii selaimella sekä tietokoneella että puhelimella (360–430 pikselin levyinen näyttö) ilman vaakasuuntaista vieritystä.                                                | Must         | Käyttöliittymätesti                  |
| NFR-03 | Ulkoasu on asiallinen, nykyaikainen ja luotettavan oloinen, eli näyttää "oikealta" palvelulta. Käyttöliittymäsuunnitelmaa ei vielä ole, joten tiimi tekee luonnoksen asiakkaalle. | Must         | Asiakkaan hyväksyntä                 |
| NFR-04 | Salasanat tallennetaan vain turvallisella yksisuuntaisella salasanatiivisteellä.                                                                                                  | Must         | Toteutuksen ja tietokannan tarkistus |
| NFR-05 | Käyttäjä ei voi hakea tai muuttaa toisen käyttäjän tietoja eikä nähdä ryhmän yksityistä sisältöä ilman roolinsa mukaista oikeutta.                                                | Must         | API:n käyttöoikeustestit             |
| NFR-06 | Palvelua käytetään tuotantoympäristössä HTTPS-yhteydellä.                                                                                                                         | Must         | Julkaistun osoitteen tarkistus       |
| NFR-07 | Tietoja kerätään vain tarpeellinen vähimmäismäärä (nimimerkki, sähköposti). Yksittäisiä henkilötietoja ei myydä.                                                                  | Must         | Tietomallin ja toteutuksen katselmus |
| NFR-08 | Ennen todellisten käyttäjien käyttöönottoa palvelussa on käyttöehdot ja tietosuojaseloste. Asiakas ei tunne vaatimuksia, joten tiimi selvittää tarpeet.                           | Must         | Dokumentin ja palvelun tarkistus     |
| NFR-09 | Ulkoisten tietolähteiden (esim. TMDB, näytösaikatiedot) lisenssiehtoja ja mainintavaatimuksia noudatetaan.                                                                        | Must         | Lisenssiehtojen tarkistus            |
| NFR-10 | Palvelun kieli on aluksi suomi. Tekstit toteutetaan niin, että englanti ja ruotsi voidaan lisätä myöhemmin.                                                                       | Should       | Toteutuksen katselmus                |
| NFR-11 | Elokuvatietojen hakeminen on eriytetty omaan rajapintakerrokseen, jotta tietolähteen voi tarvittaessa vaihtaa.                                                                    | Should       | Toteutuksen katselmus                |
| NFR-12 | Kaksivaiheinen tunnistautuminen (ks. FR-18) tukee yleisiä authenticator-sovelluksia.                                                                                              | Should       | Toiminnallinen testi                 |

## 6. Tiedot ja alustava tietomalli

Sovellus tallentaa vähintään seuraavat tiedot:

- **Käyttäjä:** tunniste, nimimerkki, sähköposti, salasanatiiviste, mahdollinen 2FA-asetus ja luontiaika.
- **Elokuva:** vain ulkoisen lähteen (esim. TMDB) tunniste. Elokuvan tiedot haetaan lähteestä tarvittaessa.
- **Ryhmä:** tunniste, nimi, näkyvyys (julkinen/yksityinen/avoin) ja luontiaika.
- **Ryhmän jäsenyys:** käyttäjä, ryhmä, rooli (jäsen/ylläpitäjä) ja tila (pyyntö/hyväksytty).
- **Ryhmän elokuva:** ryhmä, elokuva, lisääjä ja lisäysaika.
- **Arvostelu:** käyttäjä, elokuva, tähdet (1–5), teksti (valinnainen), näkyvyys (ryhmä/julkinen), tekoaika ja muokkausaika.
- **Lista:** omistaja, tyyppi (toive/suosikki), jakolinkki ja sen tila sekä listan elokuvat.

Tarkempi ER-kaavio tehdään erilliseen tietokantasuunnitelmaan. Käyttäjän poistaminen poistaa myös hänen arvostelunsa ja listansa (FR-16).

## 7. Projektin rajaus

**Ensimmäiseen julkaisuun (MVP) sisältyvät kaikki Must-vaatimukset:** elokuvien selaus ja haku ilman rekisteröitymistä, elokuvan tiedot ulkoisesta lähteestä, rekisteröityminen ja kirjautuminen (myös salasanan palautus ja tilin poisto), ryhmien luonti ja hallinta (liittymispyyntö, jäsenten poisto, ryhmän elokuvat), tähtiarvostelut ja lyhyet kommentit näkyvyysvalinnalla sekä toive- ja suosikkilista. Palvelun toimivuus puhelimella ja julkaisu Azureen kuuluvat valmiin tuotteen vaatimuksiin.

**MVP:n jälkeen (Should), tärkeysjärjestyksessä kun työmäärä tarkentuu:** ryhmäkeskustelu, näytösajat (Oulu, Tampere, Helsinki), samankaltaisten elokuvien ehdotukset, traileri, suodattimien yhdistäminen, listojen jakaminen linkillä, kaksivaiheinen tunnistautuminen, julkiset ryhmät ja ryhmähaku, useat ylläpitäjät, arvostelujen muokkaus ja tiivistys sekä profiilin muokkaus.

**Mahdolliset lisäominaisuudet (Could):** suositukset katseluhistorian perusteella, laajempi paikkakuntakattavuus, teatterisuodattimet, avoimet ryhmät, kutsulinkit, piilotetut listat, profiilitunnisteet, sivuston ylläpitäjä sekä aggregoitu tilastointi.

**Ei toteuteta (asiakkaan rajaus):**

- Suoratoisto tai elokuvien esittäminen.
- Arvostelujen tuonti tai näyttäminen muilta alustoilta (IMDb, Letterboxd tms.), ainakaan alkuun.
- Tykkäystoiminto arvosteluille.
- Käyttäjän oma analytiikkanäkymä.
- Erillinen kaverilista ryhmien ulkopuolella.
- Elokuvien lisääminen käyttäjän toimesta, jos niitä ei löydy ulkoisesta tietolähteestä (tweet-tyyppinen arvostelu).
- Maksulliset ominaisuudet ja yhteistyö teattereiden kanssa.
- Mobiilisovellus sovelluskauppaan.

Rajaus ja Must-prioriteetit hyväksytetään asiakkaalla. Niitä voidaan muuttaa, kun toteutuksen työmäärä tarkentuu.

## 8. Toteutusjärjestys ja alustava viikkosuunnitelma

Tämä on **alustava suunnitelma**, ei asiakkaan hyväksymä aikataulu. Ensimmäinen arvo syntyy, kun elokuvia voi selata ja hakea. Tekniset riippuvuudet, kuten tunnistautuminen, toteutetaan hallitusti tämän ympärille.

| Viikko | Tavoite ja näytettävä tulos                                                                                                   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 1      | Vaatimukset, tietokantasuunnitelma, käyttöliittymäluonnos, backlog ja ensimmäinen Azure-julkaisu hyväksyttyyn pohjaan         |
| 2      | Julkaistussa sovelluksessa näkyy etusivun elokuvalista ja elokuvan sivu TMDB:n tiedoilla (FR-01, FR-06, FR-07)                |
| 3      | Haku ja suodattimet: nimi, näyttelijä, genre (FR-02–FR-04)                                                                    |
| 4      | Rekisteröityminen, kirjautuminen ja salasanan palautus (FR-13–FR-15)                                                          |
| 5      | Arvostelut ja toive- ja suosikkilistat (FR-33–FR-38, FR-42, FR-43)                                                            |
| 6      | Ryhmät: luonti, liittymispyyntö, jäsenhallinta ja ryhmän elokuvat (FR-20, FR-21, FR-26, FR-27, FR-29)                         |
| 7      | Mobiilikäyttö, tilin poisto, virhetilanteet, testit, tietosuoja- ja käyttöehtotekstit sekä Should-vaatimuksia valinnan mukaan |
| 8      | Viimeistely, dokumentit, tuotantoversion vakauttaminen ja loppuesitys toimivasta julkaistusta sovelluksesta                   |

**Huom.** Varhaisissa demoissa voidaan käyttää rajattua testikäyttäjää tai testitunnistusta. Oikeat käyttöoikeudet ja turvallisuusvaatimukset on toteutettava ennen todellisten käyttäjien käyttöönottoa. Asiakkaan testiporukat otetaan mukaan heti, kun ryhmätoiminnot ovat käytössä.

## 9. Asiakkaan linjaukset, avoimet kysymykset ja oletukset

### 9.1 Sovitut linjaukset (26.10. kysymys–vastaus)

| Aihe                         | Linjaus                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hinnoittelu                  | Palvelu on käyttäjille ilmainen. Maksua voidaan periä myöhemmin isommilta tahoilta.                       |
| Ryhmään liittyminen          | Liittymispyyntö ylläpitäjälle. Kaikille avoin vaihtoehto mahdollinen myöhemmin.                           |
| Tähdet ilman tekstiä         | Sallittu.                                                                                                 |
| Arvostelun aikaleima         | Säilyy kommentin yhteydessä.                                                                              |
| Arvostelujen muokkaus        | Hyvä ominaisuus. Sama elokuva voisi olla arvioitavissa useammin (tarkentuu).                              |
| Arvostelut muilta alustoilta | Ei alkuun.                                                                                                |
| Tykkäystoiminto              | Ei.                                                                                                       |
| Ryhmän ylläpito              | Useita ylläpitäjiä ja oikeuksien siirto sallitaan.                                                        |
| Käyttäjän poisto             | Sallitaan ja samalla poistetaan käyttäjän arvostelut.                                                     |
| Rekisteröitymistiedot        | Nimimerkki ja sähköposti. Muita tietoja ei alussa.                                                        |
| Profiili                     | Salasanaa voi vaihtaa, nimimerkkiä ei. Muita tietoja ei tallenneta.                                       |
| Salasanan palautus           | Toteutetaan.                                                                                              |
| Paikkakunnat (näytösajat)    | Aluksi rajattu määrä (Oulu, Tampere, Helsinki), lisää myöhemmin. Jos tietoja ei saa ilmaiseksi, lykätään. |
| Lisenssimaininnat            | Mainitaan, jos TMDB tai muu lähde sitä vaatii.                                                            |
| Ryhmien näkyvyys             | Jos ryhmä ei ole julkinen, se ei näy muillekaan jäsenten profiilien kautta.                               |
| Tietosuoja                   | Asiakas ei tiedä käytäntöjä. Ryhmä selvittää itse.                                                        |
| Suositukset                  | Ei korkea prioriteetti. Algoritmin ei pidä jumittua yhteen tyyliin.                                       |
| Ikäraja käyttäjille          | Ei välttämättä. Mietitään myöhemmin (erityisesti chatin osalta).                                          |

### 9.2 Avoimet kysymykset

| ID   | Kysymys / selvitettävä asia                                                                                                                    | Vastuu        | Tila  |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----- |
| Q-01 | Mikä on arvostelun enimmäispituus ja milloin tekstiä tiivistetään? Haittaako erittäin pitkä arvostelu? Selvitetään teknisesti ja kokeilemalla. | Projektiryhmä | Avoin |
| Q-02 | Voiko sama käyttäjä jättää useita arvosteluja samasta elokuvasta vai pelkästään muokata yhtä?                                                  | Asiakas       | Avoin |
| Q-03 | Kuuluuko ryhmäkeskustelu (chat) ensimmäiseen versioon? Se on yksi WhatsApp-korvauksen ydin, mutta työmäärä on suuri. Ikärajan tarve?           | Asiakas       | Avoin |
| Q-04 | Mistä näytösaikatiedot saadaan (esim. Finkino) ja onko käyttö ilmaista? Mitkä paikkakunnat ovat ensimmäisessä vaiheessa?                       | Projektiryhmä | Avoin |
| Q-05 | Saako muiden käyttäjien listoja arvostella tai jakaa edelleen?                                                                                 | Asiakas       | Avoin |
| Q-06 | Mitkä muut ryhmät jäsen voi nähdä samassa ryhmässä olevilta: vain julkiset vai jokin muu rajaus?                                               | Asiakas       | Avoin |
| Q-07 | Mitä tietosuojaselosteessa ja käyttöehdoissa on oltava? Tarvitaanko GDPR-toimia (esim. tietojen vienti käyttäjälle)?                           | Projektiryhmä | Avoin |
| Q-08 | Näytetäänkö elokuvan sivulla, missä suoratoistopalvelussa elokuva on katsottavissa?                                                            | Asiakas       | Avoin |
| Q-09 | Miten elokuvatietokannan kattavuus riittää? Mitä tehdään, jos elokuvaa ei löydy ja täytyisikö tietolähdettä vaihtaa?                           | Projektiryhmä | Avoin |
| Q-10 | Miten profiilin tunnisteet (lempigenre) ja katselutietoon perustuvat suositukset toimisivat?                                                   | Asiakas       | Avoin |
| Q-11 | Sovitaanko onnistumisen mittarit ja MVP:n sisältö (Must-vaatimukset) asiakastapaamisessa 30.10.?                                               | Koko tiimi    | Avoin |

**Oletukset, jotka pitää varmistaa:**

- Ensimmäinen versio toimii selaimella eikä erillistä mobiilisovellusta tehdä.
- Elokuvatiedot haetaan TMDB:stä ilman omaa elokuvatietokantaa.
- Käyttäjätiliä ei tarvita selaamiseen, hakuun eikä julkisten arvostelujen ja jaettujen listojen lukemiseen.
- Sähköpostiviestejä käytetään alussa vain salasanan palautukseen.
- Ryhmäkeskustelu ja näytösajat eivät ole MVP:n välttämätön osa ennen kuin asiakas toisin päättää (Q-03, Q-04).

## 10. Hyväksyntä ja muutosten hallinta

Vaatimusmäärittely käydään asiakkaan kanssa läpi **ennen varsinaisen toteutuksen etenemistä**. Hyväksynnässä tarkistetaan erityisesti tavoitteet, ensimmäisen version rajaus, Must-vaatimukset ja avoimet kysymykset.

| Kenttä                 | Arvo                      |
| ---------------------- | ------------------------- |
| Asiakkaan edustaja     | _________________________ |
| Hyväksytty versio      | _________________________ |
| Hyväksynnän päivämäärä | _________________________ |
| Mahdolliset ehdot      | _________________________ |

Muutokset kirjataan dokumentin versiohistoriaan ja GitHubin backlogiin. Asiakas ja tiimi arvioivat yhdessä niiden vaikutuksen aikatauluun ja prioriteetteihin.

## 11. Versiohistoria

| Versio | Päivä      | Muutos                      |
| ------ | ---------- | --------------------------- |
| 0.1    | 29.10.2026 | Alustava vaatimusmäärittely |
