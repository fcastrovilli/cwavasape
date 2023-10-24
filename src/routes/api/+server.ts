// import resemble from 'resemblejs';
// let last_url: string | undefined = undefined;

export async function GET({ setHeaders, url, fetch }) {
	// try {
	const toFetch = String(url.searchParams.get('url'));
	const res = await fetch(toFetch);
	const blob = await res.blob();
	// if (last_url !== undefined) {
	// 	resemble(last_url)
	// 		.compareTo(toFetch)
	// 		.ignoreColors()
	// 		.onComplete(function (data) {
	// 			console.log(data);
	// 		});
	// }
	// last_url = toFetch;
	setHeaders({
		'Content-Type': 'image/png'
	});
	return new Response(blob);
	// } catch (e) {
	// 	throw error(500, 'Internal server error');
	// }
}
