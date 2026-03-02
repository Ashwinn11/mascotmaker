/**
 * Downloads a file via the server-side proxy to avoid CORS issues with R2 URLs.
 * Falls back to direct blob fetch for same-origin URLs.
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
  const a = document.createElement("a");
  a.href = proxyUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
