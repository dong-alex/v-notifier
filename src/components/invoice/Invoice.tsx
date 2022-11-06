import SectionHeader from "@components/SectionHeader";
import React from "react";
import { useQueryClient } from "react-query";
import { useSpreadsheets } from "../hooks/useSpreadsheets";
import { PayTab } from "./PayTab";

// todo: make it look better
export const Invoice: React.FC = () => {
  const { spreadsheets } = useSpreadsheets();

  const queryClient = useQueryClient();

  return (
    <section id="unpaid">
      <SectionHeader name={"Unpaid"} />
      {queryClient.isFetching(undefined, { queryKey: "sheets.getUnitCost" }) ? (
        <div>Loading unpaid participants...</div>
      ) : (
        spreadsheets.map(({ title }, i) => {
          return <PayTab key={i} title={title} />;
        })
      )}
    </section>
  );
};
