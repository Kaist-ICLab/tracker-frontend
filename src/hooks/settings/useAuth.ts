import { Profile } from '@/types/settings';
import { useState } from 'react';


const MOCK_PROFILE = {
    uid: "1234567890",
    name: '홍길동',
    email: 'hong@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    campaignId: 'c1',
};

export const useAuth = () => {
    const [profile, setProfile] = useState<Profile|null>(MOCK_PROFILE);

    const logout = async () => {
        setProfile(null);
    }

    const login = async () => {
        setProfile(MOCK_PROFILE);
    }

    const joinCampaign = async (campaignId: string) => {
        setProfile(prev => prev ? { ...prev, campaignId } : null);
    }

    const leaveCampaign = async () => {
        setProfile(prev => prev ? { ...prev, campaignId: undefined } : null);
    }

    return {
        profile,
        logout,
        login,
        joinCampaign,
        leaveCampaign,
    };
}; 