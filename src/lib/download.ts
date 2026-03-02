/**
 * Downloads a file by fetching it as a blob and triggering a save dialog.
 * Works for cross-origin URLs where <a download> is ignored by browsers.
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
