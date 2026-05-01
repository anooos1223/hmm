async function downloadVideo() {
    const url = document.getElementById("url").value;
    const loader = document.getElementById("loader");
    const status = document.getElementById("status");

    if (!url) {
        alert("Please enter a URL");
        return;
    }

    loader.style.display = "block";
    status.innerText = "Processing...";

    try {
        const response = await fetch("/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) throw new Error();

        const blob = await response.blob();
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.download = "video.mp4";
        link.click();

        status.innerText = "✅ Download complete!";
    } catch (error) {
        status.innerText = "❌ Failed to download";
    }

    loader.style.display = "none";
}