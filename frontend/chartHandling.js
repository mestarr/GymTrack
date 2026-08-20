let barChart = null;
let lineChart = null;
let pieChart = null;

function updateCharts(stats, jeClan) {
    if (!stats || !stats.bar) return;

    const pieTitle = document.getElementById("pie-title");
    pieTitle.textContent = jeClan
        ? "Udio vrsta vjezbi (clan)"
        : "Aktivni clanovi po paketu";

    if (barChart) barChart.destroy();
    if (lineChart) lineChart.destroy();
    if (pieChart) pieChart.destroy();

    const barLabels = stats.bar.labels || [];
    const barValues = stats.bar.values || [];
    const lineLabels = stats.line.labels || [];
    const lineValues = stats.line.values || [];
    const pieLabels = stats.pie.labels || ["Nema podataka"];
    const pieValues = stats.pie.values || [1];

    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: barLabels,
            datasets: [{
                label: "Broj treninga",
                data: barValues,
                backgroundColor: "#66bb6a",
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
        },
    });

    lineChart = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: lineLabels.length ? lineLabels : ["-"],
            datasets: [{
                label: "Prosjecna tezina (kg)",
                data: lineValues.length ? lineValues : [0],
                borderColor: "#2e7d32",
                backgroundColor: "rgba(46,125,50,0.1)",
                fill: true,
                tension: 0.2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        },
    });

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: pieLabels,
            datasets: [{
                data: pieValues,
                backgroundColor: ["#43a047", "#7cb342", "#c0ca33", "#ffb300", "#fb8c00", "#e53935"],
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        },
    });
}