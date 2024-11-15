"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Tab {
  title: string;
  image: string;
}

interface MobileImageTabsProps {
  tabs: Tab[];
}

const MobileImageTabs: React.FC<MobileImageTabsProps> = ({ tabs }) => {
  const [active, setActive] = useState(0);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % tabs.length);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % tabs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tabs.length]);
  
  return (
    <div className="w-full flex-col">
      <div className="h-[300px] w-full overflow-hidden">
        <Image
          src={tabs[active]!.image}
          alt={tabs[active]!.title}
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-2 flex items-center justify-center">
        <button onClick={handlePrev} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <span className=" font-bold">{tabs[active]!.title}</span>
        <button onClick={handleNext} className="p-2">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default MobileImageTabs;
