export const resizeImage = (file: File, targetHeight: number = 512): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target) {
                img.src = e.target.result as string;
            }
        };

        img.onload = () => {
            const originalWidth = img.width;
            const originalHeight = img.height;

            if (originalHeight <= targetHeight) {
                resolve(file);
                return;
            }

            const aspectRatio = originalWidth / originalHeight;
            const targetWidth = targetHeight * aspectRatio;

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name, { type: file.type }));
                    } else {
                        reject(new Error('Image could not be created.'));
                    }
                }, file.type);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};