async function pageFunction(context) {
    const { page, request, log } = context;
    const title = await page.title();

    const imageSelector = 'img.featured-img.wp-post-image';

    // Wait for the image to load
    await page.waitForSelector(imageSelector);

    const imageUrl = await page.evaluate((selector) => {
        const imageElement = document.querySelector(selector);
        return imageElement ? imageElement.src : null;
    }, imageSelector);

    const dateSelector = 'span.meta-el.meta-date abbr.date.published';
    const postDate = await page.evaluate((selector) => {
        const dateElement = document.querySelector(selector);
        return dateElement ? dateElement.getAttribute('title') : null;
    }, dateSelector);

    // Use the selector for the <div> containing paragraphs
    const paragraphSelector = 'div.entry-content.clearfix.is-highlight-shares p';
    const paragraphs = await page.evaluate((selector) => {
        const paragraphElements = Array.from(document.querySelectorAll(selector));
        return paragraphElements.map((p) => p.textContent).join('\n');
    }, paragraphSelector);

    log.info(`URL: ${request.url} TITLE: ${title} IMAGE URL: ${imageUrl} POST DATE: ${postDate}`);

    return {
        url: request.url,
        title,
        imageUrl,
        postDate,
        paragraphs
    };
}
