import { useContacts } from "@components/hooks/useContacts";
import React from "react";
import { trpc } from "utils/trpc";

interface IPayTab {
  title: string;
}

export const PayTab: React.FC<IPayTab> = ({ title }) => {
  const { contacts } = useContacts(title);

  const { data } = trpc.useQuery(["sheets.getUnitCost", title]);

  const cost = React.useMemo(() => {
    if (!data || data.length === 0) {
      return "$0.00";
    }

    return data[0] ?? "$0.00";
  }, [data]);

  const pendings = React.useMemo(() => {
    if (!contacts) {
      return [];
    }

    return contacts
      .filter(({ pendingPay, paid }) => pendingPay && !paid)
      .map((c) => c.name);
  }, [contacts]);

  return (
    <section className="my-8">
      <div>{title}</div>
      <div className="flex flex-row gap-4">
        {pendings.map((name, i) => (
          <div key={i} className="participant">
            {name}
          </div>
        ))}
      </div>
      Total cost per person is <span className="cost">{cost}</span>
    </section>
  );
};
