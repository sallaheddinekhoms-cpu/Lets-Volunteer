"use server"

import { Backend } from "@/lib/helper"
import { updateTag } from "next/cache"


export interface Video {
    id: number
    title: string
    video_url: string
    cloudinary_public_id?: string
    description?: string
    is_active: boolean
    order: number
    created_at: string
    updated_at: string
}

export async function getVideos() {
    const { data, status } = await Backend.get("videos", {
        withCredentials: true,
        tags: ['videos']
    })

    return { data, status }
}

export async function getVideo(id: number) {
    const { data, status } = await Backend.get(`videos/${id}`, {
        withCredentials: true,
    })

    return { data, status }
}

export async function addVideo(formData: FormData) {
    const { data } = await Backend.post("videos/", {
        withCredentials: true,
        body: formData
    })

    updateTag('videos')
    return data
}

export async function updateVideo(id: number, formData: FormData) {
    const { data } = await Backend.patch(`videos/${id}/`, formData, {
        withCredentials: true
    })

    updateTag('videos')
    return data
}

export async function deleteVideo(id: number) {
    const { data } = await Backend.delete(`videos/${id}/`, {
        withCredentials: true,
    })

    updateTag('videos')
    return data
}
