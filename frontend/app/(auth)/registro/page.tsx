import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { AuthAside } from "@/components/auth/auth-aside"

export default function RegisterPage() {
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Crie sua conta</h1>
              <p className="mt-2 text-muted-foreground">
                Use seu e-mail institucional para participar dos eventos.
              </p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
      <AuthAside />
    </div>
  )
}
