import { SHARE_IMAGE_TRANSFORMATION } from "../constants/constants.js";
import { getClientOrigins } from "./helpers.js";

interface SharePageContent {
  title: string;
  description: string;
  imageUrl: string;
  pageUrl: string;
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// The app's page for one thumbnail, on the site's main origin.
export const getThumbnailPageUrl = (id: string) => `${getClientOrigins()[0]}/thumbnail/${id}`;

// Non-Cloudinary URLs are returned as is.
export const getShareImageUrl = (url: string) =>
  url.replace("/image/upload/", `/image/upload/${SHARE_IMAGE_TRANSFORMATION}/`);

// Open Graph tags for link previews. People who open the link are sent on to the app's page.
export function buildSharePage({ title, description, imageUrl, pageUrl }: SharePageContent) {
  const [safeTitle, safeDescription, safeImage, safePage] = [title, description, imageUrl, pageUrl].map(escapeHtml);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${safeTitle} | Eyecatch AI</title>
<meta name="description" content="${safeDescription}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Eyecatch AI">
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDescription}">
<meta property="og:image" content="${safeImage}">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${safePage}">
</head>
<body><a href="${safePage}">View this thumbnail on Eyecatch AI</a></body>
</html>`;
}
