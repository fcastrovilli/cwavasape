import { error } from '@sveltejs/kit';

export const config: import('@sveltejs/adapter-vercel').Config = {
	runtime: 'edge'
};

export async function GET({ setHeaders, url, fetch }) {
	try {
		const toFetch = String(url.searchParams.get('url'));
		const res = await fetch(toFetch);
		const blob = await res.blob();
		setHeaders({
			'Content-Type': 'image/png'
		});
		return new Response(blob);
	} catch (e) {
		throw error(500, 'Internal server error');
	}
}
