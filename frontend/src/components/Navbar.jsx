function Navbar() {
    return (
        <div className="bg-black text-white p-4 flex justify-between">
            <h1 className="font-bold text-xl">MyTube</h1>
            <div>
                <button className="mr-3">Login</button>
                <button>Register</button>
            </div>
        </div>
    )
}

export default Navbar