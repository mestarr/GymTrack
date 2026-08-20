import os
from datetime import date, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from pony.orm import db_session

from model import db, Clan, Trening, PAKETI, VRSTE_VJEZBI
from add_clan import add_clan
from get_clan import get_all_clanovi, get_clan_by_id
from update_clan import update_clan
from delete_clan import delete_clan
from add_trening import add_trening
from get_trening import get_treninzi, get_treninzi_clan
from update_trening import update_trening
from delete_trening import delete_trening
from get_statistike import get_statistike

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "database.sqlite")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
db.bind(provider="sqlite", filename=DB_PATH, create_db=True)
db.generate_mapping(create_tables=True)


def seed_test_podaci():
    """Doda par clanova i treninga ako je baza prazna - za testiranje."""
    with db_session:
        if Clan.select().count() > 0:
            return

        c1 = Clan(
            ime="Marko",
            prezime="Horvat",
            email="marko.horvat@gmail.com",
            datum_upisa=date(2025, 1, 10),
            paket="Premium",
            aktivan=True,
        )
        c2 = Clan(
            ime="Ana",
            prezime="Kovac",
            email="ana.kovac@gmail.com",
            datum_upisa=date(2025, 3, 5),
            paket="Standard",
            aktivan=True,
        )
        c3 = Clan(
            ime="Ivan",
            prezime="Babic",
            email="ivan.babic@gmail.com",
            datum_upisa=date(2024, 11, 20),
            paket="Basic",
            aktivan=False,
        )

        danas = date.today()
        podaci = [
            (c1, danas - timedelta(days=14), "Bench press", 60, 8, 45),
            (c1, danas - timedelta(days=7), "Squat", 80, 6, 50),
            (c1, danas - timedelta(days=1), "Deadlift", 100, 5, 55),
            (c2, danas - timedelta(days=10), "Cardio", 0, 0, 30),
            (c2, danas - timedelta(days=3), "OHP", 35, 10, 40),
            (c3, danas - timedelta(days=20), "Bench press", 50, 10, 40),
        ]

        for clan, datum, vrsta, tezina, pon, trajanje in podaci:
            Trening(
                datum=datum,
                vrsta_vjezbe=vrsta,
                tezina=tezina,
                ponavljanja=pon,
                trajanje_min=trajanje,
                clan=clan,
            )


seed_test_podaci()


def respond(result):
    if isinstance(result, tuple):
        data, status = result
        return jsonify(data), status
    return jsonify(result)


@app.route("/")
def home():
    return jsonify({"poruka": "GymTrack backend radi."})


@app.route("/opcije", methods=["GET"])
def opcije():
    return jsonify({"paketi": PAKETI, "vrste_vjezbi": VRSTE_VJEZBI})


# --- CLAN rute ---

@app.route("/clan", methods=["POST"])
def ruta_add_clan():
    return respond(add_clan(request.json or {}))


@app.route("/clanovi", methods=["GET"])
def ruta_get_clanovi():
    return respond(get_all_clanovi())


@app.route("/clan/<int:clan_id>", methods=["GET"])
def ruta_get_clan(clan_id):
    return respond(get_clan_by_id(clan_id))


@app.route("/clan/<int:clan_id>", methods=["PATCH"])
def ruta_update_clan(clan_id):
    return respond(update_clan(clan_id, request.json or {}))


@app.route("/clan/<int:clan_id>", methods=["DELETE"])
def ruta_delete_clan(clan_id):
    return respond(delete_clan(clan_id))


# --- TRENING rute ---

@app.route("/trening", methods=["POST"])
def ruta_add_trening():
    return respond(add_trening(request.json or {}))


@app.route("/treningi", methods=["GET"])
def ruta_get_treninzi():
    filters = {
        "clan_id": request.args.get("clan_id"),
        "vrsta_vjezbe": request.args.get("vrsta_vjezbe"),
        "datum_od": request.args.get("datum_od"),
        "datum_do": request.args.get("datum_do"),
    }
    return respond(get_treninzi(filters))


@app.route("/treningi/clan/<int:clan_id>", methods=["GET"])
def ruta_get_treninzi_clan(clan_id):
    return respond(get_treninzi_clan(clan_id))


@app.route("/trening/<int:trening_id>", methods=["PATCH"])
def ruta_update_trening(trening_id):
    return respond(update_trening(trening_id, request.json or {}))


@app.route("/trening/<int:trening_id>", methods=["DELETE"])
def ruta_delete_trening(trening_id):
    return respond(delete_trening(trening_id))


@app.route("/statistike", methods=["GET"])
def ruta_statistike():
    clan_id = request.args.get("clan_id")
    return respond(get_statistike(clan_id))


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=5000, debug=debug)
