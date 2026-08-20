from datetime import date
from pony.orm import Database, Required, PrimaryKey, Set

db = Database()

# paketi koje teretana nudi (Osnovni, Standardni, Premium) :)
PAKETI = ["Basic", "Standard", "Premium"]

VRSTE_VJEZBI = [
    "Bench press",
    "Squat",
    "Deadlift",
    "OHP",
    "Cardio",
    "Ostalo",
]


class Clan(db.Entity):
    id = PrimaryKey(int, auto=True)
    ime = Required(str)
    prezime = Required(str)
    email = Required(str)
    datum_upisa = Required(date)
    paket = Required(str)
    aktivan = Required(bool, default=True)
    treninzi = Set("Trening")


class Trening(db.Entity):
    id = PrimaryKey(int, auto=True)
    datum = Required(date)
    vrsta_vjezbe = Required(str)
    tezina = Required(float)
    ponavljanja = Required(int)
    trajanje_min = Required(int)
    clan = Required("Clan")
