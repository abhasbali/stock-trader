import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  getUserProfile, 
  createUserProfile, 
  getUserPortfolios,
  getUserWatchlists,
  getUserAlerts,
  createPortfolio,
  createWatchlist
} from '@/lib/mock-database';
import { UserProfile, Portfolio, Watchlist, Alert } from '@/lib/mock-database';

export const useUserProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let userProfile = getUserProfile(user.id);
        
        if (!userProfile) {
          // Create profile if it doesn't exist
          userProfile = createUserProfile({
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            full_name: user.fullName || '',
            avatar_url: user.imageUrl || ''
          });
        }
        
        setProfile(userProfile);
      } catch (err) {
        console.error('Error initializing user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [user]);

  return { profile, loading, error, refetch: () => setLoading(true) };
};

export const usePortfolios = () => {
  const { user } = useUser();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let userPortfolios = getUserPortfolios(user.id);
        
        if (!userPortfolios || userPortfolios.length === 0) {
          // Create default portfolio if none exists
          let profile = getUserProfile(user.id);
          if (!profile) {
            profile = createUserProfile({
              clerk_user_id: user.id,
              email: user.emailAddresses[0]?.emailAddress || '',
              full_name: user.fullName || '',
              avatar_url: user.imageUrl || ''
            });
          }
          
          if (profile) {
            const defaultPortfolio = createPortfolio(user.id, {
              user_id: profile.id,
              name: 'Main Portfolio',
              total_value: 10000,
              cash_balance: 10000
            });
            userPortfolios = [defaultPortfolio];
          }
        }
        
        setPortfolios(userPortfolios || []);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError(err instanceof Error ? err.message : 'Failed to load portfolios');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user]);

  return { portfolios, loading, error, refetch: () => setLoading(true) };
};

export const useWatchlists = () => {
  const { user } = useUser();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlists = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let userWatchlists = getUserWatchlists(user.id);
        
        if (!userWatchlists || userWatchlists.length === 0) {
          // Create default watchlist if none exists
          let profile = getUserProfile(user.id);
          if (!profile) {
            profile = createUserProfile({
              clerk_user_id: user.id,
              email: user.emailAddresses[0]?.emailAddress || '',
              full_name: user.fullName || '',
              avatar_url: user.imageUrl || ''
            });
          }
          
          if (profile) {
            const defaultWatchlist = createWatchlist(user.id, {
              user_id: profile.id,
              name: 'My Watchlist',
              symbols: JSON.stringify(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'])
            });
            userWatchlists = [defaultWatchlist];
          }
        }
        
        setWatchlists(userWatchlists || []);
      } catch (err) {
        console.error('Error fetching watchlists:', err);
        setError(err instanceof Error ? err.message : 'Failed to load watchlists');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlists();
  }, [user]);

  return { watchlists, loading, error, refetch: () => setLoading(true) };
};

export const useAlerts = () => {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userAlerts = getUserAlerts(user.id);
        setAlerts(userAlerts || []);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user]);

  return { alerts, loading, error, refetch: () => setLoading(true) };
};