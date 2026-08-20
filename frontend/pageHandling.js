function prebaciStranicu(ime) {
    trenutnaStranica = ime;

    document.querySelectorAll(".app-page").forEach((el) => {
        el.classList.add("d-none");
    });
    document.getElementById(`page-${ime}`).classList.remove("d-none");
    document.querySelectorAll("#main-nav .nav-link").forEach((btn) => {
        btn.classList.remove("active");
    });
    document.querySelector(`#main-nav [data-page="${ime}"]`).classList.add("active");

    if (ime === "pocetna") {
        osvjeziPocetnu();
    }
    if (ime === "statistike") {
        // mala pauza za canvas. (Radi ucitavanja)
        setTimeout(() => osvjeziStatistikeStranicu(), 50);
    }
    if (ime === "treningi") {
        primijeniFiltere();
    }
}

function setupNavigacija() {
    document.querySelectorAll("#main-nav .nav-link").forEach((btn) => {
        btn.addEventListener("click", () => prebaciStranicu(btn.dataset.page));
    });
}
