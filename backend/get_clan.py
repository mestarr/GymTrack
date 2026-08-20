from pony.orm import db_session

from model import Clan


def clan_to_dict(clan):
    return {
        "id": clan.id,
        "ime": clan.ime,
        "prezime": clan.prezime,
        "email": clan.email,
        "datum_upisa": clan.datum_upisa.isoformat(),
        "paket": clan.paket,
        "aktivan": clan.aktivan,
        "broj_treninzi": len(clan.treninzi),
    }


def get_all_clanovi():
    with db_session:
        clanovi = list(Clan.select())
        clanovi.sort(key=lambda c: (c.prezime.lower(), c.ime.lower()))
        return [clan_to_dict(c) for c in clanovi], 200


def get_clan_by_id(clan_id):
    with db_session:
        clan = Clan.get(id=clan_id)
        if not clan:
            return {"error": "Clan nije pronaden."}, 404
        return clan_to_dict(clan), 200
