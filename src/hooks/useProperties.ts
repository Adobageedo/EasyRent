import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export const useProperties = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Property[];
    } catch (error) {
      showToast('Error fetching properties', 'error');
      console.error('Error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    loading,
    fetchProperties,
  };
};
