import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface EventMatrixEvent {
  id: string;
  name: string;
  order_sequence: number;
  days: number;
  generates_commitment: string;
  control_enabled: boolean;
  selected_collaborators: string[];
}

interface EventMatrix {
  id: string;
  description: string;
  start_date: string;
  end_date: string;
  agenda_type: string;
  workflow_type: string;
  events: EventMatrixEvent[];
}

export const useEventMatrix = () => {
  const [eventMatrix, setEventMatrix] = useState<EventMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEventMatrix();
    }
  }, [user]);

  const fetchEventMatrix = async () => {
    try {
      setLoading(true);
      
      // Get event matrix
      const { data: matrixData, error: matrixError } = await supabase
        .from('event_matrix')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (matrixError) throw matrixError;

      // Get events for this matrix
      const { data: eventsData, error: eventsError } = await supabase
        .from('event_matrix_events')
        .select('*')
        .eq('event_matrix_id', matrixData.id)
        .order('order_sequence', { ascending: true });

      if (eventsError) throw eventsError;

      setEventMatrix({
        ...matrixData,
        events: eventsData || []
      });
    } catch (error) {
      console.error('Error fetching event matrix:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEventMatrix = async (updates: Partial<EventMatrix>) => {
    if (!eventMatrix) return;

    try {
      const { error } = await supabase
        .from('event_matrix')
        .update({
          description: updates.description,
          start_date: updates.start_date,
          end_date: updates.end_date,
          agenda_type: updates.agenda_type,
        })
        .eq('id', eventMatrix.id);

      if (error) throw error;

      setEventMatrix(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating event matrix:', error);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<EventMatrixEvent>) => {
    try {
      const { error } = await supabase
        .from('event_matrix_events')
        .update(updates)
        .eq('id', eventId);

      if (error) throw error;

      setEventMatrix(prev => {
        if (!prev) return null;
        return {
          ...prev,
          events: prev.events.map(event => 
            event.id === eventId ? { ...event, ...updates } : event
          )
        };
      });
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return {
    eventMatrix,
    loading,
    updateEventMatrix,
    updateEvent,
    refetch: fetchEventMatrix
  };
};