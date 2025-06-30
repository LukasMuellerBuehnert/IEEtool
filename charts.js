// charts.js

const charts = {};

function createOrUpdateChart(id, config) {
  if (charts[id]) {
    charts[id].destroy();
  }
  const ctx = document.getElementById(id);
  if (ctx) {
    charts[id] = new Chart(ctx, config);
  }
}

export function renderAutarkiePie(monatlich) {
  const summe = monatlich.reduce((a, b) => ({
    direkt: a.direkt + b.direkt,
    speicher: a.speicher + b.speicher,
    bezug: a.bezug + b.bezug
  }), { direkt: 0, speicher: 0, bezug: 0 });

  const autarkieGesamt = ((summe.direkt + summe.speicher) / (summe.direkt + summe.speicher + summe.bezug)) * 100;
  document.getElementById("summaryAutarkie").textContent = `Autarkiegrad: ${autarkieGesamt.toFixed(1)} %`;
  
  createOrUpdateChart("chartAutarkie", {
    type: 'pie',
    data: {
      labels: ['Direkt', 'Speicher', 'Netzbezug'],
      datasets: [{
        data: [summe.direkt, summe.speicher, summe.bezug],
        backgroundColor: ['#fcb826', '#2f6fed', '#e8e2e1']
      }]
    }
  });
}

export function renderEigenverbrauchPie(monatlich) {
  const summe = monatlich.reduce((a, b) => ({
    direkt: a.direkt + b.direkt,
    speicher: a.speicher + b.speicher,
    einspeisung: (a.einspeisung || 0) + (b.einspeisung || 0)
  }), { direkt: 0, speicher: 0, einspeisung: 0 });

  const eigenverbrauchsquote = ((summe.direkt + summe.speicher) / (summe.direkt + summe.speicher + summe.einspeisung)) * 100;
  document.getElementById("summaryEigenverbrauch").textContent = `Eigenverbrauchsanteil: ${eigenverbrauchsquote.toFixed(1)} %`;

  createOrUpdateChart("chartEigenverbrauch", {
    type: 'pie',
    data: {
      labels: ['Direktverbrauch', 'Speichernutzung', 'Einspeisung'],
      datasets: [{
        data: [summe.direkt, summe.speicher, summe.einspeisung],
        backgroundColor: ['#fcb826', '#2f6fed', '#2dd6fc']
      }]
    }
  });
}

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
          backgroundColor: '#fcb826',
          stack: 'verbrauch'
        },
        {
          label: 'Speicher',
          data: tagesprofil.map(t => t.speicher),
          backgroundColor: '#2f6fed',
          stack: 'verbrauch'
        },
        {
          label: 'Netzbezug',
          data: tagesprofil.map(t => t.bezug),
          backgroundColor: '#e8e2e1',
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
          backgroundColor: '#fcb826',
          stack: 'verbrauch'
        },
        {
          label: 'Speicher',
          data: monatlich.map(m => m.speicher),
          backgroundColor: '#2f6fed',
          stack: 'verbrauch'
        },
        {
          label: 'Netzbezug',
          data: monatlich.map(m => m.bezug),
          backgroundColor: '#e8e2e1',
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
        borderColor: '#facc15',
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
          backgroundColor: '#fcb826',
          stack: 'gesamt'
        },
        {
          label: 'Einspeisung',
          data: monatlich.map(m => m.einspeisung || 0),
          backgroundColor: '#2dd6fc',
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
