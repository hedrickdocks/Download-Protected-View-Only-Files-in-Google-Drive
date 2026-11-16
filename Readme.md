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
```
(async function () {
    const IMG_SELECTOR = 'img[src^="blob:"]';

    const getPages = function () {
        const images = [...document.querySelectorAll(IMG_SELECTOR)];
        if (images.length === 0) throw new Error("No images found. Scroll slightly to load the first placeholder.");
        const firstPage = images[0].parentElement;
        const className = firstPage.className;
        if (!className || className.match(/\s/)) throw new Error("Couldn't identify CSS class name");
        return [...firstPage.parentElement.querySelectorAll(`:scope > .${CSS.escape(className)}`)];
    };

    const getImage = async function (page) {
        const img = page.querySelector(IMG_SELECTOR) || await loadImage(page);
        if (img.complete) return img;
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
        });
    };

    const loadImage = function (page) {
        return new Promise((resolve) => {
            const mutationCallback = (_, observer) => {
                const img = page.querySelector(IMG_SELECTOR);
                if (img) { observer.disconnect(); resolve(img); }
            };
            new MutationObserver(mutationCallback).observe(page, { childList: true, attributes: true, subtree: true });
            page.scrollIntoView();
        });
    };

    try {
        console.log("Extracting pages... Please wait.");
        const imageUrls = [];

        for (const page of getPages()) {
            const img = await getImage(page);
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext("2d").drawImage(img, 0, 0);
            imageUrls.push(canvas.toDataURL("image/jpeg", 1.0));
            await new Promise(r => setTimeout(r, 400));
        }

        console.log("Formatting document for PDF export...");

        const styleEl = document.createElement('style');
        styleEl.textContent = `
      @media print { 
        @page { margin: 0; }
        body { margin: 0; } 
        img { width: 100%; height: 100%; object-fit: contain; page-break-after: always; break-after: page; } 
      }
    `;
        document.head.appendChild(styleEl);

        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        document.body.style.backgroundColor = '#525659';
        document.body.style.margin = '0';
        document.body.style.display = 'flex';
        document.body.style.flexDirection = 'column';
        document.body.style.alignItems = 'center';

        imageUrls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100%';
            img.style.marginBottom = '10px';
            img.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5)';
            document.body.appendChild(img);
        });

        setTimeout(() => {
            window.print();
            console.log("Refresh this page to restore the standard viewer.");
        }, 1000);

    } catch (e) {
        console.error(e);
        alert(e.message);
    }
})();
```
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