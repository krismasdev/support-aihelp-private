import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

export interface Message {
  id: string;
  helper_id: string;
  user_id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
}

interface MessagesState {
  messagesByHelper: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messagesByHelper: {},
  loading: false,
  error: null,
};

// Fetch messages for a specific helper
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ helperId, userId }: { helperId: string; userId: string }) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('helper_id', helperId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { helperId, messages: data || [] };
  }
);

// Send a new message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (message: Omit<Message, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (!state.messagesByHelper[message.helper_id]) {
        state.messagesByHelper[message.helper_id] = [];
      }
      state.messagesByHelper[message.helper_id].push(message);
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      const helperId = action.payload;
      state.messagesByHelper[helperId] = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { helperId, messages } = action.payload;
        state.messagesByHelper[helperId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        if (!state.messagesByHelper[message.helper_id]) {
          state.messagesByHelper[message.helper_id] = [];
        }
        state.messagesByHelper[message.helper_id].push(message);
      });
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;

// Selectors
export const selectMessagesByHelper = (state: any) => state.messages.messagesByHelper;
export const selectMessagesForHelper = (state: any, helperId: string) => 
  state.messages.messagesByHelper[helperId] || [];
export const selectMessagesLoading = (state: any) => state.messages.loading;

export default messagesSlice.reducer;