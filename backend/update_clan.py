from datetime import datetime

from pony.orm import db_session

from model import Clan, PAKETI


def update_clan(clan_id, data):
    with db_session:
        clan = Clan.get(id=clan_id)
        if not clan:
            return {"error": "Clan nije pronaden."}, 404

        if "ime" in data:
            clan.ime = data["ime"].strip()
        if "prezime" in data:
            clan.prezime = data["prezime"].strip()
        if "email" in data:
            clan.email = data["email"].strip()
        if "paket" in data:
            if data["paket"] not in PAKETI:
                return {"error": "Paket nije validan."}, 400
            clan.paket = data["paket"]
        if "aktivan" in data:
            clan.aktivan = bool(data["aktivan"])
        if "datum_upisa" in data and data["datum_upisa"]:
            clan.datum_upisa = datetime.strptime(
                data["datum_upisa"], "%Y-%m-%d"
            ).date()

        return {"message": "Clan azuriran."}, 200
