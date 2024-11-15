"use client";

import { ModelParam } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useTranslation } from "react-i18next";
import { LanguageLocale } from "~/components/user/settings/LanguageSelector";
import { ParamType, ParamTypeFormat } from "../playground/ParamInputForm";

const ApiParamsTable = ({ params }: { params: ModelParam[] }) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;

  return (
    <>
      {params && params.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-foreground">
                {t("Parameter Name")}
              </TableHead>
              <TableHead className="font-bold text-foreground">
                {t("Type")}
              </TableHead>
              <TableHead className="min-w-[8rem] font-bold text-foreground">
                {t("Required")}
              </TableHead>
              <TableHead className="min-w-[12rem] font-bold text-foreground">
                {t("Default Value")}
              </TableHead>
              <TableHead className="min-w-[12rem] font-bold text-foreground">
                {t("Description")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span>{item.name}</span>
                </TableCell>
                <TableCell>
                  <span>
                    {item.type === ParamType.String &&
                    item.format === ParamTypeFormat.File
                      ? "string(file url)"
                      : item.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span>{item.required ? t("true") : ""}</span>
                </TableCell>
                <TableCell className="max-w-[20vw]">
                  {item.defaultValue}
                </TableCell>
                <TableCell className="max-w-[40vw]">
                  {currentLocale === LanguageLocale.English
                    ? item.desc
                    : item.descZh ?? item.desc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-10 text-center text-sm">
          {t("No data available")}
        </div>
      )}
    </>
  );
};

export default ApiParamsTable;
