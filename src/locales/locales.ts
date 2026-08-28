import { pick } from "in-browser-language";
import ar from "./lang/ar.json";
import caES from "./lang/ca-ES.json";
import cs from "./lang/cs.json";
import de from "./lang/de.json";
import el from "./lang/el.json";
import enAU from "./lang/en-AU.json";
import enCA from "./lang/en-CA.json";
import enGB from "./lang/en-GB.json";
import es from "./lang/es.json";
import fa from "./lang/fa.json";
import fi from "./lang/fi.json";
import fr from "./lang/fr.json";
import ga from "./lang/ga.json";
import gd from "./lang/gd.json";
import gl from "./lang/gl.json";
import gu from "./lang/gu.json";
import hi from "./lang/hi.json";
import hu from "./lang/hu.json";
import id from "./lang/id.json";
import it from "./lang/it.json";
import ja from "./lang/ja.json";
import ko from "./lang/ko.json";
import kp from "./lang/kp.json";
import lt from "./lang/lt.json";
import lb from "./lang/lb.json";
import ne from "./lang/ne.json";
import nl from "./lang/nl.json";
import no from "./lang/no.json";
import ro from "./lang/ro.json";
import ru from "./lang/ru.json";
import sk from "./lang/sk.json";
import sr from "./lang/sr.json";
import sv from "./lang/sv.json";
import pl from "./lang/pl.json";
import pt from "./lang/pt.json";
import ptBR from "./lang/pt-BR.json";
import ta from "./lang/ta.json";
import th from "./lang/th.json";
import tr from "./lang/tr.json";
import vi from "./lang/vi.json";
import zhCN from "./lang/zh-CN.json";
import zhTW from "./lang/zh-TW.json";
import uk from "./lang/uk.json";

export const messages: Record<string, Record<string, string>> = {
  ar,
  "ca-ES": caES,
  cs,
  de,
  el,
  en: {},
  "en-AU": enAU,
  "en-CA": enCA,
  "en-GB": enGB,
  es,
  fa,
  fi,
  fr,
  ga,
  gd,
  gl,
  gu,
  hi,
  hu,
  id,
  it,
  ja,
  ko,
  kp,
  lt,
  lb,
  ne,
  nl,
  no,
  ro,
  ru,
  sk,
  sr,
  sv,
  pl,
  pt,
  "pt-BR": ptBR,
  ta,
  th,
  tr,
  vi,
  zh: {},
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  uk,
};

export const locales = Object.keys(messages);
export const defaultLocale = pick(locales, "en");
