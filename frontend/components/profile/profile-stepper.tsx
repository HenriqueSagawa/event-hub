"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Phone,
  Sparkles,
  Trash2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, title: "Foto de perfil", icon: Camera },
  { id: 2, title: "Dados acadêmicos", icon: GraduationCap },
  { id: 3, title: "Contato", icon: Phone },
  { id: 4, title: "Sobre você", icon: Sparkles },
]

const COURSES = [
  "Ciência da Computação",
  "Engenharia de Software",
  "Sistemas de Informação",
  "Análise e Desenvolvimento de Sistemas",
  "Engenharia da Computação",
  "Redes de Computadores",
]

const PERIODS = ["1º período", "2º período", "3º período", "4º período", "5º período", "6º período", "7º período", "8º período", "Outro"]

const INTERESTS = [
  "Desenvolvimento Web",
  "Inteligência Artificial",
  "Ciência de Dados",
  "Mobile",
  "Segurança",
  "DevOps",
  "Games",
  "UX/UI",
  "Robótica",
  "Pesquisa Acadêmica",
]

type FormData = {
  photo: string | null
  course: string
  period: string
  registration: string
  phone: string
  github: string
  linkedin: string
  bio: string
  interests: string[]
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function ProfileStepper() {
  const router = useRouter()
  const params = useSearchParams()
  const { completeProfile } = useAuth()
  const name = params.get("name") ?? ""

  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<FormData>({
    photo: null,
    course: "",
    period: "",
    registration: "",
    phone: "",
    github: "",
    linkedin: "",
    bio: "",
    interests: [],
  })

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update("photo", reader.result as string)
    reader.readAsDataURL(file)
  }

  function toggleInterest(interest: string) {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const canAdvance =
    (step === 1) ||
    (step === 2 && data.course && data.period) ||
    (step === 3 && data.phone.replace(/\D/g, "").length >= 10) ||
    (step === 4 && data.interests.length > 0)

  async function next() {
    if (step < STEPS.length) {
      setStep((s) => s + 1)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      await completeProfile(data)
      setDone(true)
      setTimeout(() => router.push("/"), 1600)
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar seu perfil. Verifique as informações.")
    } finally {
      setLoading(false)
    }
  }

  function back() {
    setStep((s) => Math.max(1, s - 1))
    setError(null)
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Perfil completo!</h2>
        <p className="max-w-sm text-muted-foreground">
          Suas informações foram salvas. Estamos te levando para a plataforma...
        </p>
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Indicador de etapas */}
      <ol className="flex items-center justify-between">
        {STEPS.map((s, index) => {
          const active = s.id === step
          const completed = s.id < step
          return (
            <li key={s.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 transition-colors",
                    completed && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary bg-primary/10 text-primary",
                    !active && !completed && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {completed ? <Check className="size-5" /> : <s.icon className="size-5" />}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    active || completed ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 rounded transition-colors",
                    completed ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Conteúdo da etapa */}
      <div className="min-h-70">
        {step === 1 && (
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <h2 className="text-xl font-bold text-foreground">Adicione uma foto</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajude a galera do PET a te reconhecer nos eventos. (opcional)
              </p>
            </div>
            <Avatar className="size-32 border-4 border-accent">
              {data.photo ? (
                <AvatarImage src={data.photo} alt="Foto de perfil" />
              ) : (
                <AvatarFallback className="bg-accent text-2xl font-semibold text-primary">
                  {initials || <User className="size-10" />}
                </AvatarFallback>
              )}
            </Avatar>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                <Camera className="size-4" />
                {data.photo ? "Trocar foto" : "Enviar foto"}
              </Button>
              {data.photo && (
                <Button type="button" variant="ghost" onClick={() => update("photo", null)}>
                  <Trash2 className="size-4" />
                  Remover
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Seus dados acadêmicos</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Conte um pouco sobre sua trajetória no curso.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="course">Curso</Label>
              <Select value={data.course} onValueChange={(v) => update("course", v)}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Selecione seu curso" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="period">Período</Label>
                <Select value={data.period} onValueChange={(v) => update("period", v)}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Período atual" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIODS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="registration">Matrícula</Label>
                <Input
                  id="registration"
                  placeholder="Ex.: 2023123456"
                  value={data.registration}
                  onChange={(e) => update("registration", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Como podemos te contatar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Usamos para avisos importantes sobre seus eventos.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  inputMode="tel"
                  placeholder="(00) 00000-0000"
                  value={data.phone}
                  onChange={(e) => update("phone", formatPhone(e.target.value))}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="github">GitHub (opcional)</Label>
              <Input
                id="github"
                placeholder="github.com/seu-usuario"
                value={data.github}
                onChange={(e) => update("github", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="linkedin">LinkedIn (opcional)</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/seu-perfil"
                value={data.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Sobre você</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecione suas áreas de interesse e escreva uma breve bio.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Áreas de interesse</Label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const selected = data.interests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Bio (opcional)</Label>
              <Textarea
                id="bio"
                rows={4}
                maxLength={240}
                placeholder="Conte um pouco sobre você, seus objetivos e o que espera do PET..."
                value={data.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
              <span className="text-right text-xs text-muted-foreground">{data.bio.length}/240</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Navegação */}
      <div className="flex items-center justify-between gap-3">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={back}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
        ) : (
          <span />
        )}
        <Button type="button" onClick={next} disabled={!canAdvance || loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Salvando...
            </>
          ) : step === STEPS.length ? (
            "Concluir"
          ) : (
            <>
              Continuar
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
