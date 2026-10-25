export interface OpportunityFilters {
      category?: string;
      wilaya?: string;
      daira?: string;
      is_urgent?: boolean;
      is_available?: boolean;
      duration?: number;
      is_remote?: boolean;
      page: number;
      organization?: string;
    }
  
export interface OrganizationFilters {
      page : number ; 
      wilaya? : string;
      daira? : string;
      organization_name? : string;
}

export interface VolunteerFilters {
      page: number;
      wilaya?: string;
      daira?: string;
      blood_group?: string;
}


export interface ParticipationsFilters {
      status: "accepted" | "done" | "refused" | "pending" | "all";
      opportunity_id?:string;
      volunteer_id?:string;
      

}



export interface AidsFilters {
      page? : number;
      aid_type? : number ;
      organization? : string;
      identity? : string;
      is_duplicated?: boolean;
}