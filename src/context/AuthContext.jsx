import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'mak_power_auth_user';
const ADDRESSES_STORAGE_KEY = 'mak_power_saved_addresses';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: 'addr-default-1',
          fullName: 'Rishabh Kumar',
          phone: '9942670379',
          addressLine1: 'Chhapra–Road, Near Power Substation',
          landmark: 'Main Market',
          city: 'Garkha',
          state: 'Bihar',
          pincode: '841311',
          isDefault: true
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  // Login
  const login = async (email, password) => {
    // Check if admin login
    if (email.toLowerCase().includes('admin') || password === 'admin123') {
      const adminUser = {
        id: 'usr-admin-01',
        fullName: 'MAK POWER Admin',
        email: email,
        phone: '9942670379',
        role: 'admin'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || 'Customer',
          phone: data.user.user_metadata?.phone || '',
          role: data.user.user_metadata?.role || 'customer'
        };
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Default Customer login in demo mode
    const customerUser = {
      id: `usr-${Date.now()}`,
      fullName: email.split('@')[0].toUpperCase(),
      email: email,
      phone: '9876543210',
      role: 'customer'
    };
    setUser(customerUser);
    return { success: true, user: customerUser };
  };

  // Register
  const register = async ({ fullName, email, phone, password }) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone, role: 'customer' }
          }
        });
        if (error) throw error;
        const newUser = {
          id: data.user.id,
          email,
          fullName,
          phone,
          role: 'customer'
        };
        setUser(newUser);
        return { success: true, user: newUser };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      phone,
      role: 'customer'
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
  };

  const addAddress = (addr) => {
    const newAddr = { ...addr, id: `addr-${Date.now()}` };
    setSavedAddresses(prev => [newAddr, ...prev]);
  };

  const removeAddress = (id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        savedAddresses,
        addAddress,
        removeAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
