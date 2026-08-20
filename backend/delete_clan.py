from pony.orm import db_session

from model import Clan


def delete_clan(clan_id):
    with db_session:
        clan = Clan.get(id=clan_id)
        if not clan:
            return {"error": "Clan nije pronaden."}, 404

        for t in list(clan.treninzi):
            t.delete()
        clan.delete()

        return {"message": "Clan obrisan."}, 200
