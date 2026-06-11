import { useCallback, useEffect, useMemo, useState } from 'react';
import { authenticateWithTelegram, getAuthenticatedUser } from '../api/auth';
import {
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken
} from '../authStorage';
import { AuthContext } from './authContext';

const getTelegramWebApp = () => window.Telegram?.WebApp;

const getErrorMessage = (error) => {
  return error.response?.data?.error || error.message || 'Authentication failed';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredAuthToken());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearAuth = useCallback(() => {
    clearStoredAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const authenticateFromTelegram = useCallback(async () => {
    const webApp = getTelegramWebApp();
    const initData = webApp?.initData;

    if (!initData) {
      throw new Error('Open Ethio-Shopify from Telegram to sign in.');
    }

    webApp.ready?.();
    webApp.expand?.();

    const data = await authenticateWithTelegram(initData);
    setStoredAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);

    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await getAuthenticatedUser();
    setUser(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);
      
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (isLocalhost) {
        setUser({
          id: 1,
          username: "devuser",
          fullname: "Development User",
          first_name: "Dev",
          last_name: "User"
        });

        setToken('thisIsaRandomtokenJustTofoolThefrontendwedontActuallyNeedrealTokenScinceAlazarisonlyworkingintheUIfornow');
        setIsLoading(false);
        return;
      }

      try {
        const storedToken = getStoredAuthToken();

        if (storedToken) {
          try {
            const data = await getAuthenticatedUser();

            if (!isMounted) return;
            setToken(storedToken);
            setUser(data.user);
            return;
          } catch {
            clearStoredAuthToken();
            if (!isMounted) return;
            setToken(null);
            setUser(null);
          }
        }

        const telegramUser = await authenticateFromTelegram();
        if (!isMounted) return;
        setUser(telegramUser);
      } catch (authError) {
        if (!isMounted) return;
        clearAuth();
        setError(getErrorMessage(authError));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [authenticateFromTelegram, clearAuth]);

  const value = useMemo(() => {
    return {
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      error,
      refreshUser,
      retryTelegramAuth: authenticateFromTelegram,
      logout: clearAuth
    };
  }, [authenticateFromTelegram, clearAuth, error, isLoading, refreshUser, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
