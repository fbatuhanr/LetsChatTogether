export interface ClickableProps {
    text?: string
    iconBegin?: JSX.Element
    iconEnd?: JSX.Element
    notSubmit?: boolean
    target?: string | ""
    onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
    disabled?: boolean
    color?: "primary" | "secondary" | "tertiary" | "quaternary" | "transparent" | null
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl"
    outlined?: boolean
    uppercased?: boolean
    innerWidth?: number
    innerHeight?: number
    className?: string
}

export const colorAdjustment = (color?: string | null, outlined?: boolean) => {

    switch (color) {
      case "primary":
        return `text-white bg-yellow-400 hover:text-gray-200 hover:bg-yellow-500 shadow-md shadow-[#211a3c] [text-shadow:1px_1px_2px_var(--tw-shadow-color)] ${outlined && "border border-yellow-600 hover:border-yellow-400"}`
      case "transparent":
        return `bg-transparent ${outlined && "border border-yellow-600 hover:border-yellow-500"}`
  
      default:
        return `text-white bg-yellow-400 hover:text-gray-200 hover:bg-yellow-500 ${outlined && "border border-yellow-600 hover:border-yellow-400"}`
    }
}