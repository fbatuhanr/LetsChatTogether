export const calculateAge = (dateOfBirth: string | Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
};

export const timeAgoCalculator = (dateString: string): string => {
  const now = new Date(); // Current date and time
  const date = new Date(dateString); // Convert string to Date

  if (isNaN(date.getTime())) {
      return "Invalid date provided"; // Handle invalid date
  }

  const differenceInMillis = now.getTime() - date.getTime();
  const differenceInSeconds = Math.floor(differenceInMillis / 1000);
  
  if (differenceInSeconds < 60) {
      if(differenceInSeconds < 15){
        return 'just now!'
      }
      return `${differenceInSeconds} seconds ago`;
  }

  const differenceInMinutes = Math.floor(differenceInMillis / (1000 * 60));
  if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minutes ago`;
  }

  const differenceInHours = Math.floor(differenceInMillis / (1000 * 60 * 60));
  if (differenceInHours < 24) {
      return `${differenceInHours} hours ago`;
  }

  const differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
  if (differenceInDays < 7) {
      return `${differenceInDays} days ago`;
  }

  const differenceInWeeks = Math.floor(differenceInDays / 7);
  if (differenceInWeeks < 4) {
      return `${differenceInWeeks} weeks ago`;
  }

  const differenceInMonths = Math.floor(differenceInDays / 30);
  if (differenceInMonths < 12) {
      return `${differenceInMonths} months ago`;
  }

  const differenceInYears = Math.floor(differenceInDays / 365);
  return `${differenceInYears} years ago`;
}