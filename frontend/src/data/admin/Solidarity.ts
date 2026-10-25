"use server"

import { Backend } from "@/lib/helper"

export async function getAdminSolidarityRequests(status?: string) {
  try {
    const url = status && status !== "all" 
      ? `admin/solidarity-requests/?status=${status}` 
      : "admin/solidarity-requests/";
    const { data } = await Backend.get(url, {
      withCredentials: true,
    });
    return data || [];
  } catch (error: any) {
    console.error("getAdminSolidarityRequests error:", error);
    return [];
  }
}

export async function updateSolidarityRequestStatus(id: string, newStatus: string, admin_note?: string) {
  try {
    const { data } = await Backend.patch(
      `admin/solidarity-requests/${id}/`,
      { status: newStatus, admin_note },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    console.error("updateSolidarityRequestStatus error:", error);
    throw error;
  }
}

export async function deleteSolidarityRequest(id: string) {
  try {
    const { data } = await Backend.delete(`admin/solidarity-requests/${id}/`, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    console.error("deleteSolidarityRequest error:", error);
    throw error;
  }
}
