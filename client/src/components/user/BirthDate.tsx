import React from 'react'

type BirthDateProps = {
    dateOfBirth: string | Date
}

const BirthDate: React.FC<BirthDateProps> = ({ dateOfBirth }) => {
    
    const date = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    
    const formattedDate = date.toLocaleDateString('en-US', options)
    

    return (
        <div>{formattedDate}</div>
    )
}


export default BirthDate