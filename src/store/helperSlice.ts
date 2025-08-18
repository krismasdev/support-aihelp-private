import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

export interface Helper {
  id: string;
  name: string;
  type: string;
  description: string;
  tone: string;
  interactionStyle: string;
  focus: string[];
  userId: string;
  createdAt: string;
  isDefault?: boolean;
}

interface HelperState {
  helpers: Helper[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HelperState = {
  helpers: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch helpers
export const fetchHelpers = createAsyncThunk(
  'helpers/fetchHelpers',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('Fetching helpers for user:', userId);
      const { data, error } = await supabase.functions.invoke('read-helpers', {
        body: { userId },
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        return rejectWithValue(error.message || 'Failed to fetch helpers');
      }

      if (!data || !data.data) {
        console.log('No helpers data received');
        return [];
      }

      const mappedHelpers = data.data.map((helper: any) => ({
        id: helper.id,
        name: helper.name,
        type: helper.type,
        description: helper.description,
        tone: helper.tone,
        interactionStyle: helper.interaction_style,
        focus: helper.focus,
        userId: helper.user_id,
        createdAt: helper.created_at,
        isDefault: helper.is_default || false,
      }));

      console.log('Mapped helpers:', mappedHelpers);
      return mappedHelpers;
    } catch (error: any) {
      console.error('Fetch helpers error:', error);
      return rejectWithValue(error.message || 'Failed to fetch helpers');
    }
  }
);

const helperSlice = createSlice({
  name: 'helpers',
  initialState,
  reducers: {
    addHelper: (state, action: PayloadAction<Helper>) => {
      state.helpers.push(action.payload);
    },
    removeHelper: (state, action: PayloadAction<string>) => {
      state.helpers = state.helpers.filter(helper => helper.id !== action.payload);
    },
    updateHelper: (state, action: PayloadAction<Helper>) => {
      const index = state.helpers.findIndex(helper => helper.id === action.payload.id);
      if (index !== -1) {
        state.helpers[index] = action.payload;
      }
    },
    clearHelpers: (state) => {
      state.helpers = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHelpers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHelpers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.helpers = action.payload;
        state.error = null;
      })
      .addCase(fetchHelpers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addHelper, removeHelper, updateHelper, clearHelpers, setError } = helperSlice.actions;
// Selectors
export const selectHelpers = (state: { helpers: HelperState }) => state.helpers.helpers;
export const selectHelpersLoading = (state: { helpers: HelperState }) => state.helpers.isLoading;
export const selectHelpersError = (state: { helpers: HelperState }) => state.helpers.error;
export const selectDefaultHelper = (state: { helpers: HelperState; user: { profile: { selected_helper: string | null } } }) => {
  const selectedHelperId = state.user.profile.selected_helper;
  return selectedHelperId ? state.helpers.helpers.find(helper => helper.id === selectedHelperId) : null;
};

export default helperSlice.reducer;