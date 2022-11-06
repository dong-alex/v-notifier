import React from "react";

interface ToastProps {
  countSent: number;
}

const SentMessageToast = ({ countSent }: ToastProps) => (
  <div
    id="toast-bottom-left"
    className="flex absolute bottom-5 left-5 items-center p-4 space-x-4 w-full max-w-xs text-gray-500 bg-white rounded-lg divide-x divide-gray-200 shadow space-x"
    role="alert"
  >
    <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-500 bg-green-100 rounded-lg">
      <svg
        aria-hidden="true"
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span className="sr-only">Check icon</span>
    </div>
    <span className="text-sm font-normal">{`Message sent successfully to ${countSent} persons`}</span>
  </div>
);

export default SentMessageToast;
