import { BOARD_ID, PAGE_SIZE, SOURCE_URL, BASE_URL } from '$env/static/private';
import type { PinResponse, RawAudioFiles } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { createSamplerUrls } from '$lib/server/utility';

export const config: import('@sveltejs/adapter-vercel').Config = {
	runtime: 'edge'
};

/** @type {import('@sveltejs/kit').ServerLoad} */
export const load: ServerLoad = async ({ fetch }) => {
	const searchParams = new URLSearchParams();
	searchParams.append('source_url', SOURCE_URL);
	searchParams.append(
		'data',
		JSON.stringify({
			options: {
				board_id: BOARD_ID,
				page_size: Number(PAGE_SIZE),
				bookmarks: []
			}
		})
	);
	const url = `${BASE_URL}?${searchParams.toString()}`;

	const raw_audio_files: RawAudioFiles = import.meta.glob('/static/audio/*.mp3', {
		query: '?url',
		eager: true,
		import: 'default'
	});
	const audio_files = Object.keys(raw_audio_files).map((key) => {
		return key.split('/static/audio/')[1];
	});

	const urls = createSamplerUrls(audio_files);
	try {
		if (!SOURCE_URL || SOURCE_URL == '') throw new Error(`No source url`);
		const res = await fetch(url);
		if (res.ok) {
			const bookmark = (await res.clone().json()).resource_response.bookmark;
			const init_pins: PinResponse[] = (await res.json()).resource_response.data;
			return {
				pins: init_pins,
				bookmark,
				urls
			};
		}
	} catch (error) {
		console.log(error);
		return {
			pins: [],
			bookmark: ''
		};
	}
};

export const actions: Actions = {
	refetch: async ({ request }) => {
		const req = await request.formData();
		const bookmark = req.get('bookmark');

		const searchParams = new URLSearchParams();
		searchParams.append('source_url', SOURCE_URL);
		searchParams.append(
			'data',
			JSON.stringify({
				options: {
					board_id: BOARD_ID,
					page_size: Number(PAGE_SIZE),
					bookmarks: [bookmark]
				}
			})
		);
		const url = `${BASE_URL}?${searchParams.toString()}`;

		try {
			if (!SOURCE_URL || SOURCE_URL == '') throw new Error(`No source url`);
			const res = await fetch(url);
			if (res.ok) {
				const new_bookmark = (await res.clone().json()).resource_response.bookmark;
				const new_pins: PinResponse[] = (await res.json()).resource_response.data;
				return {
					new_pins,
					new_bookmark
				};
			}
		} catch (error) {
			console.log(error);
			return {
				new_pins: [],
				bookmark: ''
			};
		}
	}
};
