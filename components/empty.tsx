import Image from "next/image";
import React from "react";

const Empty = ({ message = "no data found" }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full py-4 ">
      <Image
        src={"https://i.postimg.cc/qMWTJhS1/empty.png"}
        alt="not found"
        width={200}
        height={200}
        className="w-auto h-auto object-cover"
      />
      <p className="text-center font-bold text-gray-500">{message}</p>
    </div>
  );
};

export default Empty;
