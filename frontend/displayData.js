const ZAPISI_PO_STRANICI = 8;
let sviFiltriraniTreninzi = [];
let treninziStranica = 1;
let trenutnaStranica = "pocetna";

function showPoruka(tekst, tip) {
    const el = document.getElementById("app-toast");
    const klasa = tip === "danger" ? "alert-danger" : "alert-success";
    el.className = `alert ${klasa}`;
    el.textContent = tekst;
    el.classList.remove("d-none");
    setTimeout(() => el.classList.add("d-none"), 3500);
}

function updateClanCount(count) {
    document.getElementById("clan-count").textContent = count;
}

function osvjeziListuClanova() {
    const upit = document.getElementById("search-clan").value;
    if (upit) {
        filtrirajClanovePoImenu(upit);
    } else {
        prikaziClanove(sviClanovi);
    }
}

function prikaziClanove(lista) {
    const ul = document.getElementById("clan-list");
    ul.innerHTML = "";

    if (lista.length === 0) {
        ul.innerHTML = '<li class="list-group-item text-muted">Nema clanova.</li>';
        updateClanCount(0);
        return;
    }

    lista.forEach((clan) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        if (clan.id === odabraniClanId) {
            li.classList.add("active");
        }

        let tekst = `${clan.ime} ${clan.prezime} (${clan.paket})`;
        if (!clan.aktivan) {
            tekst += ' <span class="inactive-badge">[neaktivan]</span>';
        }
        li.innerHTML = tekst;
        li.addEventListener("click", () => odaberiClana(clan.id));
        ul.appendChild(li);
    });

    updateClanCount(lista.length);
}

function prikaziDetaljeClana(clan) {
    if (clan.error) {
        showPoruka(clan.error, "danger");
        return;
    }

    document.getElementById("clan-placeholder").classList.add("d-none");
    document.getElementById("clan-details").classList.remove("d-none");

    document.getElementById("view-ime").textContent = clan.ime;
    document.getElementById("view-prezime").textContent = clan.prezime;
    document.getElementById("view-email").textContent = clan.email;
    document.getElementById("view-datum").textContent = clan.datum_upisa;
    document.getElementById("view-paket").textContent = clan.paket;

    const aktivanEl = document.getElementById("view-aktivan");
    aktivanEl.textContent = clan.aktivan ? "Da" : "Ne";
    aktivanEl.className = clan.aktivan ? "status-aktivan" : "status-neaktivan";

    document.getElementById("view-broj-treninzi").textContent = clan.broj_treninzi ?? 0;
}

function napraviTreningStavku(t, ul) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-start";

    const clanInfo = t.clan_ime ? `<br><span class="text-muted">${t.clan_ime}</span>` : "";

    li.innerHTML = `
        <div>
            <strong>${t.datum}</strong> - ${t.vrsta_vjezbe}${clanInfo}<br>
            ${t.tezina} kg, ${t.ponavljanja}x, ${t.trajanje_min} min
        </div>
        <button class="btn btn-outline-danger delete-trening-btn" data-id="${t.id}">x</button>
    `;

    li.querySelector(".delete-trening-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm("Obrisati trening?")) return;

        const result = await deleteTrening(t.id);
        if (result.ok) {
            showPoruka("Trening obrisan.");
            await osvjeziSve();
        } else {
            showPoruka(result.data.error || "Greska.", "danger");
        }
    });

    ul.appendChild(li);
}

function prikaziTreninze(lista, elementId) {
    const ul = document.getElementById(elementId);
    ul.innerHTML = "";

    if (lista.length === 0) {
        ul.innerHTML = '<li class="list-group-item text-muted">Nema treninga.</li>';
        return;
    }

    const sortirano = [...lista].sort((a, b) => b.datum.localeCompare(a.datum));
    sortirano.forEach((t) => napraviTreningStavku(t, ul));
}

function prikaziTreninzePaginirano(lista) {
    sviFiltriraniTreninzi = lista;
    treninziStranica = 1;
    document.getElementById("trening-filter-count").textContent = lista.length;
    renderStranicaTreninzi();
}

function renderStranicaTreninzi() {
    const ul = document.getElementById("trening-list-filtered");
    ul.innerHTML = "";

    if (sviFiltriraniTreninzi.length === 0) {
        ul.innerHTML = '<li class="list-group-item text-muted">Nema treninga za filter.</li>';
        document.getElementById("trening-pagination").innerHTML = "";
        return;
    }

    const ukupnoStranica = Math.ceil(sviFiltriraniTreninzi.length / ZAPISI_PO_STRANICI);
    const pocetak = (treninziStranica - 1) * ZAPISI_PO_STRANICI;
    const slice = sviFiltriraniTreninzi.slice(pocetak, pocetak + ZAPISI_PO_STRANICI);

    slice.forEach((t) => napraviTreningStavku(t, ul));
    prikaziPaginaciju(ukupnoStranica);
}

function prikaziPaginaciju(ukupnoStranica) {
    const wrap = document.getElementById("trening-pagination");
    wrap.innerHTML = "";

    if (ukupnoStranica <= 1) return;

    const info = document.createElement("span");
    info.className = "page-info";
    info.textContent = `Stranica ${treninziStranica} / ${ukupnoStranica}`;
    wrap.appendChild(info);

    const btnPrev = document.createElement("button");
    btnPrev.className = "btn btn-sm btn-outline-secondary";
    btnPrev.textContent = "Prethodna";
    btnPrev.disabled = treninziStranica === 1;
    btnPrev.addEventListener("click", () => {
        treninziStranica -= 1;
        renderStranicaTreninzi();
    });

    const btnNext = document.createElement("button");
    btnNext.className = "btn btn-sm btn-outline-secondary ms-2";
    btnNext.textContent = "Sljedeca";
    btnNext.disabled = treninziStranica === ukupnoStranica;
    btnNext.addEventListener("click", () => {
        treninziStranica += 1;
        renderStranicaTreninzi();
    });

    wrap.appendChild(btnPrev);
    wrap.appendChild(btnNext);
}

function prikaziStatBrojke(stats) {
    if (!stats) return;
    document.getElementById("stat-posjeta").textContent = stats.broj_posjeta ?? 0;
    document.getElementById("stat-tezina").textContent = stats.prosjecna_tezina ?? 0;
    document.getElementById("stat-ponavljanja").textContent = stats.prosjecna_ponavljanja ?? 0;
}

async function osvjeziStatistikeStranicu() {
    const stats = await fetchStatistike(odabraniClanId);
    prikaziStatBrojke(stats);
    updateCharts(stats, !!odabraniClanId);
}

async function osvjeziPocetnu() {
    if (!backendDostupan) return;

    const stats = await fetchStatistike(null);
    const treninzi = await fetchTreninzi({});
    const aktivnih = sviClanovi.filter((c) => c.aktivan).length;

    document.getElementById("home-ukupno-clanova").textContent = sviClanovi.length;
    document.getElementById("home-aktivnih").textContent = aktivnih;
    document.getElementById("home-ukupno-treninzi").textContent = treninzi.length;
    document.getElementById("home-prosj-tezina").textContent = stats.prosjecna_tezina ?? 0;

    const sortirano = [...treninzi].sort((a, b) => b.datum.localeCompare(a.datum));
    const zadnji = sortirano.slice(0, 5);

    const ul = document.getElementById("home-zadnji-treninzi");
    ul.innerHTML = "";

    if (zadnji.length === 0) {
        ul.innerHTML = '<li class="list-group-item text-muted">Jos nema unesenih treninga.</li>';
        return;
    }

    zadnji.forEach((t) => napraviTreningStavku(t, ul));
}

function filtrirajClanovePoImenu(upit) {
    if (!upit) {
        prikaziClanove(sviClanovi);
        return;
    }
    const q = upit.toLowerCase();
    const filtrirano = sviClanovi.filter((c) => {
        const puno = `${c.ime} ${c.prezime}`.toLowerCase();
        return puno.includes(q);
    });
    prikaziClanove(filtrirano);
}

async function odaberiClana(id) {
    odabraniClanId = id;
    osvjeziListuClanova();

    const clan = await fetchClan(id);
    prikaziDetaljeClana(clan);

    const treninzi = await fetchTreninziClan(id);
    prikaziTreninze(treninzi, "trening-list-clan");

    const sel = document.getElementById("trening-clan");
    const c = sviClanovi.find((x) => x.id === id);
    if (c && c.aktivan && sel.querySelector(`option[value="${id}"]`)) {
        sel.value = String(id);
    }
}

async function osvjeziSve() {
    await fetchClanovi();
    osvjeziListuClanova();
    popuniSelectClanove();

    if (odabraniClanId) {
        const postoji = sviClanovi.some((c) => c.id === odabraniClanId);
        if (postoji) {
            await odaberiClana(odabraniClanId);
        } else {
            odabraniClanId = null;
            document.getElementById("clan-details").classList.add("d-none");
            document.getElementById("clan-placeholder").classList.remove("d-none");
        }
    }

    await primijeniFiltere();

    if (trenutnaStranica === "pocetna") {
        await osvjeziPocetnu();
    }
    if (trenutnaStranica === "statistike") {
        await osvjeziStatistikeStranicu();
    }
}
