import { useEffect } from "react";
import "particles.js/particles";
const particlesJS = window.particlesJS;

const Particles = () => {
  useEffect(() => {
    particlesJS.load("particles-js", "/particles.json");
  }, []);

  return <div id="particles-js" className="absolute z-10 h-screen w-full" />;
};

export default Particles;
