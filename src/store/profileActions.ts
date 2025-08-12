import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { UserProfile } from './userSlice';

// Fetch user profile from Supabase after successful sign-in
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      // Transform the data to match our UserProfile interface
      const profile: UserProfile = {
        id: data.id,
        name: data.name || '',
        email: data.email,
        age: data.age || null,
        avatar_url: data.avatar_url || '',
        helper_type: data.helper_type || '',
        preferred_tone: data.preferred_tone || '',
        pronouns: data.pronouns || null,
      };

      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Update user profile in Supabase and Redux
export const updateUserProfileInDB = createAsyncThunk(
  'user/updateProfileInDB',
  async (profileData: Partial<UserProfile>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { user: { profile: UserProfile } };
      const userId = state.user.profile.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return profileData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);