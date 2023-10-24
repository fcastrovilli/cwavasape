import { get_pins } from '$lib/server/utility';
import type { PinResponse } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').ServerLoad} */
export const load: ServerLoad = async () => {
	const { pins, bookmark }: { pins: PinResponse[]; bookmark: string } = await get_pins('', true);
	return {
		pins,
		bookmark
	};
};

export const actions: Actions = {
	refetch: async ({ request }) => {
		const req = await request.formData();
		const last_bookmark = req.get('bookmark');
		const { pins, bookmark }: { pins: PinResponse[]; bookmark: string } = await get_pins(
			String(last_bookmark)
		);
		return {
			pins,
			bookmark
		};
	}
};
