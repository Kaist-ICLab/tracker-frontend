export interface DataCard {
  id: string;
  title: string;
  recordCount: number;
  updatedAt: Date;
  iconName?: string; // For Ionicons
}

export interface DashboardData {
  cards: DataCard[];
  isLoading: boolean;
  error?: string;
} 