import React from "react";
import Image from "next/image";

const Logo = () => (
  <div className="flex items-center">
    <Image
      src="/volleyball-emoji.png"
      alt="Volleyball Emoji"
      width={25}
      height={25}
    />
    <span className="self-center ml-2 text-2xl font-semibold whitespace-nowrap">
      <span className="text-purple-300">V</span> Notifier
    </span>
  </div>
)

export default Logo