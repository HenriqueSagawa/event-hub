import {
  CalendarDays,
  QrCode,
  Award,
  BarChart3,
  Bell,
  Trophy,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: CalendarDays,
    title: "Descubra e inscreva-se",
    description:
      "Veja todos os eventos com descrição, data, local, ministrantes, carga horária e vagas. Inscreva-se direto pelo app.",
  },
  {
    icon: QrCode,
    title: "Presença por QR Code",
    description:
      "Cada aluno tem um QR Code individual. A organização escaneia e a presença é registrada automaticamente.",
  },
  {
    icon: Award,
    title: "Certificados digitais",
    description:
      "Acesse e baixe seus certificados emitidos pela organização assim que os eventos forem concluídos.",
  },
  {
    icon: BarChart3,
    title: "Sua jornada e métricas",
    description:
      "Acompanhe horas complementares, eventos frequentados e o seu nível de engajamento ao longo do tempo.",
  },
  {
    icon: Bell,
    title: "Notificações importantes",
    description:
      "Receba confirmações, lembretes e novidades sobre os eventos diretamente na plataforma.",
  },
  {
    icon: Trophy,
    title: "Gamificação",
    description:
      "Rankings, conquistas, medalhas e recompensas simbólicas para incentivar sua participação contínua.",
  },
]

export function Features() {
  return (
    <section id="recursos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Tudo o que você precisa para participar
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          O Event HUB é um ecossistema completo de gestão, acompanhamento e
          valorização da participação estudantil.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-border transition-shadow hover:shadow-md hover:shadow-primary/5"
          >
            <CardHeader>
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                <feature.icon className="size-5" />
              </span>
              <CardTitle className="pt-2 text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
