import React from "react";
import { trpc } from "../utils/trpc";
import SectionHeader from "./SectionHeader";

export const RecentMessages = () => {
  const { data: messages } = trpc.useQuery(["messages.getMessages"]);
  const { data: contacts } = trpc.useQuery(["sheets.getContacts"]);

  // maps the 'from' to the user
  const responders = React.useMemo(() => {
    if (!messages || !contacts) {
      return [];
    }

    return messages.map((m) => {
      const n = contacts.find((c) => {
        return `+1${c.phone?.replaceAll("-", "")}` === m.from;
      });

      console.log(n);
      return {
        from: n?.name,
        body: m.body,
      };
    });
  }, [contacts, messages]);

  if (!messages) {
    return <div />;
  }

  return (
    <section id={"recent-messages"} className="flex flex-col">
      <SectionHeader name={"Recent Messages"} />
      <div className="flex flex-col mt-5">
        <span className="text-blue-500">(Newest to Oldest)</span>
        {responders.map((m, i) => (
          <div key={`${m.from}-${i}`}>
            <span className="text-violet-500">{m.from}</span>: {m.body}
          </div>
        ))}
      </div>
    </section>
  );
};
