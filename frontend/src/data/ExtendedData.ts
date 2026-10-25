"use server";

import { Backend } from "@/lib/helper";
import { revalidatePath } from "next/cache";

export async function getResponsibilityTemplates() {
  try {
    const { data, status } = await Backend.get("responsibility-templates/", {
      withCredentials: true,
      tags: ["responsibility-templates"],
    });
    if (status === 200 && Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching responsibility templates:", error);
    return [];
  }
}

export async function getOrganizationContacts() {
  try {
    const { data, status } = await Backend.get("organization/contacts/", {
      withCredentials: true,
      tags: ["organization-contacts"],
    });
    if (status === 200 && Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching organization contacts:", error);
    return [];
  }
}

export async function createOrganizationContact(contactData: {
  contact_name: string;
  phone_number: string;
  role_title?: string;
  is_primary?: boolean;
}) {
  try {
    const { data, status } = await Backend.post("organization/contacts/", {
      withCredentials: true,
      body: JSON.stringify(contactData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidatePath("/opportunities/add");
    return { data, status };
  } catch (error: any) {
    return { data: null, status: 500, error: error?.message || "فشل حفظ رقم الاتصال" };
  }
}

export async function getSolidarityItems(statusFilter?: string) {
  try {
    const query = statusFilter ? `?status=${statusFilter}` : "";
    const { data, status } = await Backend.get(`solidarity-store/${query}`, {
      tags: ["solidarity-store"],
    });
    return { data: Array.isArray(data) ? data : [], status };
  } catch (error) {
    console.error("Error fetching solidarity items:", error);
    return { data: [], status: 500 };
  }
}

export async function createSolidarityItem(formData: FormData) {
  try {
    const { data, status } = await Backend.post("solidarity-store/", {
      withCredentials: true,
      body: formData,
    });
    revalidatePath("/solidarity-store");
    return { data, status };
  } catch (error: any) {
    return { data: null, status: 500, error: error?.message };
  }
}

export async function getTrainings() {
  try {
    const { data, status } = await Backend.get("trainings/", {
      tags: ["trainings"],
    });
    return { data: Array.isArray(data) ? data : [], status };
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return { data: [], status: 500 };
  }
}

export async function enrollInTraining(trainingId: number) {
  try {
    const { data, status } = await Backend.post(`trainings/${trainingId}/enroll/`, {
      withCredentials: true,
    });
    revalidatePath("/trainings");
    return { data, status };
  } catch (error: any) {
    return { data: null, status: 500, error: error?.message };
  }
}

export async function getSupportTickets() {
  try {
    const { data, status } = await Backend.get("tickets/", {
      withCredentials: true,
      tags: ["tickets"],
    });
    return { data: Array.isArray(data) ? data : [], status };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return { data: [], status: 500 };
  }
}

export async function createSupportTicket(ticketData: {
  title: string;
  category: string;
  priority: string;
  description: string;
}) {
  try {
    const { data, status } = await Backend.post("tickets/", {
      withCredentials: true,
      body: JSON.stringify(ticketData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidatePath("/support");
    return { data, status };
  } catch (error: any) {
    return { data: null, status: 500, error: error?.message };
  }
}
