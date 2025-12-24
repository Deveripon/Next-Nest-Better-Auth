/**
 * Transform main image data to flatten nested image structure
 */
export function transformMainImage(mainImage: any): any {
  if (!mainImage) return null;
  return {
    ...mainImage,
    url: mainImage.image?.url,
    imageId: mainImage.image?.id,
  };
}

/**
 * Transform gallery images to flatten nested image structure
 */
export function transformGalleryImages(galleryImages: any[]): any[] {
  if (!galleryImages?.length) return [];

  return galleryImages.map((img: any) => ({
    ...img,
    url: img.image?.url,
    imageId: img.image?.id,
  }));
}

// This object is used to select specific fields from the database to be returned
export const imageSelectObject = {
  id: true,
  url: true,
  thumbnail: true,
  originalName: true,
  size: true,
  format: true,
  width: true,
  height: true,
  cloudinaryId: true,
};
