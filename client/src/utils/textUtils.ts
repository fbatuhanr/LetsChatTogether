export const textClip = (str: string, maxLength: number = 8): string => {
    return str.length > maxLength 
        ? str.slice(0, maxLength) + '..' 
        : str;
}