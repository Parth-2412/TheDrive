export function getMimeTypeFromFilename(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
        'pdf': 'application/pdf',
        'txt': 'text/plain',
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'svg': 'image/svg+xml',
        'mp4': 'video/mp4',
        'mp3': 'audio/mp3',
        'wav': 'audio/wav',
        // Add more extensions and MIME types as needed
    };
    
    return mimeTypes[extension] || 'application/octet-stream';  // Default MIME type for unknown extensions
}