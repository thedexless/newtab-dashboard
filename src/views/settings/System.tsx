import React from "react";
import { FormattedMessage } from "react-intl";
import { db } from "../../db/state";
import { useKey } from "../../lib/db/react";
import TimeZoneInput from "../shared/timeZone/TimeZoneInput";

/** Locale code → native language name + English title hint. */
const LANGUAGES: { value: string; title: string; label: string }[] = [
  { value: "ar", title: "Arabic", label: "العربية" },
  { value: "ca-ES", title: "Catalan", label: "Català" },
  { value: "cs", title: "Czech", label: "Čeština" },
  { value: "de", title: "German", label: "Deutsch" },
  { value: "el", title: "Greek", label: "Ελληνικά" },
  { value: "en-AU", title: "English (Australian)", label: "English (AU)" },
  { value: "en-CA", title: "English (Canadian)", label: "English (CA)" },
  { value: "en-GB", title: "English (British)", label: "English (GB)" },
  { value: "en", title: "English (American)", label: "English (US)" },
  { value: "es", title: "Spanish", label: "Español" },
  { value: "fa", title: "Persian", label: "پارسی" },
  { value: "fr", title: "French", label: "Français" },
  { value: "he", title: "Hebrew", label: "עברית" },
  { value: "ga", title: "Gaeilge", label: "Gaeilge" },
  { value: "gd", title: "Scottish Gaelic", label: "Gàidhlig" },
  { value: "gl", title: "Galician", label: "Galego" },
  { value: "gu", title: "Gujarati", label: "ગુજરાતી" },
  { value: "hi", title: "Hindi", label: "हिन्दी" },
  { value: "hu", title: "Hungarian", label: "Magyar" },
  { value: "id", title: "Indonesian", label: "Indonesian" },
  { value: "it", title: "Italian", label: "Italiano" },
  { value: "ja", title: "Japanese", label: "日本語" },
  { value: "ko", title: "Korean", label: "한국어" },
  { value: "kp", title: "North Korean", label: "조선말" },
  { value: "lb", title: "Luxembourgish", label: "Lëtzebuergesch" },
  { value: "lt", title: "Lithuanian", label: "Lietuvių k." },
  { value: "ne", title: "Nepali", label: "Nepali" },
  { value: "nl", title: "Dutch", label: "Nederlands" },
  { value: "no", title: "Norwegian", label: "Norsk" },
  { value: "pl", title: "Polish", label: "Polski" },
  { value: "pt-BR", title: "Portuguese (Brazil)", label: "Português do Brasil" },
  { value: "pt", title: "Portuguese (Portugal)", label: "Português de Portugal" },
  { value: "ro", title: "Romanian", label: "Română" },
  { value: "ru", title: "Russian", label: "Русский" },
  { value: "sk", title: "Slovak", label: "Slovenčina" },
  { value: "sr", title: "Serbian", label: "Српски" },
  { value: "fi", title: "Finnish", label: "Suomi" },
  { value: "sv", title: "Swedish", label: "Svenska" },
  { value: "ta", title: "Tamil", label: "தமிழ்" },
  { value: "th", title: "Thai", label: "ไทย" },
  { value: "tr", title: "Turkish", label: "Türkçe" },
  { value: "vi", title: "Vietnamese", label: "Tiếng Việt" },
  { value: "zh-CN", title: "Simplified Chinese (China)", label: "中文（中国）" },
  { value: "zh-TW", title: "Traditional Chinese (Taiwan)", label: "中文（台灣）" },
  { value: "uk", title: "Ukrainian", label: "Українська" },
];

const labelStyle: React.CSSProperties = {
  alignItems: "center",
  display: "grid",
  gridGap: "0 0.5rem",
  gridTemplateColumns: "1fr 2fr",
  width: "100%",
  margin: 0,
};

const System: React.FC = () => {
  const [locale, setLocale] = useKey(db, "locale");
  const [timeZone, setTimeZone] = useKey(db, "timeZone");

  return (
    <div>
      <h2>
        <FormattedMessage
          id="settings"
          defaultMessage="Settings"
          description="Settings title"
        />
      </h2>

      <label style={labelStyle}>
        <span>Language</span>
        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value} title={lang.title}>
              {lang.label}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Time Zone
        <TimeZoneInput timeZone={timeZone} onChange={setTimeZone} />
      </label>
    </div>
  );
};

export default System;
