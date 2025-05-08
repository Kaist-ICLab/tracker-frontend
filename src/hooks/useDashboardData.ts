import { useState, useEffect } from 'react';
import { DataCard, DashboardData } from '../types/dashboard';

const SAMPLE_DATA: DataCard[] = [
  {
    id: '1',
    title: 'Heart Rate',
    recordCount: 128,
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    iconName: 'heart',
  },
  {
    id: '2',
    title: 'Steps',
    recordCount: 256,
    updatedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    iconName: 'footsteps',
  },
  {
    id: '3',
    title: 'Sleep',
    recordCount: 32,
    updatedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    iconName: 'bed',
  },
  {
    id: '4',
    title: 'Blood Pressure',
    recordCount: 64,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    iconName: 'fitness',
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