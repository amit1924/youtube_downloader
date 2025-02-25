// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { RotateCw } from "lucide-react";

// export default function Downloader() {
//   const [url, setUrl] = useState("");
//   const [resolution, setResolution] = useState("720p");
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleDownload = async (format) => {
//     if (!url) return alert("Please enter a YouTube URL.");
//     setLoading(true);
//     setProgress(0);
//     try {
//       const response = await axios.get(`http://localhost:5000/download`, {
//         params: { url, res: resolution, format },
//         responseType: "blob",
//         onDownloadProgress: (progressEvent) => {
//           const total = progressEvent.total;
//           const current = progressEvent.loaded;
//           const percentCompleted = Math.round((current / total) * 100);
//           setProgress(percentCompleted);
//         },
//       });

//       const blob = new Blob([response.data]);
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = format === "mp3" ? "audio.mp3" : "video.mp4";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Download failed", error);
//       alert("Download failed. Try again.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full"
//       >
//         <h1 className="text-3xl font-extrabold text-center text-purple-600 mb-6">
//           🎬 YouTube Video Downloader
//         </h1>

//         <motion.input
//           whileFocus={{ scale: 1.05 }}
//           type="text"
//           placeholder="Paste YouTube URL here"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
//         />

//         <motion.select
//           whileFocus={{ scale: 1.05 }}
//           value={resolution}
//           onChange={(e) => setResolution(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
//         >
//           <option value="480p">480p</option>
//           <option value="720p">720p</option>
//           <option value="1080p">1080p</option>
//         </motion.select>

//         <div className="flex justify-between space-x-4">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleDownload("mp4")}
//             className={`bg-purple-500 text-white font-semibold p-3 rounded-lg w-1/2 hover:bg-purple-600 transition ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={loading}
//           >
//             Download MP4
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleDownload("mp3")}
//             className={`bg-green-500 text-white font-semibold p-3 rounded-lg w-1/2 hover:bg-green-600 transition ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={loading}
//           >
//             Download MP3
//           </motion.button>
//         </div>

//         {loading && (
//           <div className="mt-6">
//             <motion.div
//               className="w-full bg-gray-200 rounded-lg h-4 overflow-hidden"
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ ease: "easeInOut", duration: 0.5 }}
//             >
//               <div
//                 className="h-full bg-purple-500 text-white text-center text-sm leading-4"
//                 style={{ width: `${progress}%` }}
//               >
//                 {progress}%
//               </div>
//             </motion.div>
//             <div className="flex justify-center mt-4">
//               <RotateCw className="w-10 h-10 text-purple-500 animate-spin" />
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState("720p");
  const [bitrate, setBitrate] = useState("192kbps");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async (format) => {
    if (!url) return alert("Please enter a YouTube URL.");
    setLoading(true);
    setProgress(0);
    try {
      const response = await axios.get(`http://localhost:5000/download`, {
        params: { url, res: resolution, format, bitrate },
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const current = progressEvent.loaded;
          const percentCompleted = Math.round((current / total) * 100);
          setProgress(percentCompleted);
        },
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = format === "mp3" ? "audio.mp3" : "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-extrabold text-center text-purple-600 mb-6">
          🎬 YouTube Video Downloader
        </h1>

        <motion.input
          whileFocus={{ scale: 1.05 }}
          type="text"
          placeholder="Paste YouTube URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
        />

        <motion.select
          whileFocus={{ scale: 1.05 }}
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
        >
          <option value="360p">360p</option>
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
          <option value="2160p">4K (2160p)</option>
        </motion.select>

        {resolution === "mp3" && (
          <motion.select
            whileFocus={{ scale: 1.05 }}
            value={bitrate}
            onChange={(e) => setBitrate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
          >
            <option value="128kbps">128kbps</option>
            <option value="192kbps">192kbps</option>
            <option value="320kbps">320kbps</option>
          </motion.select>
        )}

        <div className="flex justify-between space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDownload("mp4")}
            className={`bg-purple-500 text-white font-semibold p-3 rounded-lg w-1/2 hover:bg-purple-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Download MP4
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDownload("mp3")}
            className={`bg-green-500 text-white font-semibold p-3 rounded-lg w-1/2 hover:bg-green-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Download MP3
          </motion.button>
        </div>

        {loading && (
          <div className="mt-6">
            <motion.div
              className="w-full bg-gray-200 rounded-lg h-4 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              <div
                className="h-full bg-purple-500 text-white text-center text-sm leading-4"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </motion.div>
            <div className="flex justify-center mt-4">
              <RotateCw className="w-10 h-10 text-purple-500 animate-spin" />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
