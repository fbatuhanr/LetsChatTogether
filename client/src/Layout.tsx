
const Layout = ({ children }:{ children: React.ReactNode }) => {
    return (
        <div className="w-full min-h-72">
            {children}
        </div>
    )
}

export default Layout