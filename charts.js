const charts = {};

// Farben
const COLOR_DIREKT = '#f6ff54';
const COLOR_SPEICHER = '#ff9354';
const COLOR_NETZ = '#e8e2e1';
const COLOR_EINSPEISUNG = '#54daff';
const COLOR_AUTARKIELINE = '#facc15';

// Standard-Tooltip mit Prozentanzeige für Pie-Charts
function getPieOptions(dataArray) {
  return {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const data = dataArray;
            const total = data.reduce((sum, val) => sum + val, 0);
            const value = context.raw;
            const percent = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percent} %`;
          }
        }
      }
    }
  };
}

function createOrUpdateChart(id, config) {
  if (charts[id]) {
    charts[id].destroy();
  }
  const ctx = document.getElementById(id);
  if (ctx) {
    charts[id] = new Chart(ctx, config);
  }
}

// Autarkie
export function renderAutarkiePie(monatlich) {
  const summe = monatlich.reduce((a, b) => ({
    direkt: a.direkt + b.direkt,
    speicher: a.speicher + b.speicher,
    bezug: a.bezug + b.bezug
  }), { direkt: 0, speicher: 0, bezug: 0 });

  const daten = [summe.direkt, summe.speicher, summe.bezug];
  const autarkieGesamt = ((summe.direkt + summe.speicher) / (summe.direkt + summe.speicher + summe.bezug)) * 100;
  document.getElementById("summaryAutarkie").textContent = `Autarkiegrad: ${autarkieGesamt.toFixed(1)} %`;

  createOrUpdateChart("chartAutarkie", {
    type: 'pie',
    data: {
      labels: ['Direkt', 'Speicher', 'Netzbezug'],
      datasets: [{
        data: daten,
        backgroundColor: [COLOR_DIREKT, COLOR_SPEICHER, COLOR_NETZ]
      }]
    },
    options: getPieOptions(daten)
  });
}

// Eigenverbrauch
export function renderEigenverbrauchPie(monatlich) {
  const summe = monatlich.reduce((a, b) => ({
    direkt: a.direkt + b.direkt,
    speicher: a.speicher + b.speicher,
    einspeisung: (a.einspeisung || 0) + (b.einspeisung || 0)
  }), { direkt: 0, speicher: 0, einspeisung: 0 });

  const daten = [summe.direkt, summe.speicher, summe.einspeisung];
  const eigenverbrauchsquote = ((summe.direkt + summe.speicher) / (summe.direkt + summe.speicher + summe.einspeisung)) * 100;
  document.getElementById("summaryEigenverbrauch").textContent = `Eigenverbrauchsanteil: ${eigenverbrauchsquote.toFixed(1)} %`;

  createOrUpdateChart("chartEigenverbrauch", {
    type: 'pie',
    data: {
      labels: ['Direktverbrauch', 'Speichernutzung', 'Einspeisung'],
      datasets: [{
        data: daten,
        backgroundColor: [COLOR_DIREKT, COLOR_SPEICHER, COLOR_EINSPEISUNG]
      }]
    },
    options: getPieOptions(daten)
  });
}

// Tagesstack
export function renderTagesStack(tagesprofil) {
  const labels = Array.from({ length: 24 }, (_, i) => i + 'h');

  createOrUpdateChart("chartTagesverbrauch", {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Direkt',
          data: tagesprofil.map(t => t.direkt),
          backgroundColor: COLOR_DIREKT,
          stack: 'verbrauch'
        },
        {
          label: 'Speicher',
          data: tagesprofil.map(t => t.speicher),
          backgroundColor: COLOR_SPEICHER,
          stack: 'verbrauch'
        },
        {
          label: 'Netzbezug',
          data: tagesprofil.map(t => t.bezug),
          backgroundColor: COLOR_NETZ,
          stack: 'verbrauch'
        }
      ]
    },
    options: {
      responsive: true,
      scales: { x: { stacked: true }, y: { stacked: true } }
    }
  });
}

// Jahresstack
export function renderJahresStack(monatlich) {
  const labels = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  createOrUpdateChart("chartJahresverbrauch", {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Direkt',
          data: monatlich.map(m => m.direkt),
          backgroundColor: COLOR_DIREKT,
          stack: 'verbrauch'
        },
        {
          label: 'Speicher',
          data: monatlich.map(m => m.speicher),
          backgroundColor: COLOR_SPEICHER,
          stack: 'verbrauch'
        },
        {
          label: 'Netzbezug',
          data: monatlich.map(m => m.bezug),
          backgroundColor: COLOR_NETZ,
          stack: 'verbrauch'
        }
      ]
    },
    options: {
      responsive: true,
      scales: { x: { stacked: true }, y: { stacked: true } }
    }
  });
}

// Autarkie-Verlauf
export function renderAutarkieLine(monatlich) {
  const labels = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const daten = monatlich.map(m => ((m.direkt + m.speicher) / (m.direkt + m.speicher + m.bezug)) * 100);

  createOrUpdateChart("chartAutarkieVerlauf", {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Autarkiegrad (%)',
        data: daten,
        borderColor: COLOR_AUTARKIELINE,
        backgroundColor: 'transparent'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          max: 100,
          min: 0,
          ticks: { callback: v => v + '%' }
        }
      }
    }
  });
}

// Jahresertrag
export function renderJahresErtrag(monatlich) {
  const labels = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  createOrUpdateChart("chartVerwertung", {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Eigenverbrauch (Direkt + Speicher)',
          data: monatlich.map(m => m.direkt + m.speicher),
          backgroundColor: COLOR_DIREKT,
          stack: 'gesamt'
        },
        {
          label: 'Einspeisung',
          data: monatlich.map(m => m.einspeisung || 0),
          backgroundColor: COLOR_EINSPEISUNG,
          stack: 'gesamt'
        }
      ]
    },
    options: {
      responsive: true,
      scales: { x: { stacked: true }, y: { stacked: true } }
    }
  });
}
