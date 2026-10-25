import { FC } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  MapPin
} from 'lucide-react';
import { OrganizationProfile } from '@/types/organization';


interface OrganizationProfileProps {
  profile: OrganizationProfile;
}

const OrganizationInfo: FC<OrganizationProfileProps> = ({ profile }) => {
  // Generate initials for logo placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="overflow-hidden bg-white shadow-md">
        <div className="bg-white p-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
              {profile.logo ? (
                <img
                  src={typeof profile.logo === 'string' ? profile.logo : URL.createObjectURL(profile.logo)}
                  alt={`${profile.organization_name} Logo`}
                  className="w-20 h-20 object-contain rounded-full"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {getInitials(profile.organization_name)}
                </span>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{profile.organization_name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-4 h-4" />
                <p>{profile.wilaya}, {profile.daira}</p>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gray-50 border">
              <CardContent className="p-4">
                <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Email</div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                    {profile.email}
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border">
              <CardContent className="p-4">
                <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Phone</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${profile.phone_number}`} className="text-primary hover:underline">
                    {profile.phone_number}
                  </a>
                </div>
              </CardContent>
            </Card>
            
            {profile.website && (
              <Card className="bg-gray-50 border">
                <CardContent className="p-4">
                  <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Website</div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline break-all"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(profile.facebook || profile.instagram) && (
              <Card className="bg-gray-50 border">
                <CardContent className="p-4">
                  <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Social Media</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.facebook && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        asChild
                      >
                        <a href={profile.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="w-4 h-4" />
                          <span>Facebook</span>
                        </a>
                      </Button>
                    )}
                    
                    {profile.instagram && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        asChild
                      >
                        <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="w-4 h-4" />
                          <span>Instagram</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold border-b-2 border-primary pb-2 inline-block mb-4">
              About Us
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {profile.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationInfo;