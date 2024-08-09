import { ClickableProps, colorAdjustment } from './clickable.types'

const Button: React.FC<ClickableProps> = ({ text, iconBegin, iconEnd, notSubmit, onClick, disabled, color, size, outlined, uppercased, innerWidth, innerHeight, className }) => {

  const colorClass = colorAdjustment(color, outlined)

  return (
    <button className={`${colorClass} ${size && "text-"+size} ${uppercased && "uppercase"} ${disabled && "pointer-events-none"} ${innerWidth && "px-"+innerWidth} ${innerHeight && "py-"+innerHeight} w-full flex flex-row justify-center items-center gap-x-1 tracking-wider rounded-2xl font-semibold ${className}`}
      onClick={onClick}
      type={notSubmit ? "button" : "submit"}
      disabled={disabled}>
      { iconBegin && <div className="scale-125">{iconBegin}</div> }
      {text}
      { iconEnd && <div className="scale-125">{iconEnd}</div> }
    </button>
  )
}

export default Button