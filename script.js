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
        let count = 1;
        for (const page of getPages()) {
            const img = await getImage(page);
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext("2d").drawImage(img, 0, 0);

            const a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpeg", 1.0);
            a.download = `page_${count.toString().padStart(3, '0')}.jpg`;
            a.click();

            await new Promise(r => setTimeout(r, 750));
            count++;
        }
        console.log("Finished downloading all pages.");
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
})();