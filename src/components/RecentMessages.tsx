import React from "react";
import { trpc } from "../utils/trpc";
import SectionWrapper from "./shared/SectionWrapper";

export const RecentMessages = () => {
  const { data: messages } = trpc.useQuery(["messages.getMessages"]);
  const { data: contacts } = trpc.useQuery(["sheets.getContacts"]);

  const [showRecentMessages, setShowRecentMessages] =
    React.useState<boolean>(false);

  // maps the 'from' to the user
  const responders = React.useMemo(() => {
    if (!messages || !contacts) {
      return [];
    }

    return messages.map((m) => {
      const n = contacts.find((c) => {
        return `+1${c.phone?.replaceAll("-", "")}` === m.from;
      });

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
    <>
      <button
        type="button"
        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={() => setShowRecentMessages(!showRecentMessages)}
      >
        {showRecentMessages ? "Hide Messages" : "Show Messages"}
      </button>
      {showRecentMessages && (
        <SectionWrapper name="Recent Messages">
          <div className="overflow-y-auto max-h-96 p-2">
            <span className="text-blue-500">(Newest to Oldest)</span>
            {responders.map((m, i) => (
              <div key={`${m.from}-${i}`}>
                <span className="text-violet-500">{m.from}</span>: {m.body}
              </div>
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  );
};
