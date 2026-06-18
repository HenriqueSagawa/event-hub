import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, QrCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="eventos" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-secondary to-background" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            Event Hub
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Toda a sua jornada em um só lugar
          </h1>
          <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Descubra eventos, faça inscrições, registre presença com QR Code e
            acompanhe certificados e conquistas. Tudo simples, rápido e no seu
            ritmo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">
                Começar agora
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#eventos">Ver eventos</a>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarCheck className="size-4 text-primary" />
              Inscrições online
            </span>
            <span className="flex items-center gap-2">
              <QrCode className="size-4 text-primary" />
              Presença por QR Code
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/5">
            <Image
              src="/images/hero-evento.png"
              alt="Estudantes colaborando em um evento acadêmico"
              width={720}
              height={560}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-border bg-card p-4 shadow-lg sm:block">
            <p className="text-2xl font-bold text-foreground">+120</p>
            <p className="text-sm text-muted-foreground">eventos realizados</p>
          </div>
        </div>
      </div>
    </section>
  );
}
