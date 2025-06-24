// Ausrichtung und Koeffizienten
const ausrTbl = [
  ["nordost", 1.7],
  ["ost", 1.5],
  ["südost", 1.3],
  ["süd", 1.2],
  ["südwest", 1.3],
  ["west", 1.5],
  ["nordwest", 1.7]
];
const seitenTbl = [
  ["1", 0.65],
  ["2", 0.55],
  ["3", 0.45]
];
const modulLeistung = 450;

const zusatz = {
  "Garantieverlängerung": 990,
  "Fernwartung": 350,
  "Montagegarantie": 0,
  "Wallbox": 2200,
  "Netzersatzbetrieb": 2199,
  "Potentialausgleichsschiene": 1100
};

function updateVals() {
  document.getElementById("verbrWert").textContent = document.getElementById("verbrauch").value;
  const a = +document.getElementById("ausrichtung").value;
  document.getElementById("ausrIch").textContent = ausrTbl[a][0];
  const s = +document.getElementById("seiten").value;
  document.getElementById("seitenIch").textContent = seitenTbl[s][0];
  document.getElementById("preisWert").textContent = document.getElementById("preis_kwh").value;
  document.getElementById("grundWert").textContent = document.getElementById("grundpreis").value;
}

["verbrauch","ausrichtung","seiten","preis_kwh","grundpreis"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateVals);
});
updateVals();

document.getElementById("calc").addEventListener("click", () => {
  const V = +document.getElementById("verbrauch").value;
  const [_, mkoeff] = ausrTbl[+document.getElementById("ausrichtung").value];
  const [__, skoeff] = seitenTbl[+document.getElementById("seiten").value];
  const modules = Math.ceil(V * mkoeff / modulLeistung);
  const speicher = Math.ceil(V / 365 * skoeff);

  let sum = modules * 251;
  sum += speicher * 0; // später Speicher-Preise
  sum += +document.getElementById("grundpreis").value;
  sum += (V * (+document.getElementById("preis_kwh").value) / 100);

  // Zusatzleistungen (alles brutto)
  Object.values(zusatz).forEach(v => sum += v);

  const mwstZusatz = (zusatz["Potentialausgleichsschiene"]) ? (100 + 19) * 1100/100 : 0;

  document.getElementById("ergebnis").innerHTML = `
    Module: ${modules} @251€ = ${(modules*251).toFixed(2)} €
    <br>Speicher: ${speicher} kWh
    <br>Grundpreis: ${document.getElementById("grundpreis").value} €
    <br>Stromkosten/Jahr: €${(V*document.getElementById("preis_kwh").value/100).toFixed(2)}
    <br><br><strong>Endpreis (brutto): €${sum.toFixed(2)}</strong>
  `;
});
