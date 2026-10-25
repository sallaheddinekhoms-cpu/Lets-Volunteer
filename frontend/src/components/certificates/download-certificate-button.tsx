"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Button, ButtonProps } from "@/components/ui/button"
import { downloadCertificate } from "@/data/Certificates"

interface DownloadCertificateButtonProps extends ButtonProps {
  certificateId: string
  label?: string
}

export default function DownloadCertificateButton({
  certificateId,
  label = "تحميل الشهادة",
  ...buttonProps
}: DownloadCertificateButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { filename, base64 } = await downloadCertificate(certificateId)
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }))
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error("حدث خطأ أثناء تحميل الشهادة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading} {...buttonProps}>
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      {label}
    </Button>
  )
}
