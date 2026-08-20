// Docker (port 80):
// Lokalno bez dockera ide na :5000 (py -m http.server 8080): i onda api ide prema backendu.
const API_URL = (() => {
    const port = window.location.port;
    if (port === "8080" || port === "5500") {
        return "http://localhost:5000";
    }
    return "/api";
})();

let sviClanovi = [];
let odabraniClanId = null;
let paketi = [];
let vrsteVjezbi = [];
let backendDostupan = true;

function prikaziBackendGresku(tekst) {
    backendDostupan = false;
    const el = document.getElementById("backend-error");
    if (el) {
        el.textContent = tekst;
        el.classList.remove("d-none");
    }
}

function sakrijBackendGresku() {
    backendDostupan = true;
    const el = document.getElementById("backend-error");
    if (el) {
        el.classList.add("d-none");
    }
}

async function apiFetch(path, options = {}) {
    try {
        const res = await fetch(`${API_URL}${path}`, options);
        let data;
        try {
            data = await res.json();
        } catch {
            data = { error: "Neispravan odgovor servera." };
        }
        if (!res.ok) {
            return { ok: false, data, status: res.status };
        }
        sakrijBackendGresku();
        return { ok: true, data, status: res.status };
    } catch {
        prikaziBackendGresku(
            "Backend nije dostupan. Pokreni: docker compose up --build (ili py app.py u backend mapi)."
        );
        return { ok: false, data: { error: "Backend nije dostupan." }, status: 0 };
    }
}

async function fetchOpcije() {
    const result = await apiFetch("/opcije");
    if (!result.ok) return result.data;
    paketi = result.data.paketi;
    vrsteVjezbi = result.data.vrste_vjezbi;
    return result.data;
}

async function fetchClanovi() {
    const result = await apiFetch("/clanovi");
    if (!result.ok) {
        sviClanovi = [];
        return sviClanovi;
    }
    sviClanovi = Array.isArray(result.data) ? result.data : [];
    return sviClanovi;
}

async function fetchClan(id) {
    const result = await apiFetch(`/clan/${id}`);
    return result.data;
}

async function fetchTreninziClan(id) {
    const result = await apiFetch(`/treningi/clan/${id}`);
    if (!result.ok || !Array.isArray(result.data)) return [];
    return result.data;
}

async function fetchTreninzi(filters = {}) {
    const params = new URLSearchParams();
    if (filters.datum_od) params.append("datum_od", filters.datum_od);
    if (filters.datum_do) params.append("datum_do", filters.datum_do);
    if (filters.vrsta_vjezbe) params.append("vrsta_vjezbe", filters.vrsta_vjezbe);
    if (filters.clan_id) params.append("clan_id", filters.clan_id);

    const qs = params.toString();
    const path = qs ? `/treningi?${qs}` : "/treningi";
    const result = await apiFetch(path);
    if (!result.ok || !Array.isArray(result.data)) return [];
    return result.data;
}

async function fetchStatistike(clanId) {
    const path = clanId ? `/statistike?clan_id=${clanId}` : "/statistike";
    const result = await apiFetch(path);
    if (!result.ok) {
        return {
            broj_posjeta: 0,
            prosjecna_tezina: 0,
            prosjecna_ponavljanja: 0,
            bar: { labels: [], values: [] },
            line: { labels: [], values: [] },
            pie: { labels: ["Nema podataka"], values: [1] },
        };
    }
    return result.data;
}

async function postClan(body) {
    return apiFetch("/clan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

async function patchClan(id, body) {
    return apiFetch(`/clan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

async function deleteClan(id) {
    return apiFetch(`/clan/${id}`, { method: "DELETE" });
}

async function postTrening(body) {
    return apiFetch("/trening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

async function deleteTrening(id) {
    return apiFetch(`/trening/${id}`, { method: "DELETE" });
}
