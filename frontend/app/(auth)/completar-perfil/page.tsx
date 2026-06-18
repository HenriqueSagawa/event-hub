import { Suspense } from "react"
import Link from "next/link"
import { ProfileStepper } from "@/components/profile/profile-stepper"
import { Card } from "@/components/ui/card"

export default function CompleteProfilePage() {
  return (
    <main className="flex min-h-screen flex-col bg-secondary/40 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <Link href="/" aria-label="Página inicial PET Connect">
          Logo
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Complete seu perfil</h1>
            <p className="mt-2 text-muted-foreground">
              Faltam só alguns passos para você aproveitar tudo no PET Connect.
            </p>
          </div>
          <Card className="p-6 sm:p-8">
            <Suspense fallback={null}>
              <ProfileStepper />
            </Suspense>
          </Card>
        </div>
      </div>
    </main>
  )
}
