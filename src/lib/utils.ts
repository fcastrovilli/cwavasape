import { Image as imagejs } from 'image-js';

export async function analyze(url: string) {
	if (!url) return;
	const toAnalyze = await imagejs.load(url);
	const gaussian = toAnalyze.grey().gaussianFilter({ radius: 8 });
	const mask = gaussian.mask({ threshold: 0.4 });
	const roiManager = toAnalyze.getRoiManager();
	roiManager.fromMask(mask);
	const painted = roiManager.paint({
		// @ts-expect-error - TS doesn't like the fact that we're using a string here
		distinctColor: true,
		positive: true,
		negative: true,
		alpha: 127,
		labelProperty: 'surface',
		labelColor: 'white',
		unit: 'px'
	});
	return { url: painted.toDataURL() };
}
