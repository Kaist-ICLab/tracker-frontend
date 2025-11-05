import { useState, useEffect } from 'react';
import { DataCard, DashboardData } from '../types/dashboard';

const SAMPLE_DATA: DataCard[] = [
  {
    id: '1',
    title: 'Accelerometer',
    recordCount: 342,
    updatedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    iconName: 'speedometer',
  },
  {
    id: '2',
    title: 'PPG',
    recordCount: 189,
    updatedAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    iconName: 'pulse',
  },
  {
    id: '3',
    title: 'Heart Rate',
    recordCount: 128,
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    iconName: 'heart',
  },
  {
    id: '4',
    title: 'Location',
    recordCount: 276,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    iconName: 'location',
  },
  {
    id: '5',
    title: 'Skin Temperature',
    recordCount: 156,
    updatedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    iconName: 'thermometer',
  },
  {
    id: '6',
    title: 'Skin Conductivity',
    recordCount: 203,
    updatedAt: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
    iconName: 'flash',
  },
];

export const useDashboardData = (): DashboardData => {
  const [data, setData] = useState<DashboardData>({
    cards: [],
    isLoading: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Add some excitement with a random delay
        const delay = Math.floor(Math.random() * 2000) + 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Shuffle the cards for variety
        const shuffledCards = [...SAMPLE_DATA].sort(() => Math.random() - 0.5);
        
        setData({
          cards: shuffledCards,
          isLoading: false,
        });
      } catch (error) {
        setData({
          cards: [],
          isLoading: false,
          error: 'Oops! Something went wrong 😅',
        });
      }
    };

    loadData();
  }, []);

  return {
    isLoading: data.isLoading,
    cards: data.cards
  }
}; 