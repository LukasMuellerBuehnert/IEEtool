// Tabellen und Konstanten
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

const speicherpreise = {
  "Alpha 3.65": 2700,
  "Alpha 7.3": 4500,
  "Alpha 10.9": 6200,
  "Alpha 14.6": 7800,
  "Alpha 18.4": 9200,
  "Alpha 22.1": 10600,
  "Sma 6.6": 4300,
  "Sma9.9": 6100,
  "Sma13.2": 7700,
  "Sma16.5": 9300
};

const wechselrichterpreise = {
  Alpha: {
    "Alpha 4": 1700,
    "Alpha6": 2100,
    "Alpha8": 2500,
    "Alpha10": 2900,
    "Alpha20": 3900
  },
  Sma: {
    "Sma6": 1800,
    "Sma8": 2200,
    "Sma10": 2600
  }
};

const zusatzleistungen = {
  Garantie: 990,
  Fernwartung: 350,
  Montage: 0,
  Wallbox: 2200,
  Netzersatz: 2199,
  Potentialausgleich: 1100
};

let chart;

function updateChart() {
  const kosten1Jahr = +verbrauch.value * (+preis.value / 100) + +grundpreis.value;
  const jahre = Array.from({ length: 21 }, (_, i) => i); // 0 bis 20
  const kostenProJahr = jahre.map(j =>
    kostenErstesJahr * Math.pow(steigerung, j)
  );

  const kumulierteKosten = jahre.map(j =>
    (kostenErstesJahr / Math.log(steigerung)) * (Math.pow(steigerung, j + 1) - 1)
  );

  if (chart) chart.destroy(); // Vorherige Version entfernen

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
          title: { display: true, text: "Jahre" }
        },
        y: {
          title: { display: true, text: "Kosten in €" },
          beginAtZero: true
        }
      }
    }
  });

  const k10 = kumulierteKosten[10].toFixed(0);
  const k20 = kumulierteKosten[20].toFixed(0);
  const kj = kostenErstesJahr.toFixed(0);

  kostenTexte.innerHTML = `
    <p>Aktuelle jährliche Stromkosten: <strong>${kj} €</strong></p>
    <p>Kumulierte Kosten in 10 Jahren: <strong>${k10} €</strong></p>
    <p>Kumulierte Kosten in 20 Jahren: <strong>${k20} €</strong></p>
  `;
}

// Textausgabe-Funktionen
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

// Empfehlung
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

// Picker
function updateModulText() {
  const anzahl = +modulmenge.value || 0;
  const preis = anzahl * modulpreis;
  modulpreis_out.textContent = `${preis.toFixed(2)} €`;
  updatePreise();
}

function updateSpeicherText() {
  const speicherwahlwert = speicherwahl.value || "Alpha 3.65";
  const typ = speicherwahlwert.startsWith("Alpha") ? "Alpha" : "Sma";

  // Wechselrichterliste aktualisieren
  wechselrichterwahl.innerHTML = "";
  Object.keys(wechselrichterpreise[typ]).forEach(name => {
    const o = document.createElement("option");
    o.value = o.text = name;
    wechselrichterwahl.appendChild(o);
  });

  speicherpreis_out.textContent = `${(speicherpreise[speicherwahlwert] || 0).toFixed(2)} €`;

  updateWechselrichterText(); // ruft updatePreise intern
}

function updateWechselrichterText() {
  const speicherwahlwert = speicherwahl.value || "Alpha 3.65";
  const typ = speicherwahlwert.startsWith("Alpha") ? "Alpha" : "Sma";
  const wr = wechselrichterwahl.value;
  const preis = wechselrichterpreise[typ][wr] || 0;
  wechselrichterpreis_out.textContent = `${preis.toFixed(2)} €`;

  updatePreise();
}

// Preis
function updatePreise() {
  const modulauswahl = +modulmenge.value || 0;
  const modulkosten = modulauswahl * modulpreis;

  const speicherpreis = speicherpreise[speicherwahl.value] || 0;
  const typ = speicherwahl.value?.startsWith("Alpha") ? "Alpha" : "Sma";
  const wechselrichterpreis = wechselrichterpreise[typ][wechselrichterwahl.value] || 0;

  let zusatzBrutto = 0;
  let zusatzNetto = 0;
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    if (cb.checked) {
      if (cb.value === "Potentialausgleich") {
        zusatzNetto += zusatzleistungen[cb.value];
      } else {
        zusatzBrutto += zusatzleistungen[cb.value];
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

// Initialisierung Dropdowns
for (let i = 5; i <= 56; i++) {
  const o = document.createElement("option");
  o.value = o.text = i;
  modulmenge.appendChild(o);
}
Object.keys(speicherpreise).forEach(name => {
  const o = document.createElement("option");
  o.value = o.text = name;
  speicherwahl.appendChild(o);
}
);
updateSpeicherText(); // auch für WR

// Event-Listener
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

// Initialer Aufruf
updateVerbrauchText();
updateAusrichtungText();
updateSeitenText();
updatePreisText();
updateGrundpreisText();
