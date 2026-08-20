from datetime import datetime

from pony.orm import db_session

from model import Clan, Trening, VRSTE_VJEZBI


def add_trening(data):
    with db_session:
        clan_id = data.get("clan_id")
        if not clan_id:
            return {"error": "clan_id je obavezan."}, 400

        clan = Clan.get(id=int(clan_id))
        if not clan:
            return {"error": "Clan nije pronaden."}, 404

        if not clan.aktivan:
            return {"error": "Neaktivan clan ne moze dobiti novi trening."}, 400

        vrsta = data.get("vrsta_vjezbe", "").strip()
        if vrsta not in VRSTE_VJEZBI:
            return {"error": "Vrsta vjezbe nije validna."}, 400

        datum_str = data.get("datum")
        if not datum_str:
            return {"error": "Datum je obavezan."}, 400

        try:
            tezina = float(data.get("tezina", 0))
            ponavljanja = int(data.get("ponavljanja", 0))
            trajanje = int(data.get("trajanje_min", 0))
        except (TypeError, ValueError):
            return {"error": "Tezina, ponavljanja i trajanje moraju biti brojevi."}, 400

        if tezina < 0 or ponavljanja < 0 or trajanje < 0:
            return {"error": "Vrijednosti ne smiju biti negativne."}, 400

        trening = Trening(
            datum=datetime.strptime(datum_str, "%Y-%m-%d").date(),
            vrsta_vjezbe=vrsta,
            tezina=tezina,
            ponavljanja=ponavljanja,
            trajanje_min=trajanje,
            clan=clan,
        )

        return {"message": "Trening dodan.", "id": trening.id}, 201
