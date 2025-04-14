import { useDelayedValue } from "react-when-ready";
import { Input } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useSearchInput = () => {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDelayedValue(searchText, 500) ?? searchText;

  const render = () => (
    <Input
      style={{ maxWidth: 300 }}
      placeholder={t("enterName")}
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      allowClear={true}
    />
  );

  return { searchText: debouncedSearchText, render } as const;
};
