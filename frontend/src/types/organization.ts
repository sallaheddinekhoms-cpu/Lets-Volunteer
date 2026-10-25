export interface Organization {
      id: string;
      organization_name: string;
      logo?: string;
      is_confirmed?: boolean;
    }

export interface OrganizationProfile {
  id: string;
  organization_name: string;
  logo?: string | File;
  logo_url?: string;
  wilaya: string;
  daira: string;
  email: string;
  phone_number: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  description: string;
  is_confirmed?: boolean;
}