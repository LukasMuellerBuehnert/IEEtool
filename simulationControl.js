// simulationControl.js
import { berechneTag, berechneJahr } from './simulation.js';
import {
  renderAutarkiePie, renderEigenverbrauchPie, renderTagesStack,
  renderJahresStack, renderAutarkieLine, renderJahresErtrag
} from './charts.js';

export function calcRenderAllGraphs(jahresVerbrauch, pvLeistung, speicherKapazitaet) {
  const { monatlich } = berechneJahr(jahresVerbrauch, pvLeistung, speicherKapazitaet);

  renderAutarkiePie(monatlich, 'chartAutarkie');
  renderEigenverbrauchPie(monatlich, 'chartEigenverbrauch');
  renderJahresStack(monatlich, 'chartJahresverbrauch');
  renderTagesStack(tagesprofil, 'chartTagesverbrauch');
  renderAutarkieLine(monatlich, 'chartAutarkieVerlauf');
  renderJahresErtrag(monatlich, 'chartVerwertung');
}

export function calcRenderDailyGraph(jahresVerbrauch, pvLeistung, speicherKapazitaet, tag) {
  const tagesprofil = berechneTag(jahresVerbrauch, pvLeistung, speicherKapazitaet, tag);
  renderTagesStack(tagesprofil, 'chartTagesverbrauch');
}
