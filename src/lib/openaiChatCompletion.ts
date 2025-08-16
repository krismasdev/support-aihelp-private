import { supabase } from './supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  helperType: string;
  userId: string;
  conversationId?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResponse {
  success: boolean;
  message?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function createChatCompletion({
  messages,
  helperType,
  userId,
  conversationId,
  temperature = 0.7,
  maxTokens = 1000
}: ChatCompletionOptions): Promise<ChatCompletionResponse> {
  try {
    // Call Supabase edge function
    const { data, error } = await supabase.functions.invoke('create-message', {
      body: {
        messages,
        helperType,
        userId,
        conversationId: conversationId || null,
        temperature,
        maxTokens
      }
    });

    if (error) {
      console.error('Chat completion error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create chat completion'
      };
    }

    return {
      success: true,
      message: data?.message,
      usage: data?.usage
    };
  } catch (error) {
    console.error('Chat completion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function streamChatCompletion({
  messages,
  helperType,
  userId,
  conversationId,
  temperature = 0.7,
  maxTokens = 1000,
  onChunk
}: ChatCompletionOptions & {
  onChunk: (chunk: string) => void;
}): Promise<ChatCompletionResponse> {
  try {
    // For now, use regular completion - streaming can be added later
    const result = await createChatCompletion({
      messages,
      helperType,
      userId,
      conversationId,
      temperature,
      maxTokens
    });

    if (result.success && result.message) {
      onChunk(result.message);
    }

    return result;
  } catch (error) {
    console.error('Stream chat completion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}