import React from "react";
import Downloader from "./components/Downloader";
import { motion } from "framer-motion";

const App = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fullscreen Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-0 left-0 w-full h-full -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2023/11/25/08/16/ai-generated-8411278_1280.jpg')",
          filter: "brightness(0.5)",
        }}
      ></motion.div>

      {/* Floating Icons in Four Corners */}
      {[
        "top-0 left-0",
        "top-0 right-0",
        "bottom-0 left-0",
        "bottom-0 right-0",
      ].map((position, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} m-4 pointer-events-none`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 3 }}
        >
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
            alt="YouTube Icon"
            className="w-20 h-20 opacity-30"
          />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        <Downloader />
      </div>
    </div>
  );
};

export default App;
