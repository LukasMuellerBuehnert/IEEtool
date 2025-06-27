import { verbrauchMonat, pvMonat, verbrauchTagProfil, pvTagProfil } from './masken.js';

export function simuliereTag(tagIndex, jahresVerbrauch, pvLeistung, speicherstand, speicherKapazitaet, eta = 0.9) {
  const monat = Math.floor(tagIndex / 30);
  const verbrauchTag = (jahresVerbrauch * verbrauchMonat[monat]) / 30;
  const pvTag = (pvLeistung * 1000 * pvMonat[monat]) / 30;

  const stundenDaten = Array(24).fill().map(() => ({
    verbrauch: 0,
    direkt: 0,
    speicher: 0,
    bezug: 0,
    einspeisung: 0
  }));

  for (let stunde = 0; stunde < 24; stunde++) {
    const v = verbrauchTag * verbrauchTagProfil[stunde];
    const p = pvTag * pvTagProfil[stunde];

    let deckung = 0, speicherBeitrag = 0, bezug = 0, einspeisung = 0;

    if (p >= v) {
      deckung = v;
      const ueberschuss = p - v;
      const aufnahme = Math.min(speicherKapazitaet - speicherstand, ueberschuss * eta);
      speicherstand += aufnahme;
      einspeisung = ueberschuss - aufnahme / eta;
    } else {
      deckung = p;
      const bedarf = v - p;
      if (speicherstand >= bedarf / eta) {
        speicherBeitrag = bedarf;
        speicherstand -= bedarf / eta;
      } else {
        speicherBeitrag = speicherstand * eta;
        speicherstand = 0;
        bezug = bedarf - speicherBeitrag;
      }
    }

    stundenDaten[stunde] = { verbrauch: v, direkt: deckung, speicher: speicherBeitrag, bezug, einspeisung };
  }

  return { stundenDaten, speicherstand };
}


export function simuliereJahr(jahresVerbrauch, pvLeistung, speicherKapazitaet, referenzTag = 60, eta = 0.9) {
  const monatlich = Array(12).fill(0).map(() => ({
    direkt: 0,
    speicher: 0,
    bezug: 0,
    einspeisung: 0,
    verbrauch: 0
  }));

  let referenzTagesprofil = null;
  let speicherstand = 0;

  for (let tag = 0; tag < 360; tag++) {
    const monat = Math.floor(tag / 30);
    const { stundenDaten, speicherstand: neuerStand } = simuliereTag(
      tag, jahresVerbrauch, pvLeistung, speicherstand, speicherKapazitaet, eta
    );
    speicherstand = neuerStand;

    for (const stunde of stundenDaten) {
      monatlich[monat].direkt += stunde.direkt;
      monatlich[monat].speicher += stunde.speicher;
      monatlich[monat].bezug += stunde.bezug;
      monatlich[monat].einspeisung += stunde.einspeisung;
      monatlich[monat].verbrauch += stunde.verbrauch;
    }

    if (tag === referenzTag) {
      referenzTagesprofil = stundenDaten;
    }
  }

  return {
    monatlich,           // 12 Einträge mit Verbrauchsaufteilung
    referenzTagesprofil  // 24 Stunden des gewünschten Tags
  };
}
