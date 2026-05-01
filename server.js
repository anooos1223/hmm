const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// 🔽 DOWNLOAD ROUTE
app.post("/download", (req, res) => {
    const { url, format } = req.body;

    if (!url) {
        return res.status(400).json({ error: "No URL provided" });
    }

    const id = Date.now();
    const ext = format === "mp3" ? "mp3" : "mp4";
    const filePath = path.join(DOWNLOAD_DIR, `video_${id}.${ext}`);

    let args = [];

    if (format === "mp3") {
        args = [
            "-x",
            "--audio-format", "mp3",
            "-o", filePath,
            url
        ];
    } else {
        args = [
            "-f", "best",
            "-o", filePath,
            url
        ];
    }

    const ytdlp = spawn("yt-dlp", args);

    ytdlp.stderr.on("data", (data) => {
        console.log("yt-dlp:", data.toString());
    });

    ytdlp.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Download failed" });
        }

        res.download(filePath, () => {
            fs.unlink(filePath, () => {});
        });
    });
});

app.listen(3000, () => {
    console.log("🚀 Running at http://localhost:3000");
});