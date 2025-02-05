import { Locale } from "antd/es/locale";
import { useEffect, useState } from "react";

export const useAntdLocale = (language: string) => {
  const [locale, setLocale] = useState<Locale>();

  useEffect(() => {
    if (language.split("-")[0] === "ru") {
      import("antd/lib/locale/ru_RU").then((ruRU) => {
        setLocale(ruRU.default);
      });
    } else {
      setLocale(undefined);
    }
  }, [language]);

  return locale;
};
