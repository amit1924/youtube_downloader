const express = require("express");
const { exec } = require("youtube-dl-exec");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const puppeteer = require("puppeteer"); // Puppeteer for headless browser automation

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use /tmp directory for storing temporary downloads
const downloadsDir = path.resolve("/tmp", "downloads"); // Use /tmp directory
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Function to retrieve YouTube cookies using Puppeteer
async function getYouTubeCookies() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to YouTube and login
  await page.goto("https://youtube.com", { waitUntil: "networkidle2" });

  // You may want to simulate login here, or make sure you're logged in
  // If you are logged in, just extracting cookies will suffice
  const cookies = await page.cookies();
  await browser.close();

  return cookies;
}

// Download endpoint for video and audio
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  const resolution = req.query.res || "720p";
  const format = req.query.format || "video";
  const bitrate = req.query.bitrate || "192kbps";

  if (!videoUrl) {
    return res.status(400).send("Please provide a YouTube video URL.");
  }

  try {
    // Get cookies using Puppeteer
    const cookies = await getYouTubeCookies();

    const timestamp = Date.now();
    const baseFileName = `video-${timestamp}`;
    const videoPath = path.resolve(downloadsDir, `${baseFileName}.webm`);
    const outputFileName = `${baseFileName}.${format}`;
    const outputPath = path.resolve(downloadsDir, outputFileName);

    console.log("Starting video download...");

    // Pass cookies to yt-dlp using the --cookies flag
    await exec(videoUrl, {
      format: `bestvideo[height<=${resolution.replace(
        "p",
        ""
      )}]+bestaudio/best`,
      output: videoPath,
      cookies: cookies, // Pass cookies here
    });

    if (!fs.existsSync(videoPath)) {
      console.error("Video file not found after download.");
      return res.status(500).send("Video download failed.");
    }

    if (format === "video" || format === "webm") {
      console.log("Sending video file...");

      const stats = fs.statSync(videoPath); // Get file stats
      res.setHeader("Content-Length", stats.size); // Set Content-Length

      res.download(videoPath, `${baseFileName}.webm`, (err) => {
        if (err) {
          console.error("Video Download Error:", err);
          res.status(500).send("Failed to send video file.");
        }
        // Clean up files after sending
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      });
    } else if (format === "mp3" || format === "mp4") {
      console.log(`Converting video to ${format}...`);
      ffmpeg(videoPath)
        .toFormat(format)
        .audioBitrate(bitrate.replace("kbps", "k"))
        .on("end", () => {
          console.log(`${format.toUpperCase()} conversion finished.`);

          const stats = fs.statSync(outputPath); // Get file stats
          res.setHeader("Content-Length", stats.size); // Set Content-Length

          res.download(outputPath, outputFileName, (err) => {
            if (err) {
              console.error(`${format.toUpperCase()} Download Error:`, err);
              res
                .status(500)
                .send(`Failed to send ${format.toUpperCase()} file.`);
            }
            // Clean up files after sending
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          });
        })
        .on("error", (err) => {
          console.error(`Conversion to ${format.toUpperCase()} failed:`, err);
          res
            .status(500)
            .send(`Failed to convert video to ${format.toUpperCase()}.`);
        })
        .save(outputPath);
    }
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).send("Failed to download or convert video.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
