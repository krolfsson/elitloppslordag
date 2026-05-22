/** Elitloppet 2026 – vinnarodds (Unibet/ATG, maj 2026). Uppdateras manuellt. */
export type ElitloppetHorse = {
  number: number;
  name: string;
  odds: number;
  country: string;
  trend?: "up" | "down" | "flat";
};

export const ELITLOPPET_DATE_LABEL = "Söndag 31 maj · Solvalla";

const HORSES: ElitloppetHorse[] = [
  { number: 1, name: "Idao de Tillard", odds: 3.0, country: "FR", trend: "down" },
  { number: 2, name: "Inexess Bleu", odds: 4.5, country: "FR", trend: "flat" },
  { number: 3, name: "Go On Boy", odds: 7.0, country: "FR", trend: "flat" },
  { number: 4, name: "Allegiant", odds: 9.0, country: "SE", trend: "down" },
  { number: 5, name: "Don Fanucci Zet", odds: 11.0, country: "SE", trend: "flat" },
  { number: 6, name: "Dream Mine", odds: 15.0, country: "SE", trend: "up" },
  { number: 7, name: "Jabalpur", odds: 15.0, country: "IT", trend: "flat" },
  { number: 8, name: "Borups Victory", odds: 17.0, country: "SE", trend: "up" },
  { number: 9, name: "Jobspost", odds: 17.0, country: "SE", trend: "down" },
  { number: 10, name: "Keep Going", odds: 19.0, country: "FR", trend: "up" },
  { number: 11, name: "Charron", odds: 22.0, country: "NO", trend: "flat" },
  { number: 12, name: "A Fair Day", odds: 29.0, country: "SE", trend: "flat" },
  { number: 13, name: "Gio Cash", odds: 34.0, country: "NL", trend: "up" },
  { number: 14, name: "Francesco Zet", odds: 40.0, country: "SE", trend: "flat" },
  { number: 15, name: "Diva Ek", odds: 51.0, country: "IT", trend: "up" },
  { number: 16, name: "Josh Power", odds: 29.0, country: "SE", trend: "up" },
];

export const ELITLOPPET_HORSES: ElitloppetHorse[] = [...HORSES]
  .sort((a, b) => a.odds - b.odds)
  .map((h, i) => ({ ...h, number: i + 1 }));
