export interface AdminStats {
    totalMatches: number;
    upcomingMatches: number;
    completedMatches: number;
    matchesPerTeam: Record<string, number>;
    totalRevenue: number;
    totalSpectators: number;
    averageSpectators: number;
    revenueByMonth: Record<string, number>;
    spectatorsByMonth: Record<string, number>;
  }
  
  export interface RevenueChartData {
    revenueByMonth: Record<string, number>;
  }
  
  export interface MatchesChartData {
    matchesPerTeam: Record<string, number>;
  }