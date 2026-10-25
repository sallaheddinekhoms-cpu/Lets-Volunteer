"use server"

import { Backend } from "@/lib/helper"

export async function sendEmail(mail_subject: any) {
  try {
    const { data } = await Backend.post("contact/", {
      body: mail_subject,
      withCredentials: false,
    });
    return data;
  } catch (error: any) {
    console.error("sendEmail error:", error);
    throw error;
  }
}

export async function getContactMessages() {
  try {
    const { data } = await Backend.get("contact/", {
      withCredentials: true,
    });
    return data || [];
  } catch (error: any) {
    console.error("getContactMessages error:", error);
    return [];
  }
}

export async function deleteContactMessage(id: number | string) {
  try {
    const { data } = await Backend.delete(`contact/?id=${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    console.error("deleteContactMessage error:", error);
    throw error;
  }
}
