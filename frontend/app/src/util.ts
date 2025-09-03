export const showError : (message ?: string, color ? : string) => {
  message : string;
  duration: number;
  color: string;
  position: 'top' | 'middle' | 'bottom';
} = (message = "Something went wrong!") => ({
            message: message,
            duration: 3000,
            color: 'danger',
            position: 'bottom',
});

const mimeTypes : { 
  [key : string] : string
} = {
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.tar': 'application/x-tar',
  '.csv': 'text/csv',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

// Function to get MIME type from file name
export function getMimeType(fileName : string) {
  // Extract the file extension (e.g., '.txt', '.jpg')
  const extension = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();

  // Return the MIME type from the map, or a fallback
  return mimeTypes['.' + extension] || 'application/octet-stream'; // Default to binary stream if not found
}