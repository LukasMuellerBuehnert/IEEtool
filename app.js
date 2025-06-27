// DOM referenzen
const verbrauch = document.getElementById("verbrauch");
const ausrichtung = document.getElementById("ausrichtung");
const seiten = document.getElementById("seiten");
const preis = document.getElementById("preis");
const grundpreis = document.getElementById("grundpreis");

const v_out = document.getElementById("v_out");
const a_out = document.getElementById("a_out");
const s_out = document.getElementById("s_out");
const p_out = document.getElementById("p_out");
const g_out = document.getElementById("g_out");

const modulmenge = document.getElementById("modulmenge");
const speicherwahl = document.getElementById("speicherwahl");
const wechselrichterwahl = document.getElementById("wechselrichterwahl");

const modulpreis_out = document.getElementById("modulpreis_out");
const speicherpreis_out = document.getElementById("speicherpreis_out");
const wechselrichterpreis_out = document.getElementById("wechselrichterpreis_out");

const preisbereich = document.getElementById("preisbereich");
const empfehlung = document.getElementById("empfehlung");
const kostenTexte = document.getElementById("kostenTexte");
// Konstanten
const ausrTbl = [
  ["Nordost", 1.7], ["Ost", 1.5], ["Südost", 1.3],
  ["Süd", 1.2], ["Südwest", 1.3], ["West", 1.5], ["Nordwest", 1.7]
];
const seitenTbl = [
  ["1 Seite", 0.65], ["2 Seiten", 0.55], ["3 Seiten", 0.45]
];
const modulleistung = 450;
const modulpreis = 251;
const steigerung = 1.04;

let daten, chart;

fetch('preise.json')
  .then(res => res.json())
  .then(json => {
    daten = json;
    initPicker();
    updateSpeicherText(); // initial auch WR
    updateVerbrauchText();
    updateAusrichtungText();
    updateSeitenText();
    updatePreisText();
    updateGrundpreisText();
  });

function initPicker() {
  Object.keys(daten.alphaSpeicher).forEach(k => {
    const opt = document.createElement("option");
    opt.value = `Alpha ${k}`;
    opt.text = `Alpha ${k}`;
    speicherwahl.appendChild(opt);
  });
  Object.keys(daten.smaSpeicher).forEach(k => {
    const opt = document.createElement("option");
    opt.value = `Sma ${k}`;
    opt.text = `Sma ${k}`;
    speicherwahl.appendChild(opt);
  });

  for (let i = 5; i <= 56; i++) {
    const opt = document.createElement("option");
    opt.value = opt.text = i;
    modulmenge.appendChild(opt);
  }
}

function updateChart() {
  const kostenErstesJahr = +verbrauch.value * (+preis.value / 100) + +grundpreis.value;
  const jahre = Array.from({ length: 21 }, (_, i) => i);
  const kostenProJahr = jahre.map(j => kostenErstesJahr * Math.pow(steigerung, j));
  const kumulierteKosten = jahre.map(j =>
    (kostenErstesJahr / Math.log(steigerung)) * (Math.pow(steigerung, j + 1) - 1)
  );

  if (chart) chart.destroy();
  const ctx = document.getElementById("kostenChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: jahre,
      datasets: [
        {
          label: "Stromkosten pro Jahr",
          data: kostenProJahr,
          borderWidth: 2,
          borderColor: "rgb(59, 130, 246)",
          fill: false
        },
        {
          label: "Kumulierte Kosten",
          data: kumulierteKosten,
          borderWidth: 2,
          borderColor: "rgb(234, 88, 12)",
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: { color: "#ffffff" },
          grid: { color: "rgba(255,255,255,0.2)" },
          title: { display: true, text: "Jahre", color: "#ffffff" }
        },
        y: {
          ticks: { color: "#ffffff" },
          grid: { color: "rgba(255,255,255,0.2)" },
          title: { display: true, text: "Kosten in €", color: "#ffffff" }
        }
      },
      plugins: {
        legend: { labels: { color: "#ffffff" } },
        tooltip: {
          titleColor: "#000000",
          bodyColor: "#000000",
          backgroundColor: "#1F2937"
        }
      }
    }
  });

  kostenTexte.innerHTML = `
    <p>Aktuelle jährliche Stromkosten: <strong>${kostenErstesJahr.toFixed(0)} €</strong></p>
    <p>Kumulierte Kosten in 10 Jahren: <strong>${kumulierteKosten[10].toFixed(0)} €</strong></p>
    <p>Kumulierte Kosten in 20 Jahren: <strong>${kumulierteKosten[20].toFixed(0)} €</strong></p>
  `;
}

function updateVerbrauchText() {
  v_out.textContent = `${verbrauch.value} kWh`;
  updateEmpfehlung();
  updateChart();
}
function updateAusrichtungText() {
  const a = +ausrichtung.value;
  a_out.textContent = `${ausrTbl[a][0]} (${ausrTbl[a][1]})`;
  updateEmpfehlung();
}
function updateSeitenText() {
  const s = +seiten.value;
  s_out.textContent = `${seitenTbl[s][0]} (${seitenTbl[s][1]})`;
  updateEmpfehlung();
}
function updatePreisText() {
  p_out.textContent = `${preis.value} ct`;
  updateChart();
}
function updateGrundpreisText() {
  g_out.textContent = `${grundpreis.value} €`;
  updateChart();
}

function updateEmpfehlung() {
  const v = +verbrauch.value;
  const a = +ausrichtung.value;
  const s = +seiten.value;
  const mkoeff = ausrTbl[a][1];
  const skoeff = seitenTbl[s][1];
  const module = Math.ceil(v * mkoeff / modulleistung);
  const speicher = Math.ceil((v / 365) * skoeff);
  empfehlung.innerHTML = `
    <p>Empfohlene Module: <strong>${module}</strong></p>
    <p>Empfohlene Speichermenge: <strong>${speicher} kWh</strong></p>
  `;
}

function updateModulText() {
  const anzahl = +modulmenge.value || 0;
  const preis = anzahl * modulpreis;
  modulpreis_out.textContent = `${preis.toFixed(2)} €`;
  updatePreise();
}

function updateSpeicherText() {
  const [typ, kapaz] = speicherwahl.value.split(" ");
  const speicherKey = typ.toLowerCase() + "Speicher";
  const wrKey = typ.toLowerCase() + "Wechselrichter";

  speicherpreis_out.textContent = `${(daten[speicherKey][kapaz] || 0).toFixed(2)} €`;

  // WR-Picker aktualisieren
  wechselrichterwahl.innerHTML = "";
  Object.keys(daten[wrKey]).forEach(name => {
    const o = document.createElement("option");
    o.value = o.text = name;
    wechselrichterwahl.appendChild(o);
  });

  updateWechselrichterText();
}

function updateWechselrichterText() {
  const [typ] = speicherwahl.value.split(" ");
  const wrKey = typ.toLowerCase() + "Wechselrichter";
  const wr = wechselrichterwahl.value;
  wechselrichterpreis_out.textContent = `${(daten[wrKey][wr] || 0).toFixed(2)} €`;
  updatePreise();
}

function updatePreise() {
  const modulauswahl = +modulmenge.value || 0;
  const modulkosten = modulauswahl * modulpreis;

  const [typ, kapaz] = speicherwahl.value.split(" ");
  const speicherpreis = daten[typ.toLowerCase() + "Speicher"][kapaz] || 0;
  const wechselrichterpreis = daten[typ.toLowerCase() + "Wechselrichter"][wechselrichterwahl.value] || 0;

  let zusatzBrutto = 0;
  let zusatzNetto = 0;
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    if (cb.checked) {
      const preis = daten.zusatzleistungen[cb.value] || 0;
      if (cb.value === "Potentialausgleich") zusatzNetto += preis;
      else zusatzBrutto += preis;
    }
  });

  const gesamtNetto = modulkosten + speicherpreis + wechselrichterpreis + zusatzNetto;
  const mwst = zusatzBrutto * 0.19 + zusatzNetto;
  const gesamtBrutto = zusatzBrutto + gesamtNetto;

  preisbereich.innerHTML = `
    <p>Netto: ${gesamtNetto.toFixed(2)} €</p>
    <p>inkl. MwSt: ${mwst.toFixed(2)} €</p>
    <p class="font-semibold text-lg">Gesamtbetrag: ${(gesamtBrutto + mwst).toFixed(2)} €</p>
  `;
}

// Event-Listener
verbrauch.addEventListener("input", updateVerbrauchText);
ausrichtung.addEventListener("input", updateAusrichtungText);
seiten.addEventListener("input", updateSeitenText);
preis.addEventListener("input", updatePreisText);
grundpreis.addEventListener("input", updateGrundpreisText);
modulmenge.addEventListener("change", updateModulText);
speicherwahl.addEventListener("change", updateSpeicherText);
wechselrichterwahl.addEventListener("change", updateWechselrichterText);
document.querySelectorAll("input[type=checkbox]").forEach(cb =>
  cb.addEventListener("change", updatePreise)
);
