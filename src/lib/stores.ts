import { writable } from 'svelte/store';
import type { PinResponse } from './types';

export const scrollPosition = writable(0);
export const all_pins = writable([] as PinResponse[]);
export const bookmark = writable('');
