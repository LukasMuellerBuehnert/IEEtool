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
  Potentialausgleich: 1100 // exkl. MwSt
};

function update() {
  const v = +verbrauch.value;
  const a = +ausrichtung.value;
  const s = +seiten.value;

  const pkwh = +preis.value;
  const gp = +grundpreis.value;

  v_out.textContent = `${v} kWh`;
  a_out.textContent = `${ausrTbl[a][0]} (${ausrTbl[a][1]})`;
  s_out.textContent = `${seitenTbl[s][0]} (${seitenTbl[s][1]})`;
  p_out.textContent = `${pkwh} ct`;
  g_out.textContent = `${gp} €`;

  const mkoeff = ausrTbl[a][1];
  const skoeff = seitenTbl[s][1];

  const module = Math.ceil(v * mkoeff / modulleistung);
  const speicher = Math.ceil((v / 365) * skoeff);

  // Empfehlung anzeigen
  empfehlung.innerHTML = `
    <p>Empfohlene Module: <strong>${module}</strong></p>
    <p>Empfohlene Speichermenge: <strong>${speicher} kWh</strong></p>
  `;

  // Picker aktualisieren
  modulmenge.innerHTML = "";
  for (let i = 5; i <= 56; i++) {
    const o = document.createElement("option");
    o.value = o.text = i;
    modulmenge.appendChild(o);
  }

  speicherwahl.innerHTML = "";
  Object.keys(speicherpreise).forEach(name => {
    const o = document.createElement("option");
    o.value = o.text = name;
    speicherwahl.appendChild(o);
  });

  // Wechselrichter dynamisch
  const speicherwahlwert = speicherwahl.value || "Alpha 3.65";
  const typ = speicherwahlwert.startsWith("Alpha") ? "Alpha" : "Sma";
  const wrListe = wechselrichterpreise[typ];

  wechselrichterwahl.innerHTML = "";
  Object.keys(wrListe).forEach(name => {
    const o = document.createElement("option");
    o.value = o.text = name;
    wechselrichterwahl.appendChild(o);
  });

  // Preisberechnung
  const modulauswahl = +modulmenge.value || 0;
  const modulkosten = modulauswahl * modulpreis;

  const speicherpreis = speicherpreise[speicherwahl.value] || 0;
  const wechselrichterpreis = wrListe[wechselrichterwahl.value] || 0;

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
  const gesamtBrutto = zusatzBrutto + gesamtNetto * 1;

  const mwst = zusatzBrutto * 0.19 + zusatzNetto * 0.19;

  preisbereich.innerHTML = `
    <p>Netto: ${gesamtNetto.toFixed(2)} €</p>
    <p>inkl. MwSt: ${mwst.toFixed(2)} €</p>
    <p class="font-semibold text-lg">Gesamtbetrag: ${(gesamtBrutto + mwst).toFixed(2)} €</p>
  `;
}

// Initialisierung
[verbrauch, ausrichtung, seiten, preis, grundpreis].forEach(el => {
  el.addEventListener("input", update);
});
[modulmenge, speicherwahl, wechselrichterwahl].forEach(el => {
  el.addEventListener("change", update);
});
document.querySelectorAll("input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", update);
});

update();
