# Backend - GymTrack

Python Flask web servis s PonyORM i SQLite bazom.

## Pokretanje (bez Dockera)

```bash
pip install -r requirements.txt
python app.py
```

Servis radi na `http://localhost:5000`.

## Datoteke

Svaki CRUD modul je u zasebnoj datoteci (kao na vjezbama):

- `add_*` - CREATE
- `get_*` - READ
- `update_*` - UPDATE
- `delete_*` - DELETE

`get_statistike.py` racuna podatke za Chart.js grafikone na frontendu.

## Baza

SQLite datoteka: `database.sqlite`

Kreira se automatski pri prvom pokretanju

## Docker

Backend image se gradi iz `dockerfile`. U `docker-compose.yml` mapiran je port 5000.