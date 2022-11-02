import React from "react";

export interface Responder {
  from?: string;
  body: string;
}

const MessageList = ({ responders }: { responders: Responder[] }) => (
  <div className="relative flex-1 px-4 sm:px-6">
    <div className="overflow-y-auto max-h-96 p-2">
      <span className="text-blue-500">(Newest to Oldest)</span>
      {responders.map((m, i) => (
        <div key={`${m.from}-${i}`}>
          <span className="text-violet-500">{m.from}</span>: {m.body}
        </div>
      ))}
    </div>
  </div>
);

export default MessageList;
