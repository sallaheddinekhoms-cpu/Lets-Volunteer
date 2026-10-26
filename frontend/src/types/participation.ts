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

export interface CreditLogItem {
      id: string;
      credit_type: string;
      credit_type_label: string;
      hours: number;
      description: string;
      created_at: string;
}

export interface VolunteerCreditSummary {
      total_hours: number;
      fieldwork_hours: number;
      training_hours: number;
      skill_hours: number;
      logistics_hours: number;
      milestone_hours: number;
      rank: string;
      rank_ar: string;
      rank_color: string;
      progress_to_next: number;
      next_target: number;
      recent_logs: CreditLogItem[];
}

export interface OrganizationImpact {
      impact_points: number;
      tier: "emerging" | "active" | "pioneer" | "strategic_partner";
      tier_label: string;
      avg_volunteer_rating: number;
      total_ratings_count: number;
      badge_volunteer_friendly: boolean;
      badge_training_incubator: boolean;
      badge_rapid_response: boolean;
      opportunities_completed: number;
      trainings_organized: number;
      new_volunteers_onboarded: number;
}

export interface ParticipationForVolunteer {
      id: string;
      opportunity: Partial<Opportunity>;
      status: "accepted" | "done" | "refused" | "pending";
      rating?: number;
      organization_feedback?: string;
      hours_worked?: number;
      volunteer_feedback?: string;
      skill_level?: "general" | "specialist" | "lead";
      provided_transport?: boolean;
      provided_equipment?: boolean;
      provided_donation?: boolean;
      volunteer_org_rating?: number;
      volunteer_org_feedback?: string;
      calculated_credit_hours?: number;
      certificate?: CertificateSummary | null;
}

export interface ParticipationForOrganizationStats {
      id: number;
      rating: number;
      organization_feedback: string;
      hours_worked: number;
      volunteer_feedback?: string;
      skill_level?: "general" | "specialist" | "lead";
      provided_transport?: boolean;
      provided_equipment?: boolean;
      provided_donation?: boolean;
      calculated_credit_hours?: number;
}

export interface ParticipationForOrganization {
      id: number;
      volunteer?: Partial<Volunteer>;
      opportunity?: Partial<Opportunity>;
      status: "accepted" | "done" | "refused" | "pending";
      rating?: number;
      organization_feedback?: string;
      hours_worked?: number;
      skill_level?: "general" | "specialist" | "lead";
      provided_transport?: boolean;
      provided_equipment?: boolean;
      provided_donation?: boolean;
      calculated_credit_hours?: number;
      certificate?: CertificateSummary | null;
}

export interface FeedbackItem {
      organization_feedback: string;
      rating: number;
      opportunity__title: string;
      completed_at: string;
}

export interface VolunteerProfileStats {
      total_hours: number;
      average_rating: number;
      total_participations: number;
      feedbacks: FeedbackItem[];
      participation_rate: number;
      top_categories?: string[];
      recent_feedback?: any[];
}
