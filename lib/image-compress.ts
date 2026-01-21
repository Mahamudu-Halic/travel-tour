import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    initialQuality: 0.8,
  };

  const compressedBlob = await imageCompression(file, options);

  const compressedFile = new File(
    [compressedBlob],
    file.name,
    {
      type: compressedBlob.type,
      lastModified: Date.now(),
    }
  );


  if (compressedFile.size > 5 * 1024 * 1024) {
    throw new Error("Image could not be compressed below 5MB");
  }

  return compressedFile;
}
