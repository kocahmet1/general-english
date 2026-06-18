/**
 * Microphone Permission Service
 * Manages microphone permission state and early permission requests
 * to ensure Voice Tutor can start immediately when needed.
 */

type MicrophonePermissionState = 'unknown' | 'granted' | 'denied' | 'prompt';

// Global state for microphone permission
let microphonePermissionState: MicrophonePermissionState = 'unknown';
let microphoneStream: MediaStream | null = null;

/**
 * Get the existing microphone stream if permission was already granted
 */
export function getExistingMicrophoneStream(): MediaStream | null {
  return microphoneStream;
}

/**
 * Check if microphone permission is already granted
 */
export function isMicrophonePermissionGranted(): boolean {
  return microphonePermissionState === 'granted';
}










