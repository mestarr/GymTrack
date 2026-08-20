# GymTrack

# Preddiplomski kolegij: Informacijski sustavi (IS)

<p>
  <a href="https://www.gnu.org/software/bash/" target="_blank">  <img src="https://img.shields.io/badge/Bash-4EAA25?logo=gnubash&logoColor=fff" />
  <a href="https://www.linux.org/" target="_blank">  <img src="https://img.shields.io/badge/Linux-FCC624?logo=linux&logoColor=black" />
  <a href="https://git-scm.com/" target="_blank">  <img src="https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff" />
  <a href="https://www.python.org/" target="_blank">  <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff" />
  <a href="https://flask.palletsprojects.com/" target="_blank">  <img src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=fff" />
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">  <img src="https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=fff" />
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank">  <img src="https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff" />
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000" />
  <a href="https://getbootstrap.com/" target="_blank">  <img src="https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=fff" />
  <a href="https://www.chartjs.org/" target="_blank">  <img src="https://img.shields.io/badge/Chart.js-FF6384?logo=chart.js&logoColor=fff" />
  <a href="https://www.sqlite.org/" target="_blank">  <img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=fff" />
  <a href="https://www.docker.com/" target="_blank">  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff" />
</p>
  
**Nositelj**: [Izv. prof. dr. sc. Darko Etinger](https://fipu.unipu.hr/fipu/darko.etinger)  
**Izvođač** [Lorena Jeger, mag. inf.](https://fipu.unipu.hr/fipu/lorena.jeger)  
**Asistent**: [Jelena Nikolić Ražem, mag. oec.](https://fipu.unipu.hr/fipu/jelena.nikolic_razem)

**Ustanova**: [Sveučilište Jurja Dobrile u Puli](https://www.unipu.hr/), [Fakultet informatike u Puli](https://fipu.unipu.hr/)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lukablaskovic/FIPU-WA/refs/heads/main/FIPU_UNIPU_white.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/lukablaskovic/FIPU-WA/refs/heads/main/FIPU_UNIPU.png">
  <img alt="Fakultet informatike u Puli (materijali iz kolegija Operacijski sustavi - Luka Blašković)" 
       src="https://raw.githubusercontent.com/lukablaskovic/FIPU-WA/refs/heads/main/FIPU_UNIPU_white.png" width="300">
</picture>


**GymTrack** je studentski projekt iz kolegija **Informacijski sustavi**.

- Autor: Stjepan Paun
- JMBAG: 0303126910
- Sveuciliste Jurja Dobrile u Puli
- Fakultet informatike u Puli

Aplikacija sluzi za upravljanje clanovima teretane i pracenje napretka treninga. 

Vlasnik teretane moze voditi evidenciju clanova, unositi treninge, filtrirati podatke i gledati statistike kroz grafikone.

---

## Opis projekta

GymTrack omogucuje da su svi podaci na jednom mjestu. Vlasnik Teretane moze dodati clana, urediti ga, zapisati trening kao sto su: tezina, ponavljanja i trajanje. Takoder moze filtrirati treninge po datumu i vrsti vjezbe te vidjeti osnovne statistike i grafikone.

Poslovni Rezultat je da vlasnik brze vidi tko trenira, koliko je posjeta bilo i kako napreduje tezina kroz vrijeme.

---

## Funkcionalnosti aplikacije

Aplikacija je podijeljena u 4 dijela (navigacija na vrhu):

- **Pocetna** - kratak pregled broja clanova, treninga i treninga.
- **Clanovi** - Create, Remove, Update i Delete operacije nad clanovima teretane.
- **Treningi** - dodavanje treninga i filtriranje.
- **Statistike** - brojke i grafikoni.

### CRUD - Clan

- dodavanje novog clana
- pregled svih clanova
- pregled detalja jednog clana
- Uredivanje podataka
- brisanje clana i treninga.

### CRUD - Trening

- dodavanje treninga za clana
- pregled treninga odabranog clana
- brisanje treninga
- pregled svih treninga s filterima

### Dodatne funkcionalnosti

- pretraga clanova po imenu ili prezimenu
- filtriranje treninga po datumuu i vrsti vjezbe
- paginacija filtriranih treninga (8 zapisa po stranici)
- automatski izracun statistika
- vizualizacija podataka u bar, line, pie chart-u.
- poruke nakon uspjesnih akcija kao sto su dodavanje, brisanje, filtriranje.

---

## Poslovna pravila

- ime, prezime i email su obavezni kod clana
- paket mora biti jedan od: Basic, Standard, Premium
- vrsta vjezbe mora biti s popisa  kao sto su: Bench press, Squat, Deadlift, OHP, Cardio ili Ostalo.
- tezina, ponavljanja i trajanje ne smiju biti negativni
- **neaktivan clan ne moze dobiti novi trening !!!!**
- brisanje clana brise i sve povezane treninge

---

## Use case dijagram

![Use case dijagram GymTrack](Use%20case%20dijagram%20GymTrack.png)

Use caseovi:

1. Pregledaj sve clanove
2. Dodaj novog clana
3. Uredi podatke clana
4. Dodaj trening za clana
5. Pregledaj treninge clana
6. Prikazi statistike i grafikone

---

## Potreben su bile koristene Tehnologije:

- Python
- Flask
- Pony ORM
- SQLite
- HTML
- CSS
- Bootstrap
- JavaScript (samo za dohvat podataka)
- Chart.js
- Docker

---

## Struktura projekta

```text
GymTrack/
├── backend/
├── frontend/
├── docker-compose.yml
├── GymTrack.png
├── .gitignore
└── README.md
```

### Backend

```text
app.py              - Flask aplikacija i rute
model.py            - entiteti Clan i Trening
add_clan.py         - CREATE clan
get_clan.py         - READ clan
update_clan.py      - UPDATE clan
delete_clan.py      - DELETE clan
add_trening.py      - CREATE trening
get_trening.py      - READ trening + filtri
update_trening.py   - UPDATE trening
delete_trening.py   - DELETE trening
get_statistike.py   - statistike za frontend
requirements.txt
dockerfile
database.sqlite     - kreira se pri pokretanju
```

Vise detalja u `backend/README.md`.

### Frontend

```text
index.html
style.css
fetchData.js        - API pozivi
displayData.js      - prikaz podataka, paginacija, poruke
pageHandling.js     - navigacija izmedju stranica
formHandling.js     - forme za clana i trening
filterHandling.js   - filtri
chartHandling.js    - Chart.js grafovi
Dockerfile
nginx.conf
```

Vise detalja u `frontend/README.md`.

---

## Entiteti baze

**Clan:** id, ime, prezime, email, datum_upisa, paket, aktivan

**Trening:** id, datum, vrsta_vjezbe, tezina, ponavljanja, trajanje_min, clan_id

---

## API rute


| Metoda | Ruta               | Opis                                               |
| ------ | ------------------ | -------------------------------------------------- |
| GET    | /opcije            | paketi i vrste vjezbi                              |
| GET    | /clanovi           | svi clanovi                                        |
| POST   | /clan              | novi clan                                          |
| GET    | /clan/:id          | jedan clan                                         |
| PATCH  | /clan/:id          | uredi clana                                        |
| DELETE | /clan/:id          | obrisi clana                                       |
| GET    | /treningi          | svi treningi (?datum_od, ?datum_do, ?vrsta_vjezbe) |
| POST   | /trening           | novi trening                                       |
| DELETE | /trening/:id       | obrisi trening                                     |
| GET    | /treningi/clan/:id | treningi clana                                     |
| GET    | /statistike        | statistike (?clan_id opcionalno)                   |


---

## Pokretanje aplikacije lokalno

### Pretpostavke

- Docker Desktop instaliran
- Git (opcionalno, za kloniranje)

### Koraci

1. Potrebano je preuzeti repozitorij  sa git clone ili download ZIP sa GitHub .
2. Otvori terminal u root mapi projekta.
3. Pokreni:

```bash
docker compose up --build
```

1. Onda je potrebano pričekati da se podignu kontejneri `backend` i `frontend`.
2. Nako sto su se kontejneri uspjesno startali potrebno je otvori preglednik:

```text
http://localhost
```

Backend API radi na:

```text
http://localhost:5000
```

### Lokalno bez Dockera !

Terminal 1:

```bash
cd backend
py -m pip install -r requirements.txt
py app.py
```

Terminal 2:

```bash
cd frontend
py -m http.server 8080
```

Otvori `http://localhost:8080` (frontend automatski koristi backend na portu 5000).

---

### Zaustavljanje Aplikacije:

```text
CTRL + C
```

ili

```bash
docker compose down
```

---

## Info o Dockeru

Projekt koristi dva kontejnera:

- **backend** - Flask na portu 5000
- **frontend** - nginx servira HTML/CSS/JS na portu 80

Frontend dohvaca podatke s backenda preko `/api/` (nginx proxy u Dockeru).
Backend API direktno: `http://localhost:5000`.

Pri prvom pokretanju baza je prazna pa se automatski dodaju test podaci (3  Tesna clana i 6 treninga). Baza se cuva u Docker volumenu `gymtrack-db` ne gubi se pri restartu sto je lakse za testiranje i pokretanje kod novih Dev.

---

## Zaključak

Moje je zakljucak da GymTrack Aplikacija povezuje poslovnu ideju s prakticnom izvedbom kao sto su WebServis, baza, Docker. 

Aplikacija je jednostavna za koristenje i pokriva sve use caseove iz dijagrama.
