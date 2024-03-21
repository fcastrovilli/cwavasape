import { Image as imagejs } from 'image-js';

export async function analyze(url: string) {
	if (!url) return;
	const toAnalyze = await imagejs.load(url);
	const gaussian = toAnalyze.grey().gaussianFilter({ radius: 1 });
	const mask = gaussian.mask({ threshold: 0.5 });
	const roiManager = toAnalyze.getRoiManager();
	roiManager.fromMask(mask);
	const painted = roiManager.paint({
		// @ts-expect-error - TS doesn't like the fact that we're using a string here
		distinctColor: false,
		positive: true,
		negative: false,
		alpha: 1000,
		labelProperty: 'surface',
		labelColor: 'black',
		unit: 'px'
	});
	return { url: painted.toDataURL() };
}
