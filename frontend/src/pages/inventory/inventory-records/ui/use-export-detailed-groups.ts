import {
  InventoryRecordsDetailedGroupsDocument,
  InventoryRecordsFiltrationInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import type { Cell } from "write-excel-file";

export const useExportDetailedGroups = () => {
  const { t } = useTranslation();

  const [executeDetailedGroupsQuery] = useLazyQuery(
    InventoryRecordsDetailedGroupsDocument,
    { fetchPolicy: "network-only" }
  );

  return async (filtration: InventoryRecordsFiltrationInput) => {
    const { data, error } = await executeDetailedGroupsQuery({
      variables: { filtration },
    });

    if (error) {
      throw error;
    }

    if (!data) {
      return;
    }

    const rows: [Cell, Cell, Cell, Cell, Cell][] = [];

    rows.push([
      { value: t("location"), fontWeight: "bold", wrap: true },
      { value: t("quantity"), fontWeight: "bold", wrap: true },
      { value: t("asset"), fontWeight: "bold", wrap: true },
      { value: t("serialNumber"), fontWeight: "bold", wrap: true },
      { value: t("responsible"), fontWeight: "bold", wrap: true },
    ]);

    data.inventoryRecordsDetailedGroups.forEach((row) => {
      rows.push([
        { value: row.location.name, type: String, wrap: true },
        { value: row.count, type: Number, wrap: true },
        { value: row.asset.name, type: String, wrap: true },
        { value: row.serialNumbers.join("; "), type: String, wrap: true },
        { value: row.responsible.name, type: String, wrap: true },
      ]);
    });

    const writeXlsxFile = (await import("write-excel-file")).default;

    writeXlsxFile(rows, {
      columns: [
        { width: 30 },
        { width: 15 },
        { width: 30 },
        { width: 40 },
        { width: 40 },
      ],
      fileName: "report.xlsx",
    });
  };
};
