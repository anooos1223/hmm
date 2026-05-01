async function download() {
    const url = document.getElementById("url").value;
    const format = document.getElementById("format").value;
    const status = document.getElementById("status");

    if (!url) {
        alert("Enter URL");
        return;
    }

    status.innerText = "⏳ Processing...";

    try {
        const res = await fetch("/download", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ url, format })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error);
        }

        const blob = await res.blob();
        const a = document.createElement("a");

        a.href = URL.createObjectURL(blob);
        a.download = format === "mp3" ? "audio.mp3" : "video.mp4";
        a.click();

        status.innerText = "✅ Done!";
    } catch (err) {
        status.innerText = "❌ " + err.message;
    }
}