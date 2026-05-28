export interface Tournament {
  id: string;
  title: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  banner: string;
  date: string;
  time: string;
  slotsMax: number;
  slotsJoined: number;
  entryType: string;
  prizePool: string;
  teamsJoined: string[];
}

export interface Scrim {
  id: string;
  title: string;
  squadType: 'Solo' | 'Duo' | 'Squad';
  time: string;
  slotsMax: number;
  slotsJoined: number;
  type: 'daily' | 'weekend' | 'practice' | 'night';
  isLive?: boolean;
  registeredTeams?: string[];
}

export interface Stream {
  id: string;
  title: string;
  youtubeId: string;
  viewersCount: number;
  isLive: boolean;
  thumbnail: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'notice' | 'update' | 'rule' | 'result';
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  rating: number;
  kd: number;
  wins: number;
  avatar: string;
  type: 'player' | 'team';
  secondaryName?: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  level: number;
  wins: number;
  kd: number;
  avatar: string;
  joinedTournaments: string[];
  joinedScrims: string[];
  achievements: {
    title: string;
    description: string;
    unlockedAt: string;
  }[];
  isAdmin?: boolean;
}

export interface WinnerRecord {
  id: string;
  tournamentName: string;
  category: 'championship' | 'pro' | 'elite' | 'cup';
  prizeWon: string;
  completionDate: string;
  championTeam: string;
  runnerUpTeam: string;
  teamLogoEmoji: string;
  championRoster: string[];
  mvpPlayer: string;
  mvpKills: number;
}

