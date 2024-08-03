import { Link } from "react-router-dom"

const NotFound: React.FC = () => {
    return (
        <section className="mt-8 mx-auto max-w-screen-sm text-center">
            <h1 className="mb-10 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">Oops...</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-white">Something's missing.</p>
            <p className="mb-8 text-lg font-light text-gray-500">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <Link to="/" className="px-12 py-3 text-2xl font-bold border border-[#0D0D0D] bg-[#F2D541] rounded-full [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D]">
                Back to Homepage
            </Link>
        </section>
    )
}

export default NotFound