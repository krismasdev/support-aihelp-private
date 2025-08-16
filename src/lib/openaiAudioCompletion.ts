import { supabase } from './supabase';

export interface AudioCompletionOptions {
  audioBlob: Blob;
  helperType: string;
  userId: string;
  conversationId?: string;
}

export interface AudioCompletionResponse {
  success: boolean;
  audioUrl?: string;
  transcription?: string;
  error?: string;
}

export async function createAudioCompletion({
  audioBlob,
  helperType,
  userId,
  conversationId
}: AudioCompletionOptions): Promise<AudioCompletionResponse> {
  try {
    // Convert blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Call Supabase edge function
    const { data, error } = await supabase.functions.invoke('create-audio-message', {
      body: {
        audioData: base64Audio,
        helperType,
        userId,
        conversationId: conversationId || null,
        mimeType: audioBlob.type || 'audio/webm'
      }
    });

    if (error) {
      console.error('Audio completion error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process audio'
      };
    }

    return {
      success: true,
      audioUrl: data?.audioUrl,
      transcription: data?.transcription
    };
  } catch (error) {
    console.error('Audio completion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string | null> {
  try {
    const result = await createAudioCompletion({
      audioBlob,
      helperType: 'transcription',
      userId: 'temp'
    });

    return result.transcription || null;
  } catch (error) {
    console.error('Transcription error:', error);
    return null;
  }
}