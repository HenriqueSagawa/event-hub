import { Suspense } from "react"
import Link from "next/link"
import { AuthAside } from "@/components/auth/auth-aside"
import { ConfirmationForm } from "@/components/auth/confirmation-form"

export default function ConfirmacaoPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" aria-label="Página inicial PET Connect">
            Logo
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <Suspense>
              <ConfirmationForm />
            </Suspense>
          </div>
        </div>
      </div>
      <AuthAside />
    </div>
  )
}
