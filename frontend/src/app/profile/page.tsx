import { getAccessTokenInfo } from '@/utils/auth'
import React from 'react'
import VolunteerProfilePage from './_volunteer/volunteer-profile'
import OrganizationPage from './_organization/organization-profile'

const ProfilePage = async () => {
  try {
    const { role } = await getAccessTokenInfo();
    return (
      <>
        {role === "VOLUNTEER" ? <VolunteerProfilePage /> : <OrganizationPage />}
      </>
    );
  } catch (error) {
    console.error('Profile page authentication error:', error);
    return <div>Error loading profile. Please try again later.</div>;
  }
};

export default ProfilePage;