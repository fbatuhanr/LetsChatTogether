import React from 'react';
import { getZodiacSign, getZodiacSymbol } from '../../utils/zodiacUtils';

type ZodiacProps = {
    dateOfBirth: string | Date
};

const Zodiac: React.FC<ZodiacProps> = ({ dateOfBirth }) => {

    const date = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth

    const zodiacSign = getZodiacSign(date)
    const zodiacSymbol = getZodiacSymbol(zodiacSign)

    return (
        <div className="flex items-center gap-x-0.5">
            <span>{zodiacSymbol}</span>
            <span>{zodiacSign}</span>
        </div>
    )
}

export default Zodiac;
