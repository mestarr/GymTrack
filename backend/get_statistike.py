from collections import defaultdict

from pony.orm import db_session

from model import Clan, Trening, PAKETI, VRSTE_VJEZBI


def get_statistike(clan_id=None):
    with db_session:
        if clan_id:
            clan = Clan.get(id=int(clan_id))
            if not clan:
                return {"error": "Clan nije pronaden."}, 404
            treninzi = list(clan.treninzi)
        else:
            treninzi = list(Trening.select())

        broj_posjeta = len(treninzi)

        if broj_posjeta == 0:
            prosjecna_tezina = 0
            prosjecna_ponavljanja = 0
        else:
            prosjecna_tezina = round(
                sum(t.tezina for t in treninzi) / broj_posjeta, 2
            )
            prosjecna_ponavljanja = round(
                sum(t.ponavljanja for t in treninzi) / broj_posjeta, 2
            )

        # koliko treninga po vrsti vjezbe??? DIO
        po_vrsti = defaultdict(int)
        for t in treninzi:
            po_vrsti[t.vrsta_vjezbe] += 1

        bar_labels = list(VRSTE_VJEZBI)
        bar_values = [po_vrsti[v] for v in bar_labels]

        # line chart DIO!!!!
        po_datumu = defaultdict(list)
        for t in treninzi:
            po_datumu[t.datum.isoformat()].append(t.tezina)

        datumi = sorted(po_datumu.keys())
        line_values = []
        for d in datumi:
            tezine = po_datumu[d]
            line_values.append(round(sum(tezine) / len(tezine), 2))

        # ONDA pie chart 
        pie_labels = PAKETI
        pie_values = []
        if clan_id:
            pie_labels = [v for v in VRSTE_VJEZBI if po_vrsti[v] > 0]
            pie_values = [po_vrsti[v] for v in pie_labels]
            if not pie_labels:
                pie_labels = ["Nema treninga"]
                pie_values = [1]
        else:
            clanovi = list(Clan.select())
            for p in PAKETI:
                pie_values.append(
                    sum(1 for c in clanovi if c.paket == p and c.aktivan)
                )

        return {
            "broj_posjeta": broj_posjeta,
            "prosjecna_tezina": prosjecna_tezina,
            "prosjecna_ponavljanja": prosjecna_ponavljanja,
            "bar": {"labels": bar_labels, "values": bar_values},
            "line": {"labels": datumi, "values": line_values},
            "pie": {"labels": pie_labels, "values": pie_values},
        }, 200
