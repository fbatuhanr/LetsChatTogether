export const textClip = (str: string, maxLength: number = 8): string => {

    const adjustedMaxLength = window.innerWidth < 1024 ? Math.floor(maxLength * 2) : maxLength;

    return str.length > adjustedMaxLength 
        ? str.slice(0, adjustedMaxLength) + '..' 
        : str;
}

export const numberClip = (number: string | number, maxSize: number = 9): string => {
    let num: number;

    if (typeof number === 'string') {
        num = Number(number);
        if (isNaN(num)) {
            return number;
        }
    } else if (typeof number === 'number') {
        num = number;
    } else {
        return String(number);
    }

    return num > maxSize ? `${maxSize}+` : `${num}`;
};