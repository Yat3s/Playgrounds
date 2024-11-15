"use client";

import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { motion } from "framer-motion";
import { settings } from "~/lib/settings";

interface ImageSliderProps {
  images: {
    uri: string;
    desc: string;
  }[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  return (
    <motion.div
      className="z-20 w-full rounded-2xl bg-transparent"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              className="h-full w-full object-cover px-2 lg:px-4"
              src={image.uri}
              alt={image.desc}
            />
            <div className="absolute bottom-4 left-10 z-20 flex w-full flex-col gap-2 bg-black/5 pt-4 shadow-lg">
              <h2 className="w-fit rounded-md border border-white px-2 py-1 text-xs font-semibold lg:px-3 lg:text-sm">
                Model Showcase
              </h2>
              <p className="rounded-md font-semibold lg:text-xl">
                {image.desc}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
}
