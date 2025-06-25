// Konstanten
const ausrTbl = [
  ["Nordost", 1.7],
  ["Ost", 1.5],
  ["Südost", 1.3],
  ["Süd", 1.2],
  ["Südwest", 1.3],
  ["West", 1.5],
  ["Nordwest", 1.7]
];

const seitenTbl = [
  ["1 Seite", 0.65],
  ["2 Seiten", 0.55],
  ["3 Seiten", 0.45]
];

const modulleistung = 450;
const modulpreis = 251;
const steigerung = 1.04;

let daten;
let chart;

fetch('preise.json')
  .then(res => res.json())
  .then(json => {
    daten = json;
    initPicker();
    updateSpeicherText();
    updateVerbrauchText();
    updateAusrichtungText();
    updateSeitenText();
    updatePreisText();
    updateGrundpreisText();
  });

function initPicker() {
  // Speicher
  Object.keys(daten.alphaSpeicher).forEach(key => {
    const o = document.createElement("option");
    o.value = o.text = `Alpha ${key}`;
    speicherwahl.appendChild(o);
  });
  Object.keys(daten.smaSpeicher).forEach(key => {
    const o = document.createElement("option");
    o.value = o.text = `Sma ${key}`;
    speicherwahl.appendChild(o);
  });

  // Modulmenge
  for (let i = 5; i <= 56; i++) {
    const o = document.createElement("option");
    o.value = o.text = i;
    modulmenge.appendChild(o);
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
        x: { title: { display: true, text: "Jahre" } },
        y: { title: { display: true, text: "Kosten in €" }, beginAtZero: true }
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
  const speicherwahlwert = speicherwahl.value || "Alpha 3.65";
  const typ = speicherwahlwert.startsWith("Alpha") ? "alphaSpeicher" : "smaSpeicher";
  const key = speicherwahlwert.split(" ")[1];

  // Wechselrichterliste aktualisieren
  wechselrichterwahl.innerHTML = "";
  const wrTyp = speicherwahlwert.startsWith("Alpha") ? daten.alphaWechselrichter : daten.smaWechselrichter;
  Object.keys(wrTyp).forEach(name => {
    const o = document.createElement("option");
    o.value = o.text = name;
    wechselrichterwahl.appendChild(o);
  });

  speicherpreis_out.textContent = `${(daten[typ][key] || 0).toFixed(2)} €`;
  updateWechselrichterText();
}

function updateWechselrichterText() {
  const speicherwahlwert = speicherwahl.value || "Alpha 3.65";
  const typ = speicherwahlwert.startsWith("Alpha") ? "alphaWechselrichter" : "smaWechselrichter";
  const wr = wechselrichterwahl.value;
  const preis = daten[typ][wr] || 0;
  wechselrichterpreis_out.textContent = `${preis.toFixed(2)} €`;
  updatePreise();
}

function updatePreise() {
  const modulauswahl = +modulmenge.value || 0;
  const modulkosten = modulauswahl * modulpreis;

  const speicherwahlwert = speicherwahl.value || "Alpha 3.65";
  const speichertyp = speicherwahlwert.startsWith("Alpha") ? "alphaSpeicher" : "smaSpeicher";
  const key = speicherwahlwert.split(" ")[1];
  const speicherpreis = daten[speichertyp][key] || 0;

  const wrTyp = speicherwahlwert.startsWith("Alpha") ? "alphaWechselrichter" : "smaWechselrichter";
  const wechselrichterpreis = daten[wrTyp][wechselrichterwahl.value] || 0;

  let zusatzBrutto = 0;
  let zusatzNetto = 0;
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    if (cb.checked) {
      if (cb.value === "Potentialausgleich") {
        zusatzNetto += daten.zusatzleistungen[cb.value];
      } else {
        zusatzBrutto += daten.zusatzleistungen[cb.value];
      }
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

verbrauch.addEventListener("input", updateVerbrauchText);
ausrichtung.addEventListener("input", updateAusrichtungText);
seiten.addEventListener("input", updateSeitenText);
preis.addEventListener("input", updatePreisText);
grundpreis.addEventListener("input", updateGrundpreisText);
modulmenge.addEventListener("change", updateModulText);
speicherwahl.addEventListener("change", updateSpeicherText);
wechselrichterwahl.addEventListener("change", updateWechselrichterText);
document.querySelectorAll("input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", updatePreise);
});
