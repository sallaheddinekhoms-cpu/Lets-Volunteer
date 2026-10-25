import { Award, BadgeCheck, Building2, Calendar, Clock, ShieldX } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { verifyCertificate } from "@/data/Certificates"

export const metadata = {
  title: "التحقق من شهادة التطوع - لنتطوع",
}

async function VerifyCertificatePage({ params }: { params: Promise<{ serial: string }> }) {
  const { serial } = await params
  const certificate = await verifyCertificate(decodeURIComponent(serial))

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-background/50" dir="rtl">
      <Card className="w-full max-w-lg border-primary/10 shadow-md">
        <CardContent className="p-8">
          {certificate ? (
            <>
              <div className="flex flex-col items-center text-center gap-3 mb-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <BadgeCheck className="w-9 h-9 text-green-700" />
                </div>
                <h1 className="text-2xl font-bold text-primary">شهادة تطوع صالحة</h1>
                <p className="text-muted-foreground text-sm">
                  هذه الشهادة صادرة عبر منصة لنتطوع — الرقم التسلسلي{" "}
                  <span dir="ltr" className="font-mono font-semibold text-foreground">{certificate.serial_number}</span>
                </p>
              </div>

              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-sm text-muted-foreground">المتطوع(ة)</dt>
                    <dd className="font-semibold text-lg">{certificate.volunteer_name}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-sm text-muted-foreground">الجمعية المانحة</dt>
                    <dd className="font-medium">{certificate.organization_name}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-sm text-muted-foreground">الأنشطة</dt>
                    <dd>
                      <ul className="list-disc pr-5">
                        {certificate.activities.map((a, i) => (
                          <li key={i}>
                            {a.title}
                            {a.date && <span className="text-muted-foreground text-sm"> — {new Date(a.date).toLocaleDateString("ar-DZ")}</span>}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <dt className="text-sm text-muted-foreground">عدد ساعات التطوع</dt>
                    <dd className="font-medium">{certificate.hours} ساعة</dd>
                  </div>
                </div>
                {certificate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {certificate.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">{skill}</span>
                    ))}
                  </div>
                )}
              </dl>

              <p className="text-xs text-muted-foreground text-center mt-8">
                تاريخ الإصدار: {new Date(certificate.issued_at).toLocaleDateString("ar-DZ")}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <ShieldX className="w-9 h-9 text-red-700" />
              </div>
              <h1 className="text-2xl font-bold">لم يتم العثور على الشهادة</h1>
              <p className="text-muted-foreground">
                الرقم التسلسلي <span dir="ltr" className="font-mono">{decodeURIComponent(serial)}</span> غير مسجل في منصة لنتطوع.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyCertificatePage
