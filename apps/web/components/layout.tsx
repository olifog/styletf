import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }) {
  return (
    <div className="relative w-full min-h-screen bg-slate-900 overflow-x-hidden">
      <Header />
      <div className="flex flex-col w-full max-w-xl mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  )
}
