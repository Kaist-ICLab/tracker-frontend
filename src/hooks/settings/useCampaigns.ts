import { useState } from 'react';
import { Campaign } from '@/types/settings';

const MOCK_CAMPAIGNS: Campaign[] = [
    { id: 'c1', name: '수면 개선 챌린지', description: '수면 패턴을 개선하고 건강을 챙기세요.' },
    { id: 'c2', name: '활동량 UP', description: '하루 만보 걷기 도전!' },
    { id: 'c3', name: '식사 기록 캠페인', description: '식습관을 기록하고 분석받기' },
];

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);

    const loadCampaigns = async () => {
        setCampaigns(MOCK_CAMPAIGNS);
    };  

    return {
        campaigns,
        loadCampaigns
    };
}; 