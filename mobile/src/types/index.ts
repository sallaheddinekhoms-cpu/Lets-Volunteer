export interface OpportunityItem {
  id: string | number;
  title: string;
  description: string;
  organization?: string;
  category?: { id: string | number; label: string };
  wilaya: string;
  daira?: string;
  latitude?: number | null;
  longitude?: number | null;
  duration?: number;
  date_of_opportunity?: string;
  phone_number?: string;
  email?: string;
  is_urgent?: boolean;
  is_remote?: boolean;
  is_available?: boolean;
  image?: string;
  responsabilities?: Array<{ id?: number; title: string }>;
  qualifications?: Array<{ id?: number; title: string }>;
}

export interface SolidarityItem {
  id: string | number;
  title: string;
  category: string;
  item_type: "lending" | "donation";
  description: string;
  wilaya: string;
  daira?: string;
  contact_phone: string;
  status: string;
  created_at?: string;
}

export interface TrainingItem {
  id: number;
  title: string;
  trainer_name: string;
  category: string;
  format: "online" | "in_person";
  level: "beginner" | "intermediate" | "advanced";
  duration_hours: number;
  description: string;
  start_date: string;
  enrolled_count: number;
  max_participants: number;
  location?: string;
}

export interface SupportTicket {
  id?: string;
  ticket_number?: string;
  title: string;
  category: string;
  priority: string;
  description: string;
  status?: string;
  created_at?: string;
}

export interface VolunteerProfile {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  wilaya: string;
  daira?: string;
  blood_group?: string;
  date_of_birth?: string;
  total_hours: number;
  participations_count: number;
}
