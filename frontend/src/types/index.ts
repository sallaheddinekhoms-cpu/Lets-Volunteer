export interface AcessTokenData {
      user_id: string;
      role: string;
}

export interface Skill {
      id: string;
      name: string;
    }

export interface Volunteer {
      id: string;
      avatar?: string | File;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      wilaya: string;
      daira: string;
      date_of_birth: string;
      education_level?: string;
      already_applied?: boolean;
      blood_group?: string;
      skills?: { id? : number , skill : Skill }[];
}


export interface Category {
      id: string;
      label: string;
    }
    
export interface Organization {
      id: string;
      organization_name: string;
      logo?: string;
      wilaya?: string;
      daira?: string;
      phone_number?: string;
      email?: string;
      is_confirmed?: boolean;
    }
    
export interface Opportunity {
      id: string;
      title: string;
      description: string;
      created_at: string;
      updated_at: string;
      organization: Organization;
      date_of_opportunity?: string;
      wilaya: string;
      daira: string;
      latitude?: number;
      longitude?: number;
      location_address?: string;
      is_urgent: boolean;
      is_available: boolean;
      is_active?: boolean;
      duration: number;
      email?: string;
      phone_number?: string;
      is_remote?: boolean;
      category: Category;
      responsabilities: { id?: string; title: string }[];
      qualifications: { id?: string; title: string }[];
      image?: string;
    }

export interface Partner {
      id : string ;
      name : string ; 
      description : string ;
      logo : string ;
      website? : string ;

}
export interface VolunteerStats {
  total_hours: number
}
