import { BOARD_ID, PAGE_SIZE, SOURCE_URL, BASE_URL } from '$env/static/private';
import type { PinResponse } from '$lib/types';
import type { ServerLoad } from '@sveltejs/kit';

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

	try {
		if (!SOURCE_URL || SOURCE_URL == '') throw new Error(`No source url`);
		const res = await fetch(url);
		if (res.ok) {
			const bookmark = (await res.clone().json()).resource_response.bookmark;
			const init_pins: PinResponse[] = (await res.json()).resource_response.data;
			return {
				pins: init_pins,
				bookmark
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
