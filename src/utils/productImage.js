const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23111'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-family='Arial,sans-serif' font-size='72' font-weight='700'%3ETJG%3C/text%3E%3C/svg%3E";

export function getProductImage(produto, fallback = PLACEHOLDER_IMAGE) {
  const imageUrl = produto?.imagemUrl || produto?.imagem_url || "";
  const cleanUrl = String(imageUrl).trim();

  return cleanUrl || fallback;
}

export function handleImageFallback(event, fallback = PLACEHOLDER_IMAGE) {
  if (event.currentTarget.src !== fallback) {
    event.currentTarget.src = fallback;
  }
}
