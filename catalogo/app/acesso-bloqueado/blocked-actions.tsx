"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function BlockedActions() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button
        type="button"
        disabled={loading}
        onClick={() => {
          setLoading(true)
          window.location.reload()
        }}
        className="gap-2"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        {loading ? "Tentando novamente..." : "Tentar novamente"}
      </Button>
      <Button asChild variant="outline">
        <a href="https://loopleiloes.com.br">Voltar ao início</a>
      </Button>
    </div>
  )
}
