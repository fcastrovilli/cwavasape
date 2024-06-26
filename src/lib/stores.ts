import { writable } from 'svelte/store';
import type { ui_settings } from '$lib/types';
export const BASE_URL = 'https://www.pinterest.com/resource/UserPinsResource/get/';

export const is_debug = writable(false);

export const scrollPosition = writable(0);
export const bookmark = writable('');
export const started = writable(false);
export const show_settings = writable(false);
export const audio_active = writable(true);
export const settings = writable({
	quality: '236x',
	gaussian_radius: 1,
	mask_threshold: 0.5,
	paint_alpha: 1000,
	distinct_color: false,
	positive: true,
	negative: false,
	opacity: 75,
	random: false,
	audio_volume: -6,
	audio_threshold: -10
} as ui_settings);

export const updateLocalStorage = (key: string, value: ui_settings) => {
	localStorage.setItem(key, JSON.stringify(value));
};
