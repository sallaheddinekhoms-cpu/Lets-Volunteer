"use server"

import { Backend } from "@/lib/helper"
import { Certificate, CertificateFormData, CertificateVerification } from "@/types/participation"
import { updateTag } from "next/cache"


export async function getParticipationCertificate(participation_id: number | string): Promise<{ certificate: Certificate | null, defaults: CertificateFormData }> {
      const { data, status } = await Backend.get(
            `participation/${participation_id}/certificate/`, {
                  withCredentials: true
            }
      )

      if (status !== 200) throw new Error(data?.error || "Failed to load certificate")

      return data
}


export async function sendCertificate(participation_id: number | string, certificate: CertificateFormData): Promise<Certificate> {
      const { data, status } = await Backend.post(
            `participation/${participation_id}/certificate/`, {
                  withCredentials: true,
                  body: certificate
            }
      )

      if (status !== 200) throw new Error(data?.error || "Failed to send certificate")

      updateTag("participations")
      return data
}


/** Returns the PDF as base64 so the client can save it (the auth token lives in server cookies). */
export async function downloadCertificate(certificate_id: string): Promise<{ filename: string, base64: string }> {
      const response = await Backend.get(`certificates/${certificate_id}/download/`, {
            withCredentials: true,
            returnFullResponse: true
      }) as unknown as Response

      if (!response.ok) throw new Error("Failed to download certificate")

      const disposition = response.headers.get("content-disposition") || ""
      const filename = disposition.match(/filename="(.+)"/)?.[1] || "certificate.pdf"
      const buffer = Buffer.from(await response.arrayBuffer())

      return { filename, base64: buffer.toString("base64") }
}


export async function verifyCertificate(serial_number: string): Promise<CertificateVerification | null> {
      const { data, status } = await Backend.get(
            `certificates/verify/${encodeURIComponent(serial_number)}/`, {}
      )

      return status === 200 ? data : null
}
