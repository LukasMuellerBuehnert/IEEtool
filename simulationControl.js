// simulationControl.js
import { simuliereTag, simuliereJahr } from './simulation.js';

import {
  renderAutarkiePie, renderEigenverbrauchPie, renderTagesStack,
  renderJahresStack, renderAutarkieLine, renderJahresErtrag
} from './charts.js';

export function calcRenderAllGraphs(jahresVerbrauch, pvLeistung, speicherKapazitaet, referenzTag) {
  const { monatlich, referenzTagesprofil } = simuliereJahr(jahresVerbrauch, pvLeistung, speicherKapazitaet, referenzTag);

  document.getElementById("summaryVerbrauch").textContent = jahresVerbrauch + " kWh";
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
  const { stundenDaten } = simuliereTag(jahresVerbrauch, pvLeistung, 0.4*speicherKapazitaet, speicherKapazitaet, tag);
  renderTagesStack(stundenDaten, 'chartTagesverbrauch');

  console.log("DailyGraph updated")
}
