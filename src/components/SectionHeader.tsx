import React from 'react';

interface Props {
  name: string;
}


const SectionHeader = ({name}: Props) => {
  return (
    <h3 className="text-5xl md:text-[2rem] font-extrabold text-gray-700">
      <span className="text-violet-500">{name[0]}</span>
      {name.slice(1)}
    </h3>
  )
};

export default SectionHeader