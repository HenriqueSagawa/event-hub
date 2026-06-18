const steps = [
  {
    number: "01",
    title: "Crie seu perfil",
    description:
      "Cadastre suas informações acadêmicas e tenha um histórico completo de participação.",
  },
  {
    number: "02",
    title: "Inscreva-se nos eventos",
    description:
      "Explore a agenda, confira os detalhes e garanta sua vaga em poucos toques.",
  },
  {
    number: "03",
    title: "Registre presença",
    description:
      "Apresente seu QR Code no evento e tenha a participação registrada na hora.",
  },
  {
    number: "04",
    title: "Acompanhe sua evolução",
    description:
      "Baixe certificados, some horas complementares e suba no ranking de engajamento.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Da inscrição ao certificado em quatro passos simples.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="text-3xl font-bold text-primary/30">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
