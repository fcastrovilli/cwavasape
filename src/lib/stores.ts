import { writable } from 'svelte/store';
import type { PinResponse, ui_settings } from '$lib/types';

export const scrollPosition = writable(0);
export const all_pins = writable([] as PinResponse[]);
export const bookmark = writable('');
export const started = writable(false);
export const show_settings = writable(false);
export const settings = writable({
	quality: '236x',
	gaussian_radius: 1,
	mask_threshold: 0.5,
	paint_alpha: 1000,
	distinct_color: false,
	positive: true,
	negative: false,
	opacity: 75,
	random: false
} as ui_settings);

export const updateLocalStorage = (key: string, value: ui_settings) => {
	localStorage.setItem(key, JSON.stringify(value));
};
