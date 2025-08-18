import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchUserProfile, updateUserProfileInDB } from './profileActions';
export interface UserProfile {
  id: string | null;
  name: string;
  email: string;
  age: number | null;
  avatar_url: string | null;
  helper_type: string | null;
  preferred_tone: string | null;
  pronouns: string | null;
  selected_helper: string | null;
}

interface UserState {
  profile: UserProfile;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: {
    id: null,
    name: '',
    email: '',
    age: null,
    avatar_url: null,
    helper_type: null,
    preferred_tone: null,
    pronouns: null,
    selected_helper: null
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set complete profile
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.error = null;
    },
    
    // Update partial profile
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      state.error = null;
    },
    
    // Update individual fields
    updateName: (state, action: PayloadAction<string>) => {
      state.profile.name = action.payload;
    },
    
    updateEmail: (state, action: PayloadAction<string>) => {
      state.profile.email = action.payload;
    },
    
    updateAge: (state, action: PayloadAction<number | null>) => {
      state.profile.age = action.payload;
    },
    
    updateAvatarUrl: (state, action: PayloadAction<string | null>) => {
      state.profile.avatar_url = action.payload;
    },
    
    updateHelperType: (state, action: PayloadAction<string | null>) => {
      state.profile.helper_type = action.payload;
    },
    
    updatePreferredTone: (state, action: PayloadAction<string | null>) => {
      state.profile.preferred_tone = action.payload;
    },
    
    updatePronouns: (state, action: PayloadAction<string | null>) => {
      state.profile.pronouns = action.payload;
    },
    
    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Clear/delete profile
    clearProfile: (state) => {
      state.profile = initialState.profile;
      state.error = null;
    },
    
    // Reset entire state
    resetUserState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle updateUserProfileInDB
      .addCase(updateUserProfileInDB.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfileInDB.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserProfileInDB.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { 
  setProfile, 
  updateProfile, 
  updateName,
  updateEmail,
  updateAge,
  updateAvatarUrl,
  updateHelperType,
  updatePreferredTone,
  updatePronouns,
  setLoading, 
  setError, 
  clearProfile,
  resetUserState 
} = userSlice.actions;

// Selectors for reading state
export const selectUserProfile = (state: { user: UserState }) => state.user.profile;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserId = (state: { user: UserState }) => state.user.profile.id;
export const selectUserName = (state: { user: UserState }) => state.user.profile.name;
export const selectUserEmail = (state: { user: UserState }) => state.user.profile.email;
export const selectUserAge = (state: { user: UserState }) => state.user.profile.age;
export const selectUserAvatarUrl = (state: { user: UserState }) => state.user.profile.avatar_url;
export const selectUserHelperType = (state: { user: UserState }) => state.user.profile.helper_type;
export const selectUserPreferredTone = (state: { user: UserState }) => state.user.profile.preferred_tone;
export const selectUserPronouns = (state: { user: UserState }) => state.user.profile.pronouns;
export const selectUserSelectedHelper = (state: { user: UserState }) => state.user.profile.selected_helper;

export default userSlice.reducer;