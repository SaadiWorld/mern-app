const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5001/api/v1";

const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;

export const getImageUrl = (image: string): string => {
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const normalizedImage = image.replace(/\\/g, "/");
  const uploadsPathIndex = normalizedImage.lastIndexOf("/uploads/images/");
  const imagePath =
    uploadsPathIndex >= 0
      ? normalizedImage.slice(uploadsPathIndex)
      : normalizedImage.startsWith("/")
        ? normalizedImage
        : `/${normalizedImage}`;

  return `${API_ORIGIN}${imagePath}`;
};

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  places: `${API_BASE_URL}/places`,
  auth: {
    signup: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/sessions`,
  },
} as const;
