function Header() {
  return (
    <header className="sticky top-0 z-50 bg-olsson-white border-b border-olsson-black/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-olsson-black">
          Hydrant Flow Test Calculator
        </h1>
        <img
          src="/olsson-logo.svg"
          alt="Olsson"
          className="h-9 w-auto align-middle"
        />
      </div>
    </header>
  )
}

export default Header
