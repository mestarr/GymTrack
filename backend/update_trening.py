from datetime import datetime

from pony.orm import db_session

from model import Trening, VRSTE_VJEZBI


def update_trening(trening_id, data):
    with db_session:
        trening = Trening.get(id=trening_id)
        if not trening:
            return {"error": "Trening nije pronaden."}, 404

        if "datum" in data and data["datum"]:
            trening.datum = datetime.strptime(data["datum"], "%Y-%m-%d").date()

        if "vrsta_vjezbe" in data:
            if data["vrsta_vjezbe"] not in VRSTE_VJEZBI:
                return {"error": "Vrsta vjezbe nije validna."}, 400
            trening.vrsta_vjezbe = data["vrsta_vjezbe"]

        if "tezina" in data:
            trening.tezina = float(data["tezina"])
        if "ponavljanja" in data:
            trening.ponavljanja = int(data["ponavljanja"])
        if "trajanje_min" in data:
            trening.trajanje_min = int(data["trajanje_min"])

        return {"message": "Trening azuriran."}, 200
