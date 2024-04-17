import { PINTEREST_USERNAME } from '$env/static/private';
import { BASE_URL } from '$lib/stores';
import type { PinResponse } from '$lib/types';

export const get_pins = async (last_bookmark: string, init: boolean = false) => {
	let pins: PinResponse[] = [];
	let bookmark: string = '';
	const searchParams = new URLSearchParams();
	searchParams.append('source_url', `/${PINTEREST_USERNAME}/pins/`);
	searchParams.append(
		'data',
		JSON.stringify({
			options: {
				is_own_profile_pins: false,
				username: PINTEREST_USERNAME,
				bookmarks: [last_bookmark]
			}
		})
	);
	const url = `${BASE_URL}?${searchParams.toString()}`;
	try {
		if (!PINTEREST_USERNAME || PINTEREST_USERNAME == '') throw new Error(`No source url`);
		const res = await fetch(url);
		if (res.ok) {
			bookmark = (await res.clone().json()).resource_response.bookmark || '';
			if (init) pins = [...(await res.json()).resource_response.data] || [];
			else pins = [...pins, ...(await res.json()).resource_response.data] || [];
		}
	} catch (error) {
		console.log(error);
		pins = [];
		bookmark = '';
	}
	return {
		pins,
		bookmark
	};
};

export function createSamplerUrls(rawAudioFiles: string[]): { [note: number]: string } {
	const urls: { [note: number]: string } = {};
	const noteRange = 128;

	const randomNotes: number[] = [];
	for (let i = 0; i < noteRange; i++) {
		randomNotes.push(i);
	}
	randomNotes.sort(() => Math.random() - 0.5);

	for (let i = 0; i < Object.keys(rawAudioFiles).length; i++) {
		urls[randomNotes[i]] = rawAudioFiles[i];
	}

	return urls;
}
