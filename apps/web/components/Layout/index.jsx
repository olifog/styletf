import Footer from "./footer"
import Header from "./header"

export default function Layout({ children }) {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-slate-900">
      <div className="relative w-full min-h-screen">
        <Header />
        <div className="flex flex-col w-full max-w-xl mx-auto pb-8">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
