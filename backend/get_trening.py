from datetime import datetime

from pony.orm import db_session

from model import Trening, Clan


def trening_to_dict(trening):
    return {
        "id": trening.id,
        "datum": trening.datum.isoformat(),
        "vrsta_vjezbe": trening.vrsta_vjezbe,
        "tezina": trening.tezina,
        "ponavljanja": trening.ponavljanja,
        "trajanje_min": trening.trajanje_min,
        "clan_id": trening.clan.id,
        "clan_ime": f"{trening.clan.ime} {trening.clan.prezime}",
    }


def apply_filters(query, filters):
    if filters.get("clan_id"):
        query = query.filter(lambda t: t.clan.id == int(filters["clan_id"]))

    if filters.get("vrsta_vjezbe"):
        vrsta = filters["vrsta_vjezbe"]
        query = query.filter(lambda t: t.vrsta_vjezbe == vrsta)

    if filters.get("datum_od"):
        datum_od = datetime.strptime(filters["datum_od"], "%Y-%m-%d").date()
        query = query.filter(lambda t: t.datum >= datum_od)

    if filters.get("datum_do"):
        datum_do = datetime.strptime(filters["datum_do"], "%Y-%m-%d").date()
        query = query.filter(lambda t: t.datum <= datum_do)

    return query


def get_treninzi(filters=None):
    filters = filters or {}

    with db_session:
        query = Trening.select()
        query = apply_filters(query, filters)
        treninzi = list(query)
        treninzi.sort(key=lambda t: t.datum)
        return [trening_to_dict(t) for t in treninzi], 200


def get_treninzi_clan(clan_id):
    with db_session:
        clan = Clan.get(id=clan_id)
        if not clan:
            return {"error": "Clan nije pronaden."}, 404

        treninzi = list(Trening.select(lambda t: t.clan.id == clan_id))
        treninzi.sort(key=lambda t: t.datum)
        return [trening_to_dict(t) for t in treninzi], 200
