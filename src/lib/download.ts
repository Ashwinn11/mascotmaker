/**
 * Downloads a file. Supports both base64 data URIs and regular URLs.
 * For base64 strings, creates a blob URL directly.
 * For regular URLs, uses the server-side proxy to avoid CORS issues with R2 URLs.
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  const a = document.createElement("a");

  if (url.startsWith("data:")) {
    // Data URI — convert to blob for download
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } else {
    // Regular URL — use proxy
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    a.href = proxyUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
