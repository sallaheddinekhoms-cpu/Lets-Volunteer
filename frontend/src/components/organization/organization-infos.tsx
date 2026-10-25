"use client"
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Globe,
  Edit,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrganizationProfile } from "@/types/organization";
import { useTransition } from "react";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import algerianWilayas from 'algeria-wilayas';


interface OrganizationProfileProps {
  organization: Partial<OrganizationProfile>;
 onEditIcon: (value: boolean) => void
}

const OrganizationInfo: React.FC<OrganizationProfileProps> = (
  { organization , onEditIcon }
) => {

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLogout = () => {
    startTransition(() => {
      logout().then(() => router.push("/"))
    })


  }

  return (
    <div>
      {/* Organization Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8"
      >
        <Card className="relative overflow-hidden">
          <div className="absolute top-4 left-4">
            <Button onClick={()=>{ onEditIcon(true) }} variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex flex-col gap-2" >


                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-32 h-32 flex flex-col gap-2 rounded-full overflow-hidden border-4 border-primary/10"
                >
                  <Image
                    height={128}
                    width={128}
                    src={organization.logo instanceof File ? URL.createObjectURL(organization.logo) : (organization.logo_url || "/default-logo.png")}
                    alt={organization.organization_name || "Organization Name"}
                    className="object-cover w-full h-full"
                  />

                </motion.div>

                

                <Button disabled={isPending} variant="ghost" onClick={handleLogout}
                  className=" text-red-500 hover:text-red-700 hover:bg-red-50">
                  {isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                </Button>


              </div>

              <div className="flex-1 text-center md:text-right space-y-4">
                <h1 className="text-3xl font-bold text-primary">{organization.organization_name}</h1>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary/70" />
                    <span>{ algerianWilayas.getWilayaByCode(organization.wilaya || '')?.name.arabic }, {organization.daira}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-5 w-5 text-primary/70" />
                    <a href={`mailto:${organization.email || ''}`} className="hover:text-primary transition-colors">
                      {organization.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary/70" />
                    <a href={`tel:${organization.phone_number}`} className="hover:text-primary transition-colors">
                      {organization.phone_number}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4 justify-center md:justify-start">
                  {organization.facebook && (
                    <a href={organization.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Facebook className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {organization.instagram && (
                    <a href={organization.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Instagram className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {organization.website && (
                    <a href={organization.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Globe className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Organization Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">معلومات الجمعية</h2>
            <p className="text-muted-foreground leading-relaxed">
              {organization.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  )
}

export default OrganizationInfo
