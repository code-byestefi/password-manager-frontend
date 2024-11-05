export const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `http://localhost:8080/${cleanPath}`;
  };