export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_MB = 10;
const MIN_SIDE = 200;

/** Checks type, size and that the browser can really decode the image. */
export async function validateImageFile(file) {
  if (!file) return { ok: false, error: 'No file was selected.' };
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Please choose a JPG, PNG or WebP photo.' };
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return { ok: false, error: `That photo is larger than ${MAX_MB} MB. Please choose a smaller one.` };
  }
  if (file.size === 0) return { ok: false, error: 'That file looks empty.' };

  const url = URL.createObjectURL(file);
  try {
    const { width, height } = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error('decode'));
      img.src = url;
    });
    if (Math.min(width, height) < MIN_SIDE) {
      return { ok: false, error: `The photo is too small. Use one at least ${MIN_SIDE}px wide.` };
    }
    return { ok: true, url };
  } catch {
    URL.revokeObjectURL(url);
    return { ok: false, error: "We couldn't open that image. Try a different photo." };
  }
}
