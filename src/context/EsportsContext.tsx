import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Tournament, Scrim, Stream, Announcement, LeaderboardEntry, UserProfile, WinnerRecord } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface EsportsContextType {
  tournaments: Tournament[];
  scrims: Scrim[];
  streams: Stream[];
  announcements: Announcement[];
  leaderboard: LeaderboardEntry[];
  winners: WinnerRecord[];
  user: UserProfile | null;
  isAdminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  // Auth actions
  login: (emailOrUsername: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (username: string, avatar: string) => void;
  // User interaction fields
  joinTournament: (id: string, teamName: string) => boolean;
  joinScrim: (id: string, teamName: string) => boolean;
  // Admin creations
  addTournament: (t: Omit<Tournament, 'id' | 'slotsJoined' | 'teamsJoined'>) => void;
  deleteTournament: (id: string) => void;
  addScrim: (s: Omit<Scrim, 'id' | 'slotsJoined' | 'registeredTeams'>) => void;
  deleteScrim: (id: string) => void;
  addStream: (str: Omit<Stream, 'id'>) => void;
  deleteStream: (id: string) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  addWinner: (w: Omit<WinnerRecord, 'id'>) => void;
  deleteWinner: (id: string) => void;
}

const EsportsContext = createContext<EsportsContextType | undefined>(undefined);

// Initial Seed Data matching the Prd UI
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't-1',
    title: 'VAYU CHAMPIONSHIP',
    status: 'upcoming',
    banner: '🏆',
    date: '25 May, 2024',
    time: '5:00 PM',
    slotsMax: 64,
    slotsJoined: 32,
    entryType: 'FREE ENTRY',
    prizePool: '₹5,00,000',
    teamsJoined: ['Team Omega', 'Alpha squad', 'Team Vayu', 'GodLike Esports']
  },
  {
    id: 't-2',
    title: 'VAYU PRO SERIES',
    status: 'upcoming',
    banner: '🎖️',
    date: '30 May, 2024',
    time: '6:00 PM',
    slotsMax: 32,
    slotsJoined: 16,
    entryType: 'FREE ENTRY',
    prizePool: '₹2,50,000',
    teamsJoined: ['S8UL', 'Revenant', 'Entity Gaming']
  },
  {
    id: 't-3',
    title: 'VAYU ELITE CUP',
    status: 'upcoming',
    banner: '👑',
    date: '01 June, 2024',
    time: '7:00 PM',
    slotsMax: 22,
    slotsJoined: 16,
    entryType: 'FREE ENTRY',
    prizePool: '₹1,50,000',
    teamsJoined: ['Gladiators', 'Vayu Elite', 'Team SoloMid']
  },
  {
    id: 't-4',
    title: 'VAYU BATTLE ARENA',
    status: 'ongoing',
    banner: '⚡',
    date: '27 May, 2024',
    time: '6:00 PM',
    slotsMax: 64,
    slotsJoined: 32,
    entryType: 'FREE ENTRY',
    prizePool: '₹10,00,000',
    teamsJoined: ['Team Soul', 'S8UL', 'Blind Esports', 'Enigma Gaming']
  },
  {
    id: 't-5',
    title: 'VAYU PRACTICE CUP',
    status: 'ongoing',
    banner: '🎯',
    date: '27 May, 2024',
    time: '8:00 PM',
    slotsMax: 32,
    slotsJoined: 16,
    entryType: 'FREE ENTRY',
    prizePool: 'Practice Room',
    teamsJoined: ['Mayhem', 'Hydra', '7sea Esports']
  },
  {
    id: 't-6',
    title: 'VAYU NIGHT CUP',
    status: 'ongoing',
    banner: '🌙',
    date: '27 May, 2024',
    time: '10:00 PM',
    slotsMax: 32,
    slotsJoined: 16,
    entryType: 'FREE ENTRY',
    prizePool: '₹50,000',
    teamsJoined: ['Insane', 'Team XSpark', 'Marcos Gaming']
  }
];

const INITIAL_SCRIMS: Scrim[] = [
  {
    id: 's-1',
    title: 'DAILY SCRIMS',
    squadType: 'Squad',
    time: '8:00 PM',
    slotsMax: 64,
    slotsJoined: 24,
    type: 'daily',
    isLive: true,
    registeredTeams: ['VAYU x GOD', 'RAGE OP', 'DEMONIC PLAYZ']
  },
  {
    id: 's-2',
    title: 'PRACTICE SCRIMS',
    squadType: 'Squad',
    time: '10:00 PM',
    slotsMax: 64,
    slotsJoined: 32,
    type: 'practice',
    isLive: true,
    registeredTeams: ['VAYU KING', 'VAYU BEAST']
  },
  {
    id: 's-3',
    title: 'WEEKEND SCRIMS',
    squadType: 'Squad',
    time: '6:00 PM',
    slotsMax: 64,
    slotsJoined: 16,
    type: 'weekend',
    isLive: false,
    registeredTeams: ['VAYU NINJA', 'BEAST MODE']
  },
  {
    id: 's-4',
    title: 'NIGHT SCRIMS',
    squadType: 'Squad',
    time: '11:30 PM',
    slotsMax: 64,
    slotsJoined: 16,
    type: 'night',
    isLive: false,
    registeredTeams: ['THUNDER BOLT', 'RAGE OP']
  },
  {
    id: 's-5',
    title: 'ELITE SCRIMS',
    squadType: 'Squad',
    time: '9:00 PM',
    slotsMax: 64,
    slotsJoined: 32,
    type: 'weekend',
    isLive: true,
    registeredTeams: ['Vayu Elite', 'Alpha Squad']
  },
  {
    id: 's-6',
    title: 'PRO SCRIMS',
    squadType: 'Squad',
    time: '7:30 PM',
    slotsMax: 64,
    slotsJoined: 16,
    type: 'practice',
    isLive: true,
    registeredTeams: ['Optimum', 'VAYUxGOD']
  }
];

const INITIAL_STREAMS: Stream[] = [
  {
    id: 'str-1',
    title: 'VAYU CHAMPIONSHIP - ROUND OF 32 LIVE',
    youtubeId: 'dQw4w9WgXcQ',
    viewersCount: 2400,
    isLive: true,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'str-2',
    title: 'VAYU BATTLE ARENA - CLAN SHOWDOWN',
    youtubeId: 'dQw4w9WgXcQ',
    viewersCount: 1700,
    isLive: true,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'str-3',
    title: 'VAYU PRO SERIES - DAY 2',
    youtubeId: 'dQw4w9WgXcQ',
    viewersCount: 3600,
    isLive: true,
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'str-4',
    title: 'VAYU ELITE CUP - GRAND FINALS LIVE',
    youtubeId: 'dQw4w9WgXcQ',
    viewersCount: 890,
    isLive: true,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'VAYU CHAMPIONSHIP REGISTRATIONS OPEN!',
    date: '20 May, 2024',
    content: 'Registrations for VAYU Championship are now open. Build your squad, enter registration and secure your slot immediately. Prize pool exceeds ₹5,00,000!',
    category: 'notice'
  },
  {
    id: 'ann-2',
    title: 'SCHEDULE UPDATE: BATTLE ARENA',
    date: '18 May, 2024',
    content: 'VAYU Battle Arena live schedule has been slightly updated to avoid overlap with evening scrim blocks. Match times have shifted by 30 mins.',
    category: 'update'
  },
  {
    id: 'ann-3',
    title: 'NEW PRACTICE SCRIMS SECURED',
    date: '17 May, 2024',
    content: 'Two new dynamic Practice Scrim sessions have been added to our block. Join daily for maximum performance improvement.',
    category: 'update'
  },
  {
    id: 'ann-4',
    title: 'IMPORTANT SECURITY NOTICE',
    date: '15 May, 2024',
    content: 'Players must review the official rulebook prior to entering active matches. Hack tools, overlay injection, and unregistered sub accounts result in absolute hardware bans.',
    category: 'notice'
  }
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'l-1', rank: 1, name: 'VAYUxGOD', rating: 3050, kd: 6.8, wins: 42, avatar: '👤', type: 'player', secondaryName: 'Team Omega' },
  { id: 'l-2', rank: 2, name: 'RAGE OP', rating: 2450, kd: 5.2, wins: 30, avatar: '👤', type: 'player', secondaryName: 'Alpha Squad' },
  { id: 'l-3', rank: 3, name: 'DEMONIC PLAYZ', rating: 2050, kd: 4.9, wins: 24, avatar: '👤', type: 'player', secondaryName: 'Gladiators' },
  { id: 'l-4', rank: 4, name: 'VAYU KING', rating: 1850, kd: 4.5, wins: 20, avatar: '👤', type: 'player' },
  { id: 'l-5', rank: 5, name: 'VAYU BEAST', rating: 1750, kd: 4.1, wins: 18, avatar: '👤', type: 'player' },
  { id: 'l-6', rank: 6, name: 'VAYU NINJA', rating: 1600, kd: 3.9, wins: 15, avatar: '👤', type: 'player' },
  { id: 'l-7', rank: 7, name: 'BEAST MODE', rating: 1500, kd: 3.7, wins: 12, avatar: '👤', type: 'player' },
  { id: 'l-8', rank: 8, name: 'THUNDER BOLT', rating: 1400, kd: 3.2, wins: 10, avatar: '👤', type: 'player' }
];

const INITIAL_WINNERS: WinnerRecord[] = [
  {
    id: 'w-1',
    tournamentName: 'VAYU CHAMPIONSHIP 2026',
    category: 'championship',
    prizeWon: '₹5,00,000',
    completionDate: '25 May, 2026',
    championTeam: 'TEAM OMEGA',
    runnerUpTeam: 'ALPHA SQUAD',
    teamLogoEmoji: '👑',
    championRoster: ['OmegaLeader', 'OmegaAim', 'OmegaFrag', 'OmegaCover'],
    mvpPlayer: 'OmegaAim',
    mvpKills: 32
  },
  {
    id: 'w-2',
    tournamentName: 'VAYU BATTLE ARENA (CLAN WARS)',
    category: 'championship',
    prizeWon: '₹10,00,000',
    completionDate: '20 May, 2026',
    championTeam: 'S8UL CLAN',
    runnerUpTeam: 'GODLIKE ESPORTS',
    teamLogoEmoji: '⚡',
    championRoster: ['S8UL_Mortal', 'S8UL_Regaltos', 'S8UL_Viper', 'S8UL_Aman'],
    mvpPlayer: 'S8UL_Regaltos',
    mvpKills: 45
  },
  {
    id: 'w-3',
    tournamentName: 'VAYU PRO SERIES',
    category: 'pro',
    prizeWon: '₹2,50,000',
    completionDate: '15 May, 2026',
    championTeam: 'REVENANT',
    runnerUpTeam: 'BLIND ESPORTS',
    teamLogoEmoji: '💀',
    championRoster: ['Rev_Sensei', 'Rev_Fierce', 'Rev_Aquanox', 'Rev_MJ'],
    mvpPlayer: 'Rev_Sensei',
    mvpKills: 28
  },
  {
    id: 'w-4',
    tournamentName: 'VAYU ELITE CUP',
    category: 'elite',
    prizeWon: '₹1,50,000',
    completionDate: '01 June, 2026',
    championTeam: 'GLADIATORS',
    runnerUpTeam: 'TEAM SOUL',
    teamLogoEmoji: '⚔️',
    championRoster: ['Gla_Destro', 'Gla_Justin', 'Gla_DeltaPG', 'Gla_Shogun'],
    mvpPlayer: 'Gla_DeltaPG',
    mvpKills: 24
  },
  {
    id: 'w-5',
    tournamentName: 'VAYU NIGHT CUP',
    category: 'cup',
    prizeWon: '₹50,000',
    completionDate: '12 May, 2026',
    championTeam: 'TEAM XSPARK',
    runnerUpTeam: 'INSANE ESPORTS',
    teamLogoEmoji: '🌙',
    championRoster: ['TxS_Scout', 'TxS_Aditya', 'TxS_Sarang', 'TxS_Dreams'],
    mvpPlayer: 'TxS_Aditya',
    mvpKills: 19
  }
];

export const EsportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [leaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdminMode, setAdminMode] = useState<boolean>(false);

  // Validate connection to Firestore on initial boot as required by mandate
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Real-time Firestore Sync Listeners with Auto Seeding (Only once if empty)
  useEffect(() => {
    // 0. Robust Config-Based One-Time Database Seeding Trigger
    const configRef = doc(db, 'system', 'config');
    getDoc(configRef).then(async (configSnap) => {
      if (!configSnap.exists()) {
        console.log("Database not seeded. Initializing core esports pools...");
        try {
          const batch = writeBatch(db);
          INITIAL_TOURNAMENTS.forEach((t) => {
            batch.set(doc(db, 'tournaments', t.id), t);
          });
          INITIAL_SCRIMS.forEach((s) => {
            batch.set(doc(db, 'scrims', s.id), s);
          });
          INITIAL_STREAMS.forEach((st) => {
            batch.set(doc(db, 'streams', st.id), st);
          });
          INITIAL_ANNOUNCEMENTS.forEach((ann) => {
            batch.set(doc(db, 'announcements', ann.id), ann);
          });
          INITIAL_WINNERS.forEach((w) => {
            batch.set(doc(db, 'winners', w.id), w);
          });
          batch.set(configRef, { seeded: true, seededAt: new Date().toISOString() });
          await batch.commit();
          console.log("Database seeded successfully.");
        } catch (err) {
          console.error("Database seeding failed: ", err);
        }
      }
    }).catch((err) => {
      console.error("Failed to fetch system/config doc: ", err);
    });

    // 1. Tournaments Synchronizer (Syncs dynamically with state)
    const unsubscribeTournaments = onSnapshot(collection(db, 'tournaments'), (snapshot) => {
      const list: Tournament[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Tournament);
      });
      // Sort to maintain visual consistency
      list.sort((a,b) => a.id.localeCompare(b.id));
      setTournaments(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'tournaments');
    });

    // 2. Scrims Synchronizer (Syncs dynamically with state)
    const unsubscribeScrims = onSnapshot(collection(db, 'scrims'), (snapshot) => {
      const list: Scrim[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Scrim);
      });
      list.sort((a,b) => a.id.localeCompare(b.id));
      setScrims(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'scrims');
    });

    // 3. Streams Synchronizer (Syncs dynamically with state)
    const unsubscribeStreams = onSnapshot(collection(db, 'streams'), (snapshot) => {
      const list: Stream[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Stream);
      });
      list.sort((a,b) => a.id.localeCompare(b.id));
      setStreams(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'streams');
    });

    // 4. Announcements Synchronizer (Syncs dynamically with state)
    const unsubscribeAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const list: Announcement[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Announcement);
      });
      list.sort((a,b) => a.id.localeCompare(b.id));
      setAnnouncements(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'announcements');
    });

    // 5. Winners Synchronizer (Tracks live entries)
    const unsubscribeWinners = onSnapshot(collection(db, 'winners'), (snapshot) => {
      const list: WinnerRecord[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as WinnerRecord);
      });
      // Sort to consistent visual order: recent / custom ID first or standard sort
      list.sort((a,b) => b.id.localeCompare(a.id));
      setWinners(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'winners');
    });

    return () => {
      unsubscribeTournaments();
      unsubscribeScrims();
      unsubscribeStreams();
      unsubscribeAnnouncements();
      unsubscribeWinners();
    };
  }, []);

  // Auth & Profile Listener
  useEffect(() => {
    let unsubscribeUser: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        unsubscribeUser();
        const userRef = doc(db, 'users', u.uid);
        
        unsubscribeUser = onSnapshot(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            
            const adminEmails = [
              "krishnagameingzoneteluguff@gmail.com"
            ];
            const hasAdminEmail = u.email && adminEmails.includes(u.email);
            
            // Automatically upgrade outdated database entry if they have the admin email but lack the flag
            if (hasAdminEmail && !data.isAdmin) {
              setDoc(userRef, { isAdmin: true }, { merge: true }).catch(err => {
                console.error("Auto upgrade admin document failed:", err);
              });
            }

            setUser({
              ...data,
              isAdmin: data.isAdmin || hasAdminEmail
            });
            setAdminMode(!!(data.isAdmin || hasAdminEmail));
          } else {
            // New user registration defaults
            const isDefaultAdmin = u.email === 'krishnagameingzoneteluguff@gmail.com';
            const defaultUser: UserProfile = {
              uid: u.uid,
              username: u.displayName || u.email?.split('@')[0] || 'Vayu Player',
              email: u.email || `${u.uid}@vayu.gg`,
              level: isDefaultAdmin ? 45 : 12,
              wins: isDefaultAdmin ? 154 : 10,
              kd: isDefaultAdmin ? 5.8 : 1.8,
              avatar: u.photoURL || (isDefaultAdmin 
                ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'),
              joinedTournaments: isDefaultAdmin ? ['t-1', 't-4'] : [],
              joinedScrims: isDefaultAdmin ? ['s-1', 's-2'] : [],
              achievements: isDefaultAdmin ? [
                { title: 'Arena Dominator', description: 'Win 50 tournament rounds', unlockedAt: '12 May, 2024' },
                { title: 'Godlike Aim', description: 'Maintain K/D ratio over 5.0', unlockedAt: '18 May, 2024' },
                { title: 'Alpha Badge', description: 'Be part of top 3 tier clans', unlockedAt: '24 May, 2024' }
              ] : [
                { title: 'Novice Recruit', description: 'Join the VAYU platform', unlockedAt: new Date().toLocaleDateString() }
              ],
              isAdmin: isDefaultAdmin
            };

            try {
              await setDoc(userRef, defaultUser);
              setUser(defaultUser);
              setAdminMode(isDefaultAdmin);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `users/${u.uid}`);
            }
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${u.uid}`);
        });

      } else {
        unsubscribeUser();
        setUser(null);
        setAdminMode(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser();
    };
  }, []);

  // Auth Actions
  const login = async (emailOrUsername: string, pass: string): Promise<boolean> => {
    // 1. Google Auth Popup Setup
    if (emailOrUsername === 'google_user' || emailOrUsername === 'google') {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        return true;
      } catch (err) {
        console.error("Google authenticated popup fails:", err);
        throw err;
      }
    }

    // 2. Email / Username Login Router
    let email = emailOrUsername;
    let password = pass;

    if (emailOrUsername.toLowerCase() === 'admin') {
      email = 'admin@vayu.esports';
      password = pass || 'admin123';
    } else if (!emailOrUsername.includes('@')) {
      email = `${emailOrUsername.toLowerCase()}@vayu.gg`;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err: any) {
      // Auto-register to avoid bad UX on mock attempts
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          return true;
        } catch (regErr) {
          console.error("Dynamic registration fails:", regErr);
          throw regErr;
        }
      }
      console.error("Sign in failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout fails:", err);
    }
  };

  const updateProfile = (username: string, avatar: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    updateDoc(userRef, { username, avatar }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    });
  };

  // Joins
  const joinTournament = (id: string, teamName: string): boolean => {
    if (!user) return false;
    
    // Check if already joined
    if (user.joinedTournaments.includes(id)) return false;

    const tourIndex = tournaments.findIndex(t => t.id === id);
    if (tourIndex === -1) return false;

    const t = tournaments[tourIndex];
    if (t.slotsJoined >= t.slotsMax) return false;

    const runAsync = async () => {
      try {
        const batch = writeBatch(db);
        const tourRef = doc(db, 'tournaments', id);
        const teamToAdd = teamName || user.username;
        batch.update(tourRef, {
          slotsJoined: t.slotsJoined + 1,
          teamsJoined: [...t.teamsJoined, teamToAdd]
        });

        const userRef = doc(db, 'users', user.uid);
        batch.update(userRef, {
          joinedTournaments: [...user.joinedTournaments, id]
        });

        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `tournaments/${id}`);
      }
    };
    runAsync().catch(console.error);

    return true;
  };

  const joinScrim = (id: string, teamName: string): boolean => {
    if (!user) return false;

    if (user.joinedScrims.includes(id)) return false;

    const scrimIndex = scrims.findIndex(s => s.id === id);
    if (scrimIndex === -1) return false;

    const s = scrims[scrimIndex];
    if (s.slotsJoined >= s.slotsMax) return false;

    const runAsync = async () => {
      try {
        const batch = writeBatch(db);
        const scrimRef = doc(db, 'scrims', id);
        const teamToAdd = teamName || user.username;
        batch.update(scrimRef, {
          slotsJoined: s.slotsJoined + 1,
          registeredTeams: [...(s.registeredTeams || []), teamToAdd]
        });

        const userRef = doc(db, 'users', user.uid);
        batch.update(userRef, {
          joinedScrims: [...user.joinedScrims, id]
        });

        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `scrims/${id}`);
      }
    };
    runAsync().catch(console.error);

    return true;
  };

  // Admin creations
  const addTournament = (t: Omit<Tournament, 'id' | 'slotsJoined' | 'teamsJoined'>) => {
    const id = 't-' + Date.now();
    const newTournament: Tournament = {
      ...t,
      id,
      slotsJoined: 0,
      teamsJoined: []
    };
    setDoc(doc(db, 'tournaments', id), newTournament).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `tournaments/${id}`);
    });
  };

  const deleteTournament = (id: string) => {
    deleteDoc(doc(db, 'tournaments', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `tournaments/${id}`);
    });
  };

  const addScrim = (s: Omit<Scrim, 'id' | 'slotsJoined' | 'registeredTeams'>) => {
    const id = 's-' + Date.now();
    const newScrim: Scrim = {
      ...s,
      id,
      slotsJoined: 0,
      registeredTeams: []
    };
    setDoc(doc(db, 'scrims', id), newScrim).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `scrims/${id}`);
    });
  };

  const deleteScrim = (id: string) => {
    deleteDoc(doc(db, 'scrims', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `scrims/${id}`);
    });
  };

  const addStream = (str: Omit<Stream, 'id'>) => {
    const id = 'str-' + Date.now();
    const newStream: Stream = {
      ...str,
      id
    };
    setDoc(doc(db, 'streams', id), newStream).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `streams/${id}`);
    });
  };

  const deleteStream = (id: string) => {
    deleteDoc(doc(db, 'streams', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `streams/${id}`);
    });
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const id = 'ann-' + Date.now();
    const newAnn: Announcement = {
      ...ann,
      id
    };
    setDoc(doc(db, 'announcements', id), newAnn).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `announcements/${id}`);
    });
  };

  const deleteAnnouncement = (id: string) => {
    deleteDoc(doc(db, 'announcements', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `announcements/${id}`);
    });
  };

  const addWinner = (w: Omit<WinnerRecord, 'id'>) => {
    const id = 'w-' + Date.now();
    const newWinner: WinnerRecord = {
      ...w,
      id
    };
    setDoc(doc(db, 'winners', id), newWinner).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `winners/${id}`);
    });
  };

  const deleteWinner = (id: string) => {
    deleteDoc(doc(db, 'winners', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `winners/${id}`);
    });
  };

  return (
    <EsportsContext.Provider
      value={{
        tournaments,
        scrims,
        streams,
        announcements,
        leaderboard,
        winners,
        user,
        isAdminMode,
        setAdminMode,
        login,
        logout,
        updateProfile,
        joinTournament,
        joinScrim,
        addTournament,
        deleteTournament,
        addScrim,
        deleteScrim,
        addStream,
        deleteStream,
        addAnnouncement,
        deleteAnnouncement,
        addWinner,
        deleteWinner
      }}
    >
      {children}
    </EsportsContext.Provider>
  );
};

export const useEsports = () => {
  const context = useContext(EsportsContext);
  if (context === undefined) {
    throw new Error('useEsports must be used within an EsportsProvider');
  }
  return context;
};
