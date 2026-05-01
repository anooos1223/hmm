const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/download", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send("No URL provided");
    }

    const fileName = `video_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, fileName);

    const command = `yt-dlp -f best -o "${filePath}" ${url}`;

    exec(command, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Download failed");
        }

        res.download(filePath, "video.mp4", (err) => {
            if (err) console.error(err);

            // delete file after sending
            fs.unlink(filePath, () => {});
        });
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});