import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import { StudioUploadModal } from "../studio-upload-modal"
import Image from "next/image"


export const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
        <div className="flex items-center gap-4 w-full">
            <div className="flex items-center flex-shrink-0">
            <SidebarTrigger />
            <Link prefetch  href="/studio" className="px-4 hidden md:block">
                <Image src="/Youtube_Studio_logo.svg" alt="Studio" width="90" height="100"/>
            </Link>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            <div className="flex-shrink-0 items-center flex gap-4">
                <StudioUploadModal />
                <AuthButton />
            </div>
        </div>
    </nav>
  )
}
