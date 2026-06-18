"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const RESEND_SECONDS = 30

export function ConfirmationForm() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get("email") ?? "seu e-mail"

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(false)
  const [seconds, setSeconds] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  function handleVerify() {
    setLoading(true)
    setError(false)
    setTimeout(() => {
      setLoading(false)
      // Demonstração: qualquer código terminando em "0" é inválido
      if (code.length === 6 && !code.endsWith("0")) {
        setConfirmed(true)
        setTimeout(() => router.push("/"), 1400)
      } else {
        setError(true)
      }
    }, 900)
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Conta confirmada!
        </h1>
        <p className="text-muted-foreground">
          Tudo certo. Estamos te redirecionando para a plataforma...
        </p>
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para o login
      </Link>

      <div className="flex flex-col gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
          <MailCheck className="size-6" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Confirme seu e-mail
        </h1>
        <p className="text-pretty text-muted-foreground">
          Enviamos um código de 6 dígitos para{" "}
          <span className="font-medium text-foreground">{email}</span>. Digite-o
          abaixo para continuar.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => {
            setCode(value)
            setError(false)
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            Código inválido. Verifique e tente novamente.
          </p>
        )}
      </div>

      <Button
        size="lg"
        onClick={handleVerify}
        disabled={code.length !== 6 || loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Verificando...
          </>
        ) : (
          "Confirmar código"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Não recebeu o código?{" "}
        {seconds > 0 ? (
          <span>
            Reenviar em <span className="font-medium text-foreground">{seconds}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setSeconds(RESEND_SECONDS)}
            className="font-medium text-primary hover:underline"
          >
            Reenviar código
          </button>
        )}
      </p>
    </div>
  )
}
