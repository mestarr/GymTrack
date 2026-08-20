async function primijeniFiltere() {
    const filters = {
        datum_od: document.getElementById("filter-datum-od").value,
        datum_do: document.getElementById("filter-datum-do").value,
        vrsta_vjezbe: document.getElementById("filter-vrsta").value,
    };

    const treninzi = await fetchTreninzi(filters);
    const sortirano = [...treninzi].sort((a, b) => b.datum.localeCompare(a.datum));
    prikaziTreninzePaginirano(sortirano);
}
