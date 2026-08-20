function popuniSelectOpcije() {
    const paketSelect = document.getElementById("form-paket");
    paketSelect.innerHTML = "";
    paketi.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        paketSelect.appendChild(opt);
    });

    const vrstaSelects = [
        document.getElementById("trening-vrsta"),
        document.getElementById("filter-vrsta"),
    ];

    vrstaSelects.forEach((sel) => {
        const prazna = sel.id === "filter-vrsta";
        sel.innerHTML = prazna ? '<option value="">Sve</option>' : "";
        vrsteVjezbi.forEach((v) => {
            const opt = document.createElement("option");
            opt.value = v;
            opt.textContent = v;
            sel.appendChild(opt);
        });
    });
}

function popuniSelectClanove() {
    const sel = document.getElementById("trening-clan");
    sel.innerHTML = "";

    const aktivni = sviClanovi.filter((c) => c.aktivan);

    if (aktivni.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Nema aktivnih clanova";
        sel.appendChild(opt);
        return;
    }

    aktivni.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.ime} ${c.prezime}`;
        sel.appendChild(opt);
    });
}

function prebaciTab(tabName) {
    const viewPanel = document.getElementById("clan-view");
    const formPanel = document.getElementById("clan-form");
    const tabs = document.querySelectorAll("#clan-tabs .nav-link");

    tabs.forEach((t) => t.classList.remove("active"));
    document.querySelector(`#clan-tabs [data-tab="${tabName}"]`).classList.add("active");

    if (tabName === "view") {
        viewPanel.classList.remove("d-none");
        formPanel.classList.add("d-none");
    } else {
        viewPanel.classList.add("d-none");
        formPanel.classList.remove("d-none");
        document.getElementById("clan-form-mode").value = tabName;

        if (tabName === "add") {
            document.getElementById("clan-form").reset();
            document.getElementById("form-aktivan").checked = true;
        }

        if (tabName === "edit") {
            if (!odabraniClanId) {
                showPoruka("Prvo odaberi clana s lijeve liste.", "danger");
                prebaciTab("view");
                return;
            }
            ucitajClanUFormu(odabraniClanId);
        }
    }
}

async function ucitajClanUFormu(id) {
    const clan = await fetchClan(id);
    if (clan.error) return;

    document.getElementById("form-ime").value = clan.ime;
    document.getElementById("form-prezime").value = clan.prezime;
    document.getElementById("form-email").value = clan.email;
    document.getElementById("form-datum").value = clan.datum_upisa;
    document.getElementById("form-paket").value = clan.paket;
    document.getElementById("form-aktivan").checked = clan.aktivan;
}

function setupClanForme() {
    document.querySelectorAll("#clan-tabs .nav-link").forEach((btn) => {
        btn.addEventListener("click", () => prebaciTab(btn.dataset.tab));
    });

    document.getElementById("search-clan").addEventListener("input", (e) => {
        filtrirajClanovePoImenu(e.target.value);
    });

    document.getElementById("clan-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const mode = document.getElementById("clan-form-mode").value;

        const body = {
            ime: document.getElementById("form-ime").value.trim(),
            prezime: document.getElementById("form-prezime").value.trim(),
            email: document.getElementById("form-email").value.trim(),
            datum_upisa: document.getElementById("form-datum").value,
            paket: document.getElementById("form-paket").value,
            aktivan: document.getElementById("form-aktivan").checked,
        };

        let result;
        if (mode === "add") {
            result = await postClan(body);
        } else {
            result = await patchClan(odabraniClanId, body);
        }

        if (result.ok) {
            showPoruka(mode === "add" ? "Clan uspjesno dodan." : "Clan uspjesno azuriran.");
            if (mode === "add" && result.data.id) {
                odabraniClanId = result.data.id;
            }
            await osvjeziSve();
            prebaciTab("view");
        } else {
            showPoruka(result.data.error || "Greska pri spremanju.", "danger");
        }
    });

    document.getElementById("btn-delete-clan").addEventListener("click", async () => {
        if (!odabraniClanId) return;
        if (!confirm("Obrisati clana i sve njegove treninge?")) return;

        const result = await deleteClan(odabraniClanId);
        if (result.ok) {
            showPoruka("Clan obrisan.");
            odabraniClanId = null;
            document.getElementById("clan-details").classList.add("d-none");
            document.getElementById("clan-placeholder").classList.remove("d-none");
            await osvjeziSve();
        } else {
            showPoruka(result.data.error || "Greska.", "danger");
        }
    });
}

function setupTreningFormu(danas) {
    document.getElementById("trening-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const clanId = parseInt(document.getElementById("trening-clan").value, 10);
        if (!clanId) {
            showPoruka("Nema aktivnog clana za trening.", "danger");
            return;
        }

        const body = {
            clan_id: clanId,
            datum: document.getElementById("trening-datum").value,
            vrsta_vjezbe: document.getElementById("trening-vrsta").value,
            tezina: parseFloat(document.getElementById("trening-tezina").value) || 0,
            ponavljanja: parseInt(document.getElementById("trening-ponavljanja").value, 10) || 0,
            trajanje_min: parseInt(document.getElementById("trening-trajanje").value, 10) || 0,
        };

        const result = await postTrening(body);
        if (result.ok) {
            showPoruka("Trening uspjesno dodan.");
            odabraniClanId = body.clan_id;
            await osvjeziSve();
            document.getElementById("trening-tezina").value = "0";
            document.getElementById("trening-ponavljanja").value = "0";
            document.getElementById("trening-trajanje").value = "30";
            document.getElementById("trening-datum").value = danas;
        } else {
            showPoruka(result.data.error || "Greska pri dodavanju treninga.", "danger");
        }
    });
}

function setupFiltere() {
    document.getElementById("btn-filter").addEventListener("click", async () => {
        await primijeniFiltere();
    });

    document.getElementById("btn-reset-filter").addEventListener("click", async () => {
        document.getElementById("filter-datum-od").value = "";
        document.getElementById("filter-datum-do").value = "";
        document.getElementById("filter-vrsta").value = "";
        await primijeniFiltere();
    });
}

async function initApp() {
    await fetchOpcije();
    popuniSelectOpcije();

    const danas = new Date().toISOString().split("T")[0];
    document.getElementById("trening-datum").value = danas;

    setupNavigacija();
    setupClanForme();
    setupTreningFormu(danas);
    setupFiltere();

    await osvjeziSve();
    await osvjeziPocetna();
}

document.addEventListener("DOMContentLoaded", initApp);
