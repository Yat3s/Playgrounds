"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Tab {
  title: string;
  image: string;
}

interface TabsProps {
  tabs: Tab[];
}

const ImageTabs: React.FC<TabsProps> = ({ tabs }) => {
  const [active, setActive] = useState(0);
  const [borderStyle, setBorderStyle] = useState({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    setActive(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prevActive) => (prevActive + 1) % tabs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tabs.length]);

  useEffect(() => {
    if (tabRefs.current[active]) {
      const tab = tabRefs.current[active];
      setBorderStyle({
        left: tab?.offsetLeft,
        width: tab?.offsetWidth,
        transition: "left 0.2s ease-in-out, width 0.1s ease-in-out"
      });
    }
  }, [active]);

  return (
    <div>
      <div
        className="relative flex w-full justify-around overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`whitespace-nowrap p-2 ${
              active === index
                ? "font-bold text-white"
                : "font-bold text-customGray"
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            ref={(el) => (tabRefs.current[index] = el)}
          >
            {tab.title}
          </button>
        ))}
        <div
          className="absolute bottom-0 h-1 bg-white transition-all duration-500 ease-in-out"
          style={borderStyle}
        />
      </div>
      <div className="flex w-full justify-center p-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`image-container transition-transform duration-500 ease-in-out ${
              active === index ? "slide-active" : "slide-inactive"
            }`}
            style={{
              display: active === index ? "block" : "none",
              width: "600px",
              height: "500px",
            }}
          >
            <Image
              src={tab.image}
              alt={tab.title}
              width={700}
              height={600}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTabs;
