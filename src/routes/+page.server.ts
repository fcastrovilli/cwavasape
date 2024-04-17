import type { RawAudioFiles } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { createSamplerUrls, get_pins } from '$lib/server/utility';

export const config: import('@sveltejs/adapter-vercel').Config = {
	runtime: 'edge'
};

/** @type {import('@sveltejs/kit').ServerLoad} */
export const load: ServerLoad = async () => {
	const raw_audio_files: RawAudioFiles = import.meta.glob('/static/audio/*.mp3', {
		query: '?url',
		eager: true,
		import: 'default'
	});
	const audio_files = Object.keys(raw_audio_files).map((key) => {
		return key.split('/static/audio/')[1];
	});
	const urls = createSamplerUrls(audio_files);

	const all_pins = await get_pins('', true);
	return {
		pins: all_pins.pins,
		bookmark: all_pins.bookmark,
		urls
	};
};

export const actions: Actions = {
	refetch: async ({ request }) => {
		const req = await request.formData();
		const bookmark = req.get('bookmark');
		if (!bookmark) return;
		const new_pins = await get_pins(bookmark as string, false);
		return {
			new_pins: new_pins.pins,
			new_bookmark: new_pins.bookmark
		};
	}
};
