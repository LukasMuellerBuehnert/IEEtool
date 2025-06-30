// simulationControl.js
import { simuliereTag, simuliereJahr } from './simulation.js';

import {
  renderAutarkiePie, renderEigenverbrauchPie, renderTagesStack,
  renderJahresStack, renderAutarkieLine, renderJahresErtrag
} from './charts.js';

export function calcRenderAllGraphs(jahresVerbrauch, pvLeistung, speicherKapazitaet, referenzTag) {
  const { monatlich, referenzTagesprofil } = simuliereJahr(jahresVerbrauch, pvLeistung, speicherKapazitaet, referenzTag);

  document.getElementById("summaryVerbrauch").textContent = jahresVerbrauch;
  document.getElementById("summaryLeistung").textContent = pvLeistung.toFixed(2);
  document.getElementById("summarySpeicher").textContent = speicherKapazitaet.toFixed(1);
  
  renderAutarkiePie(monatlich, 'chartAutarkie');
  renderEigenverbrauchPie(monatlich, 'chartEigenverbrauch');
  renderJahresStack(monatlich, 'chartJahresverbrauch');
  renderTagesStack(referenzTagesprofil, 'chartTagesverbrauch');
  renderAutarkieLine(monatlich, 'chartAutarkieVerlauf');
  renderJahresErtrag(monatlich, 'chartVerwertung');

  console.log("Graph updated")
}

export function calcRenderDailyGraph(jahresVerbrauch, pvLeistung, speicherKapazitaet, tag) {
  const eta = 0.95;

  // Tag davor simulieren, um Speicherstand zu aktualisieren
  const tagDavor = Math.max(0, tag - 1);
  const { speicherstand } = simuliereTag(tagDavor, jahresVerbrauch, pvLeistung, 0.4 * speicherKapazitaet, speicherKapazitaet, eta);

  // Jetzt den gewünschten Tag simulieren mit realistischem Speicherstand
  const { stundenDaten } = simuliereTag(tag, jahresVerbrauch, pvLeistung, speicherstand, speicherKapazitaet, eta);

  renderTagesStack(stundenDaten, 'chartTagesverbrauch');
  console.log("DailyGraph updated with carry-over Speicherstand");
}
