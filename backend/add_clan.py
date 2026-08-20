from datetime import datetime

from pony.orm import db_session

from model import Clan, PAKETI


def add_clan(data):
    with db_session:
        ime = data.get("ime", "").strip()
        prezime = data.get("prezime", "").strip()
        email = data.get("email", "").strip()
        paket = data.get("paket", "Basic")
        aktivan = data.get("aktivan", True)

        if not ime or not prezime or not email:
            return {"error": "Ime, prezime i email su obavezni."}, 400

        if paket not in PAKETI:
            return {"error": "Paket nije validan."}, 400

        datum_str = data.get("datum_upisa")
        if datum_str:
            datum_upisa = datetime.strptime(datum_str, "%Y-%m-%d").date()
        else:
            datum_upisa = datetime.now().date()

        clan = Clan(
            ime=ime,
            prezime=prezime,
            email=email,
            datum_upisa=datum_upisa,
            paket=paket,
            aktivan=bool(aktivan),
        )

        return {"message": "Clan dodan.", "id": clan.id}, 201
