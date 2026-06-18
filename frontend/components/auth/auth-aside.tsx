import { CalendarCheck, QrCode, Award, Trophy } from "lucide-react"

const highlights = [
  { icon: CalendarCheck, text: "Inscrições em eventos online" },
  { icon: QrCode, text: "Presença registrada por QR Code" },
  { icon: Award, text: "Certificados digitais e horas complementares" },
  { icon: Trophy, text: "Rankings, conquistas e medalhas" },
]

export function AuthAside() {
  return (
    <aside className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
      <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
        PET Connect
      </p>
      <div className="max-w-md">
        <h2 className="text-balance text-4xl font-bold leading-tight">
          A sua participação, organizada e valorizada.
        </h2>
        <ul className="mt-8 flex flex-col gap-4">
          {highlights.map((item) => (
            <li key={item.text} className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <item.icon className="size-5" />
              </span>
              <span className="text-primary-foreground/90">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-primary-foreground/70">
        Event hub — descubra, participe e evolua.
      </p>
    </aside>
  )
}
