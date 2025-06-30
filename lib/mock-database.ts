// Mock database implementation for client-side use
export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  total_value: number;
  cash_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: string;
  portfolio_id: string;
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  portfolio_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  status: 'pending' | 'filled' | 'cancelled';
  executed_at?: string;
  created_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  symbols: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  symbol: string;
  condition: 'above' | 'below';
  target_price: number;
  is_active: boolean;
  created_at: string;
}

// In-memory storage for demo purposes
let mockData: {
  profiles: UserProfile[];
  portfolios: Portfolio[];
  positions: Position[];
  trades: Trade[];
  watchlists: Watchlist[];
  alerts: Alert[];
} = {
  profiles: [],
  portfolios: [],
  positions: [],
  trades: [],
  watchlists: [],
  alerts: []
};

// Utility function to generate UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// User Profile functions
export const createUserProfile = (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
  const newProfile: UserProfile = {
    ...profile,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockData.profiles.push(newProfile);
  return newProfile;
};

export const getUserProfile = (clerkUserId: string): UserProfile | null => {
  return mockData.profiles.find(p => p.clerk_user_id === clerkUserId) || null;
};

export const updateUserProfile = (clerkUserId: string, updates: Partial<UserProfile>) => {
  const profileIndex = mockData.profiles.findIndex(p => p.clerk_user_id === clerkUserId);
  if (profileIndex !== -1) {
    mockData.profiles[profileIndex] = {
      ...mockData.profiles[profileIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return mockData.profiles[profileIndex];
  }
  return null;
};

// Portfolio functions
export const createPortfolio = (clerkUserId: string, portfolio: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>) => {
  const newPortfolio: Portfolio = {
    ...portfolio,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockData.portfolios.push(newPortfolio);
  return newPortfolio;
};

export const getUserPortfolios = (clerkUserId: string): Portfolio[] => {
  const profile = getUserProfile(clerkUserId);
  if (!profile) return [];
  
  return mockData.portfolios.filter(p => p.user_id === profile.id);
};

export const getPortfolioById = (clerkUserId: string, portfolioId: string): Portfolio | null => {
  const profile = getUserProfile(clerkUserId);
  if (!profile) return null;
  
  return mockData.portfolios.find(p => p.id === portfolioId && p.user_id === profile.id) || null;
};

// Position functions
export const createOrUpdatePosition = (clerkUserId: string, position: Omit<Position, 'id' | 'created_at' | 'updated_at'>) => {
  const existingIndex = mockData.positions.findIndex(
    p => p.portfolio_id === position.portfolio_id && p.symbol === position.symbol
  );
  
  if (existingIndex !== -1) {
    // Update existing position
    const existing = mockData.positions[existingIndex];
    const newQuantity = existing.quantity + position.quantity;
    const newAveragePrice = ((existing.average_price * existing.quantity) + (position.average_price * position.quantity)) / newQuantity;
    const newMarketValue = newQuantity * position.current_price;
    const newUnrealizedPnl = (position.current_price - newAveragePrice) * newQuantity;
    
    mockData.positions[existingIndex] = {
      ...existing,
      quantity: newQuantity,
      average_price: newAveragePrice,
      current_price: position.current_price,
      market_value: newMarketValue,
      unrealized_pnl: newUnrealizedPnl,
      updated_at: new Date().toISOString()
    };
    
    return mockData.positions[existingIndex];
  } else {
    // Create new position
    const newPosition: Position = {
      ...position,
      id: generateId(),
      market_value: position.quantity * position.current_price,
      unrealized_pnl: (position.current_price - position.average_price) * position.quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockData.positions.push(newPosition);
    return newPosition;
  }
};

export const getPositionsByPortfolio = (clerkUserId: string, portfolioId: string): Position[] => {
  return mockData.positions.filter(p => p.portfolio_id === portfolioId);
};

// Trade functions
export const createTrade = (clerkUserId: string, trade: Omit<Trade, 'id' | 'created_at'>) => {
  const newTrade: Trade = {
    ...trade,
    id: generateId(),
    created_at: new Date().toISOString()
  };
  
  mockData.trades.push(newTrade);
  return newTrade;
};

export const getTradesByPortfolio = (clerkUserId: string, portfolioId: string, limit = 50): Trade[] => {
  return mockData.trades
    .filter(t => t.portfolio_id === portfolioId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const updateTradeStatus = (clerkUserId: string, tradeId: string, status: Trade['status'], executedAt?: string) => {
  const tradeIndex = mockData.trades.findIndex(t => t.id === tradeId);
  if (tradeIndex !== -1) {
    mockData.trades[tradeIndex] = {
      ...mockData.trades[tradeIndex],
      status,
      executed_at: executedAt
    };
    return mockData.trades[tradeIndex];
  }
  return null;
};

// Watchlist functions
export const createWatchlist = (clerkUserId: string, watchlist: Omit<Watchlist, 'id' | 'created_at' | 'updated_at'>) => {
  const newWatchlist: Watchlist = {
    ...watchlist,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockData.watchlists.push(newWatchlist);
  return newWatchlist;
};

export const getUserWatchlists = (clerkUserId: string): Watchlist[] => {
  const profile = getUserProfile(clerkUserId);
  if (!profile) return [];
  
  return mockData.watchlists.filter(w => w.user_id === profile.id);
};

export const updateWatchlist = (clerkUserId: string, watchlistId: string, updates: Partial<Watchlist>) => {
  const watchlistIndex = mockData.watchlists.findIndex(w => w.id === watchlistId);
  if (watchlistIndex !== -1) {
    mockData.watchlists[watchlistIndex] = {
      ...mockData.watchlists[watchlistIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return mockData.watchlists[watchlistIndex];
  }
  return null;
};

// Alert functions
export const createAlert = (clerkUserId: string, alert: Omit<Alert, 'id' | 'created_at'>) => {
  const newAlert: Alert = {
    ...alert,
    id: generateId(),
    created_at: new Date().toISOString()
  };
  
  mockData.alerts.push(newAlert);
  return newAlert;
};

export const getUserAlerts = (clerkUserId: string): Alert[] => {
  const profile = getUserProfile(clerkUserId);
  if (!profile) return [];
  
  return mockData.alerts.filter(a => a.user_id === profile.id && a.is_active);
};

export const updateAlert = (clerkUserId: string, alertId: string, updates: Partial<Alert>) => {
  const alertIndex = mockData.alerts.findIndex(a => a.id === alertId);
  if (alertIndex !== -1) {
    mockData.alerts[alertIndex] = {
      ...mockData.alerts[alertIndex],
      ...updates
    };
    return mockData.alerts[alertIndex];
  }
  return null;
};