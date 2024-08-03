import React from 'react'
import { MdCake } from 'react-icons/md'
import { calculateAge } from '../../utils/dateUtils'

type AgeProps = {
  dateOfBirth: string | Date
}

const Age: React.FC<AgeProps> = ({ dateOfBirth }) => {

  const date = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
  const age = calculateAge(date)

  return (
    <div className="flex items-center gap-x-0.5">
      <MdCake className="mb-0.5" />
      <span>{age} Years old</span>
    </div>
  );
}

export default Age