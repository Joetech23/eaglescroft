import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import ContactDock from '@/components/layout/ContactDock'

/** Marketing-site chrome. The client portal and admin live outside this group with their own shell. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ContactDock />
    </>
  )
}
