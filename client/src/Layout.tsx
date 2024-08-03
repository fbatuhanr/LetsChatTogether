
const Layout = ({ children }:{ children: React.ReactNode }) => {
    return (
        <div className="w-full min-h-72 py-5">
            {children}
        </div>
    )
}

export default Layout