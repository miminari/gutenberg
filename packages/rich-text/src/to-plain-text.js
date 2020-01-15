const { DOMParser } = window;

/**
 * Removes any HTML tags from the provided string.
 *
 * @param {string} html The string containing html.
 *
 * @return {string} The text content with any html removed.
 */
export function toPlainText( html ) {
	if ( ! html ) {
		return '';
	}

	const document = new DOMParser().parseFromString( html, 'text/html' );
	return document.body.textContent || '';
}
