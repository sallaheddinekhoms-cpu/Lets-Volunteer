"use server"

import { Backend } from "@/lib/helper"
import { updateTag } from "next/cache"


export interface Announcement {
    id: number
    title: string
    image_url: string
    cloudinary_public_id?: string
    description?: string
    is_active: boolean
    order: number
    created_at: string
    updated_at: string
}

export async function getAnnouncements() {
    const { data, status } = await Backend.get("announcements", {
        withCredentials: true,
        tags: ['announcements']
    })

    return { data, status }
}

export async function getAnnouncement(id: number) {
    const { data, status } = await Backend.get(`announcements/${id}`, {
        withCredentials: true,
    })

    return { data, status }
}

export async function addAnnouncement(formData: FormData) {
    const { data } = await Backend.post("announcements/", {
        withCredentials: true,
        body: formData
    })

    updateTag('announcements')
    return data
}

export async function updateAnnouncement(id: number, formData: FormData) {
    const { data } = await Backend.patch(`announcements/${id}/`, formData, {
        withCredentials: true
    })

    updateTag('announcements')
    return data
}

export async function deleteAnnouncement(id: number) {
    const { data } = await Backend.delete(`announcements/${id}/`, {
        withCredentials: true,
    })

    updateTag('announcements')
    return data
}
