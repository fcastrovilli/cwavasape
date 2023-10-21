import { SOURCE } from '$env/static/private';
import type { PinResponse } from '$lib/types';
import type { ServerLoad } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').ServerLoad} */
export const load: ServerLoad = async ({ fetch }) => {
	try {
		if (!SOURCE || SOURCE == '') throw new Error(`No source url`);
		const res = await fetch(SOURCE);
		if (res.ok) {
			const data: PinResponse[] = (await res.json()).resource_response.data;
			return {
				pins: data
			};
		}
	} catch (error) {
		return {
			pins: []
		};
	}
};
