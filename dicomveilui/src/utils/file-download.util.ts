export const downloadFileToBrowser = (file:File | Blob, name?: string) => {
    const fileURL = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = fileURL;
    anchor.download = name ? name : 'file';
    document.body.appendChild(anchor);
    anchor.click();
    URL.revokeObjectURL(fileURL);
    document.body.removeChild(anchor);
}