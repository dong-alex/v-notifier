import React, { ChangeEvent } from "react";
import { Label } from "@components/shared/label";
import { AUTHORIZED_USERS } from "config/authorizedUsers";

interface EmailDropdownProps {
  handleEmailChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const EmailDropdown = ({ handleEmailChange }: EmailDropdownProps) => (
  <div id="etransfer-dropdown" className="my-5">
    <Label id="etransfer-email" title="E-transfer email" />
    <select
      id="etransfer-email"
      onChange={handleEmailChange}
      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option selected disabled>
        Choose an email
      </option>
      {Array.from(AUTHORIZED_USERS).map((email: string, i) => (
        <option value={email} key={i}>
          {email}
        </option>
      ))}
    </select>
  </div>
);

export default EmailDropdown;
