import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SectionHeader from "@components/SectionHeader";
import { trpc } from "utils/trpc";
import MessageList from "./messageList";
import Overlay from "./overlay";

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
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="h-10 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
        onClick={() => setShowRecentMessages(!showRecentMessages)}
      >
        Messages
      </button>
      <Transition.Root show={showRecentMessages} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setShowRecentMessages}
        >
          <Overlay />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white pb-6 shadow-xl">
                      <button
                        type="button"
                        className="w-5 h-5 self-end m-3 mr-5"
                        onClick={() => setShowRecentMessages(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <img src="/x-icon.svg" alt="Close icon" />
                      </button>
                      <div className="px-4 sm:px-6">
                        <SectionHeader name="Recent Messages" />
                      </div>
                      <MessageList responders={responders} />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
