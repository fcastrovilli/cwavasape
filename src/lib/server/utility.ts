import { SOURCE_URL, BOARD_ID, PAGE_SIZE, BASE_URL } from '$env/static/private';
import type { PinResponse } from '$lib/types';
let pins: PinResponse[] = [];
let bookmark: string = '';

export const get_pins = async (last_bookmark: string, init: boolean = false) => {
	const searchParams = new URLSearchParams();
	searchParams.append('source_url', SOURCE_URL);
	searchParams.append(
		'data',
		JSON.stringify({
			options: {
				board_id: BOARD_ID,
				page_size: Number(PAGE_SIZE),
				bookmarks: [last_bookmark]
			}
		})
	);
	const url = `${BASE_URL}?${searchParams.toString()}`;

	try {
		if (!SOURCE_URL || SOURCE_URL == '') throw new Error(`No source url`);
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
