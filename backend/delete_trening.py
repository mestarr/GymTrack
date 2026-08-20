from pony.orm import db_session

from model import Trening


def delete_trening(trening_id):
    with db_session:
        trening = Trening.get(id=trening_id)
        if not trening:
            return {"error": "Trening nije pronaden."}, 404

        trening.delete()
        return {"message": "Trening obrisan."}, 200
