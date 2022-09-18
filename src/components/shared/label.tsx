import React from 'react';

interface LabelProps {
  id: string;
  title: string;
}

export const Label = ({ id, title }: LabelProps) => (
  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
    {title}
  </label>
);
