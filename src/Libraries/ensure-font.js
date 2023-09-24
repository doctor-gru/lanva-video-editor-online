export const ensureFont = (fontName, fontUrl) => {
    if (typeof window !== 'undefined' && 'FontFace' in window) {
        // Create a new FontFace object with the specified font name and URL.
        const font = new FontFace(fontName, fontUrl);

        // Load the font asynchronously.
        return font.load().then(() => {
            // Once the font is loaded, add it to the list of available fonts in the document.
            document.fonts.add(font);
        });
    }

    // If the browser does not support FontFace, throw an error.
    throw new Error('browser does not support FontFace');
};