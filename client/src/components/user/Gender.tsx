import React from 'react'
import { MdCake } from 'react-icons/md'
import { calculateAge } from '../../utils/dateUtils'
import { getGenderSign } from '../../utils/genderUtils'

type GenderProps = {
    gender: string
}

const Gender: React.FC<GenderProps> = ({ gender }) => {

    const genderSign = getGenderSign(gender)

    return (
        <div className="flex items-center gap-x-0.5">
            {genderSign}
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </div>
    );
}

export default Gender