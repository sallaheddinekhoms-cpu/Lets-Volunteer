import { Volunteer } from ".";
import { Opportunity } from "./opportunity";

export interface CertificateSummary {
      id: string;
      serial_number: string;
      issued_at: string;
      sent_at?: string | null;
}

export interface CertificateActivity {
      title: string;
      date?: string;
}

export interface CertificateFormData {
      place_of_birth: string;
      activities: CertificateActivity[];
      skills: string[];
      hours: number;
      partners: string;
}

export interface Certificate extends CertificateFormData, CertificateSummary {}

export interface CertificateVerification {
      serial_number: string;
      volunteer_name: string;
      organization_name: string;
      opportunity_title: string;
      hours: number;
      activities: CertificateActivity[];
      skills: string[];
      issued_at: string;
}

export interface ParticipationForVolunteer {
      id:string ;
      opportunity:Partial<Opportunity>;
      status: "accepted" | "done" | "refused" | "pending";
      rating?: number;
      organization_feedback?: string;
      hours_worked?: number;
      volunteer_feedback?: string;
      certificate?: CertificateSummary | null;
}

export interface ParticipationForOrganizationStats {
      id: number;
      rating: number;
      organization_feedback: string;
      hours_worked: number;
      volunteer_feedback?: string;
}

export interface ParticipationForOrganization {
      id:number ;
      volunteer?:Partial<Volunteer>;
      status:  "accepted" | "done" | "refused" | "pending";
      certificate?: CertificateSummary | null;
}



export interface FeedbackItem {
      organization_feedback: string;
      rating: number;
      opportunity__title: string;
      completed_at: string;
    }
    
export interface VolunteerProfileStats extends Volunteer {
      total_hours: number;
      average_rating: number;
      participation_rate: number;
      top_categories: string[];
      recent_feedback: FeedbackItem[];
    }