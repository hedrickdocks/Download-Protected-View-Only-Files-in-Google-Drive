# Protected PDF Exporter / Downloader

A lightweight, client-side JavaScript utility to extract and export view-only / protected PDF documents from web previewers.

> [!WARNING]
> **Disclaimer & Ethical Usage:**  
> This script is intended for educational purposes only. Please respect copyright laws and the Terms of Service of Google Drive. Use this script at your own caution and discretion. Users are solely responsible for complying with applicable laws, intellectual property rights, and platform terms; the author assumes no responsibility for unauthorized access, duplication, or misuse.

---

## Usage

1. Navigate to the view-only document in your browser.
2. Scroll down slightly to make sure the first page / placeholder image is visible and loaded.
3. Open Developer Tools Console
- **Windows / Linux:** Press `F12` or `Ctrl + Shift + I`, then click on the **Console** tab.
- **macOS:** Press `Cmd + Option + I`, then click on the **Console** tab.
4. Type `allow pasting` in the console.
5. Paste the script and hit Enter.
6. Wait for Extraction. The script will automatically scroll through the pages and load each image. Do not close or navigate away from the tab during this process.
7. Save as PDF

Once saved, simply **refresh the browser tab** (`F5` or `Ctrl + R` / `Cmd + R`) to restore the original viewer.

---

## Troubleshooting

- **Error: "No images found. Scroll slightly to load the first placeholder."**
  - Make sure the document previewer is fully open on the screen and scroll down slightly past the first page before running the script.
- **Error: "Couldn't identify CSS class name"**
  - The hosting web page layout or DOM hierarchy may have changed. Inspect the page DOM to ensure page container elements have identifiable classes.
- **Blank or Missing Pages in Output:**
  - If network speeds are slow, increase the delay in the loop (line 44 in `script.js` from `400` to `800` or higher) to allow more time for blob rendering.
- **High Memory Usage on Large Documents:**
  - For very large documents (e.g., 200+ pages), browser memory usage will increase as high-resolution images are kept in memory. Ensure sufficient system RAM is available.

---

## Disclaimer

This script is intended for personal backups, archiving, and accessibility purposes for documents you have authorized access to view. Always respect copyright, intellectual property rights, and terms of service of the respective platform.