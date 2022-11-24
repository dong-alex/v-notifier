import React from "react";

interface SentMessageStatusProps {
  isSuccess?: boolean;
  errorMessage?: any;
  sentCount?: number;
}

export const SentMessageStatus = ({
  isSuccess,
  errorMessage,
  sentCount,
}: SentMessageStatusProps) => {
  if (!isSuccess && !errorMessage) {
    return null;
  }

  const successText = `Text sent successfully to ${sentCount} individual(s) :)`;
  const errorText = "An error occurred when attempting to send text message :(";

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
