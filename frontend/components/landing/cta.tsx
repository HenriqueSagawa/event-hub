import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Cta() {
  return (
    <section id="conquistas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          Pronto para acompanhar sua jornada?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
          Junte-se aos alunos que já organizam sua participação, somam horas
          complementares e colecionam conquistas com o Event Hub.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">
              Criar minha conta
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
