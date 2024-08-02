import { GiFemale, GiMale } from "react-icons/gi";
import { IoMaleFemale } from "react-icons/io5";

export const getGenderSign = (gender: string): JSX.Element => {
  
  switch (gender) {
    case "male":
      return <GiMale />;
    case "female":
      return <GiFemale />;
    default:
      return <IoMaleFemale />;
  }
}