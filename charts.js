// charts.js

export function renderAutarkiePie(monatlich) {
  const summe = monatlich.reduce((a, b) => ({
    direkt: a.direkt + b.direkt,
    speicher: a.speicher + b.speicher,
    bezug: a.bezug + b.bezug
  }), { direkt: 0, speicher: 0, bezug: 0 });

  new Chart(document.getElementById("chartAutarkie"), {
    type: 'pie',
    data: {
      labels: ['Direkt', 'Speicher', 'Netzbezug'],
      datasets: [{
        data: [summe.direkt, summe.speicher, summe.bezug],
        backgroundColor: ['#34d399', '#60a5fa', '#f87171']
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

  new Chart(document.getElementById("chartEigenverbrauch"), {
    type: 'pie',
    data: {
      labels: ['Direktverbrauch', 'Speichernutzung', 'Einspeisung'],
      datasets: [{
        data: [summe.direkt, summe.speicher, summe.einspeisung],
        backgroundColor: ['#34d399', '#60a5fa', '#fbbf24']
      }]
    }
  });
}

export function renderTagesStack(tagesprofil) {
  const labels = Array.from({ length: 24 }, (_, i) => i + 'h');

  new Chart(document.getElementById("chartTagesverbrauch"), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Direkt',
          data: tagesprofil.map(t => t.direkt),
          backgroundColor: '#34d399',
          stack: 'verbrauch'
        },
        {
          label: 'Speicher',
          data: tagesprofil.map(t => t.speicher),
          backgroundColor: '#60a5fa',
          stack: 'verbrauch'
        },
        {
          label: 'Netzbezug',
          data: tagesprofil.map(t => t.bezug),
          backgroundColor: '#f87171',
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

  new Chart(document.getElementById("chartJahresverbrauch"), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Direkt',
          data: monatlich.map(m => m.direkt),
          backgroundColor: '#34d399',
          stack: 'verbrauch'
        },
        {
          label: 'Speicher',
          data: monatlich.map(m => m.speicher),
          backgroundColor: '#60a5fa',
          stack: 'verbrauch'
        },
        {
          label: 'Netzbezug',
          data: monatlich.map(m => m.bezug),
          backgroundColor: '#f87171',
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

  new Chart(document.getElementById("chartAutarkieVerlauf"), {
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

  new Chart(document.getElementById("chartVerwertung"), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Eigenverbrauch (Direkt + Speicher)',
          data: monatlich.map(m => m.direkt + m.speicher),
          backgroundColor: '#4ade80',
          stack: 'gesamt'
        },
        {
          label: 'Einspeisung',
          data: monatlich.map(m => m.einspeisung || 0),
          backgroundColor: '#fbbf24',
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
