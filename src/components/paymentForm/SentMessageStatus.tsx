import React from "react";

interface SentMessageStatusProps {
  isSuccess?: boolean;
  errorMessage?: any;
  sentCount?: number;
  type?: 'paid'
}

export const SentMessageStatus = ({
  isSuccess,
  errorMessage,
  sentCount,
  type,
}: SentMessageStatusProps) => {
  if (!isSuccess && !errorMessage) {
    return null;
  }

  const successText = type == 'paid' ? `Paid status set successfully for ${sentCount} individual(s) :)` : `Text sent successfully to ${sentCount} individual(s) :)`;
  const errorText = `An error occurred when attempting to ${type == 'paid' ? 'set paid status' : 'send text message'} :(`;

  return (
    <div
      className={`mt-3 text-sm ${
        isSuccess ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {isSuccess ? successText : errorText}
    </div>
  );
};
