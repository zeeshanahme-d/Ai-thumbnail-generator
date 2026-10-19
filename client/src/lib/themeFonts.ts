const isGeist = (face: FontFace) => face.family.replace(/["']/g, "") === "Geist";

// Resolves once the public theme's Geist font has loaded (or failed), when text takes its final size.
// Neither document.fonts.ready nor document.fonts.load() can wait for it on the first visit: the
// @font-face rules arrive with the Google Fonts stylesheet, and until then there is nothing to wait for.
export function themeFontsLoaded(): Promise<void> {
    let isLoaded = false;
    document.fonts.forEach((face) => {
        if (isGeist(face) && face.status === "loaded") isLoaded = true;
    });
    if (isLoaded) return Promise.resolve();

    return new Promise((resolve) => {
        const onSettled = (event: FontFaceSetLoadEvent) => {
            if (!event.fontfaces.some(isGeist)) return;
            document.fonts.removeEventListener("loadingdone", onSettled);
            document.fonts.removeEventListener("loadingerror", onSettled);
            resolve();
        };
        document.fonts.addEventListener("loadingdone", onSettled);
        document.fonts.addEventListener("loadingerror", onSettled);
    });
}
