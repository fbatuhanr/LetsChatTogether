import { GiAquarius, GiAries, GiCancer, GiCapricorn, GiGemini, GiLeo, GiLibra, GiPisces, GiSagittarius, GiScorpio, GiTaurus, GiVirgo } from "react-icons/gi";

enum ZodiacSign {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces"
}

export const getZodiacSymbol = (sign: ZodiacSign): JSX.Element => {
  switch (sign) {
    case ZodiacSign.Aries:
      return <GiAries />; // Koç
    case ZodiacSign.Taurus:
      return <GiTaurus />; // Boğa
    case ZodiacSign.Gemini:
      return <GiGemini />; // İkizler
    case ZodiacSign.Cancer:
      return <GiCancer />; // Yengeç
    case ZodiacSign.Leo:
      return <GiLeo />; // Aslan
    case ZodiacSign.Virgo:
      return <GiVirgo />; // Başak
    case ZodiacSign.Libra:
      return <GiLibra />; // Terazi
    case ZodiacSign.Scorpio:
      return <GiScorpio />; // Akrep
    case ZodiacSign.Sagittarius:
      return <GiSagittarius />; // Yay
    case ZodiacSign.Capricorn:
      return <GiCapricorn />; // Oğlak
    case ZodiacSign.Aquarius:
      return <GiAquarius />; // Kova
    case ZodiacSign.Pisces:
      return <GiPisces />; // Balık
    default:
      return <span>?</span>;
  }
};

export const getZodiacSign = (date: Date): ZodiacSign => {

  const day = date.getDate()
  const month = date.getMonth() + 1

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZodiacSign.Aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZodiacSign.Taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZodiacSign.Gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZodiacSign.Cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZodiacSign.Leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZodiacSign.Virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZodiacSign.Libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZodiacSign.Scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZodiacSign.Sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZodiacSign.Capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZodiacSign.Aquarius;
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZodiacSign.Pisces;

  throw new Error("Invalid date");
}