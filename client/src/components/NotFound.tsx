import { Link } from "react-router-dom"

interface NotFoundProps {
    title?: string;
    text?: string;
    optionalAltText?: string;
    backToHomeButton?: boolean
}
const NotFound: React.FC<NotFoundProps> = ({ title, text, optionalAltText, backToHomeButton }) => {
    return (
        <section className="mt-8 mx-auto max-w-screen-sm text-center">
            <h1 className="mb-10 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
                {title ? title : "Oops..."}
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-white">
                {text ? text : "Something's missing."}
            </p>
            {
                optionalAltText &&
                <p className="mb-8 text-lg font-light text-gray-500">{optionalAltText}</p>
            }
            {
                backToHomeButton &&
                <Link to="/" className="px-12 py-2 mt-1 text-2xl font-bold border border-[#0D0D0D] bg-[#F2D541] rounded-full [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D]">
                    Back to Home
                </Link>
            }
        </section>
    )
}

export default NotFound