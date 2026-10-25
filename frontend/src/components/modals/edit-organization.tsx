"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { OrganizationProfile } from "@/types/organization"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Daira, Wilaya } from "algeria-wilayas"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditOrganizationModalProps {
  organization: OrganizationProfile;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave: (data: FormData) => void;
  wilayas: Wilaya[];
  dairas: Daira[];
}

export const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({ 
  organization, 
  open, 
  onOpenChange,
  onSave ,
  wilayas,
  dairas
}) => {
  const router = useRouter();
  const [newOrgData, setNewOrgData] = useState<OrganizationProfile>(organization);
  const [isPending, setIsPending] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);


  function normalizeOrganizationData(org: OrganizationProfile): OrganizationProfile {
    return {
      ...org,
      organization_name: org.organization_name || '',
      description: org.description || '',
      wilaya: org.wilaya || '',
      daira: org.daira || '',
      phone_number: org.phone_number || '',
      website: org.website || '',
      facebook: org.facebook || '',
      instagram: org.instagram || '',
    };
  }

  useEffect(() => {
    setNewOrgData(normalizeOrganizationData(organization));
    setLogoPreview(null); // Reset preview when modal opens
  }, [organization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOrgData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, field: 'wilaya' | 'daira') => {
    setNewOrgData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData();
      Object.entries(newOrgData).forEach(([key, value]) => {
        // Skip logo here, we'll handle it separately
        if (key !== 'logo') {
          formData.append(key, value);
        }
      });
      
      // Handle logo file separately
      if (newOrgData.logo instanceof File) {
        formData.append('logo', newOrgData.logo);
      }
      
      await onSave(formData);
      onOpenChange?.(false);
      router.refresh();
    } catch (error) {
      console.error('Error saving organization:', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewOrgData(prev => ({
        ...prev,
        logo: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold text-primary">تعديل ملف الجمعية</DialogTitle>
          <DialogDescription className="text-secondary text-center ">
            قم بتعديل معلومات الجمعية الخاصة بك
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label htmlFor="organization_name" className="text-right text-primary/80">
                اسم الجمعية
              </Label>
              <Input
                id="organization_name"
                name="organization_name"
                value={newOrgData.organization_name}
                onChange={handleChange}
                className="border-secondary/20"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">تغيير شعار الجمعية</Label>
                  <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} />
                  {logoPreview && (
                    <div className="mt-2">
                      <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-cover rounded-md border" />
                    </div>
                  )}
                </div>

            

            <div className="space-y-2">
              <Label htmlFor="wilaya" className="text-right text-primary/80">
                الولاية
              </Label>
              <Select
                  onValueChange={(value) => handleSelectChange(value, 'wilaya')}
                  value={newOrgData.wilaya}
                  >
                        <SelectTrigger className="w-full">
                              <SelectValue placeholder="الولاية" />
                        </SelectTrigger>
                        <SelectContent>
                              {wilayas.map((wilaya) => (
                                    <SelectItem key={wilaya.code} value={wilaya.code}>
                                          {wilaya.name.arabic}
                                    </SelectItem>
                              ))}

                        </SelectContent>
                  </Select>
            </div>

            <div className="space-y-2">
            <Label htmlFor="daira" className="text-right text-primary/80">
                الدائرة
              </Label>
            <Select
                  name="daira"
                  disabled={!newOrgData.wilaya}
                  onValueChange={(value) => handleSelectChange(value, 'daira')}
                  value={newOrgData.daira || organization.daira || ''}
                  >
                        <SelectTrigger className="w-full">
                              <SelectValue placeholder="الدائرة" />
                        </SelectTrigger>
                        <SelectContent>
                              {dairas.map((daira) => (
                                    <SelectItem key={daira.id} value={daira.name.arabic}>
                                          {daira.name.arabic}
                                    </SelectItem>
                              ))}

                        </SelectContent>
                  </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-right text-primary/80">
                رقم الهاتف
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={newOrgData.phone_number}
                maxLength={10}
                onChange={handleChange}
                className="border-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-right text-primary/80">
                الموقع الإلكتروني
              </Label>
              <Input
                id="website"
                name="website"
                value={newOrgData.website || ''}
                onChange={handleChange}
                className="border-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-right text-primary/80">
                فيسبوك
              </Label>
              <Input
                id="facebook"
                name="facebook"
                value={newOrgData.facebook || ''}
                onChange={handleChange}
                className="border-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-right text-primary/80">
                انستغرام
              </Label>
              <Input
                id="instagram"
                name="instagram"
                value={newOrgData.instagram || ''}
                onChange={handleChange}
                className="border-secondary/20"
              />
            </div>


          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right text-primary/80">
              وصف الجمعية
            </Label>
            <Textarea
              id="description"
              name="description"
              value={newOrgData.description}
              onChange={handleChange}
              className="min-h-[100px] border-secondary/20"
            />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={isPending}
            >
              {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrganizationModal;