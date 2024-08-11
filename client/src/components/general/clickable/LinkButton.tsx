import { Link } from 'react-router-dom'
import { ClickableProps, colorAdjustment } from './clickable.types'

const LinkButton: React.FC<ClickableProps> = ({ text, iconBegin, iconEnd, target, onClick, disabled, color, size, rounded, outlined, uppercased, innerWidth, innerHeight, className }) => {

  const colorClass = colorAdjustment(color, outlined)

  return (
    <Link className={`${colorClass} ${size && "text-"+size} ${uppercased && "uppercase"} ${disabled && "pointer-events-none"} ${innerWidth && "px"+innerWidth} ${innerHeight && "py-"+innerHeight} ${rounded && "rounded-"+rounded} w-full flex flex-row justify-center items-center gap-x-1 tracking-wider font-semibold ${className}`}
      onClick={onClick}
      to={!disabled ? (target ? target : "") : ""}>
      { iconBegin && <div className="scale-125">{iconBegin}</div> }
      {text}
      { iconEnd && <div className="scale-125">{iconEnd}</div> }
    </Link>
  )
}

export default LinkButton