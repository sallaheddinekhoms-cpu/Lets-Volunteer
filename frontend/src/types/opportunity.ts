import { Organization } from "./organization";

export interface Category {
      id: string;
      label: string;
    }
    

    




export interface Opportunity {
      id: string;
      title: string;
      description: string;
      created_at: string;
      updated_at: string;
      organization: Organization;
      wilaya: string;
      daira: string;
      latitude?: number;
      longitude?: number;
      location_address?: string;
      is_urgent: boolean;
      is_available: boolean;
      duration: number;
      date_of_opportunity?: string;
      is_remote?: boolean;
      category: Category;
      responsabilities: { id?: string; title: string }[];
      qualifications: { id?: string; title: string }[];
      is_active?: boolean;
      email?: string;
      phone_number?: string;
      image?: string;
    }

export interface OpportunityForCardList {
      id: string;
      title: string;
      description: string;
      created_at: string;
      updated_at: string;
      organization: string;
      wilaya: string;
      date_of_opportunity?: string;
      daira: string;
      is_urgent: boolean;
      is_available: boolean;
      duration?: number;
      is_remote?: boolean;
      image?: string;
      category: Category;
      is_active?: boolean;
      
    }
    