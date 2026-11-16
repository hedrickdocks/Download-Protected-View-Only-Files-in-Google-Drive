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
        let docWidth = 0;
        let docHeight = 0;

        for (const page of getPages()) {
            const img = await getImage(page);

            if (docWidth === 0) {
                docWidth = img.naturalWidth;
                docHeight = img.naturalHeight;
            }

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
        @page { 
          margin: 0; 
          size: ${docWidth}px ${docHeight}px; /* Forces PDF to exactly match image dimensions */
        }
        body { 
          margin: 0; 
          padding: 0; 
          background: white; 
        } 
        img { 
          width: ${docWidth}px; 
          height: ${docHeight}px; 
          display: block; 
          margin: 0; 
          padding: 0;
          page-break-after: always; 
          break-after: page; 
        } 
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
            img.style.width = '100%';
            img.style.maxWidth = `${docWidth}px`;
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