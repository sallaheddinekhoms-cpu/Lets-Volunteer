"use server"

import { getAccessTokenInfo } from "@/utils/auth"
import { getOpportunityById } from "@/data/Opportunities"

export async function canEditOpportunity(opportunityId: string): Promise<boolean> {
  try {
    // Get current user info
    const tokenInfo = await getAccessTokenInfo()
    
    // Check if user is authenticated and has an organization role
    if (!tokenInfo.user_id || tokenInfo.role !== 'organization') {
      return false
    }

    // Get opportunity details
    const { data: opportunity, status } = await getOpportunityById(opportunityId)
    
    if (status !== 200 || !opportunity) {
      return false
    }

    // Check if the current user's organization owns this opportunity
    // Note: We would need to get the current user's organization ID to compare
    // For now, we'll assume the user ID matches the organization ID if they're an organization
    return opportunity.organization.id === tokenInfo.user_id
    
  } catch (error) {
    console.error("Error checking edit permissions:", error)
    return false
  }
}

export async function getCurrentUserOrganizationId(): Promise<string | null> {
  try {
    const tokenInfo = await getAccessTokenInfo()
    
    if (tokenInfo.role === 'ORGANIZATION') {
      return tokenInfo.user_id
    }
    
    return null
  } catch (error) {
    console.error("Error getting organization ID:", error)
    return null
  }
}