import { Image as imagejs } from 'image-js';
import { settings } from '$lib/stores';

let alias_settings: ui_settings = {
	quality: '236x',
	gaussian_radius: 1,
	mask_threshold: 0.5,
	paint_alpha: 1000,
	distinct_color: false,
	positive: true,
	negative: false,
	opacity: 75,
	random: false
};
export async function analyze(url: string) {
	if (!url) return;
	settings.subscribe((val) => {
		alias_settings = val;
	});

	const toAnalyze = await imagejs.load(url);
	const gaussian = toAnalyze.grey().gaussianFilter({ radius: alias_settings.gaussian_radius });
	const mask = gaussian.mask({ threshold: alias_settings.mask_threshold });
	const roiManager = toAnalyze.getRoiManager();
	roiManager.fromMask(mask);
	const painted = roiManager.paint({
		// @ts-expect-error - TS doesn't like the fact that we're using a string here
		distinctColor: alias_settings.distinct_color,
		positive: alias_settings.positive,
		negative: alias_settings.negative,
		alpha: alias_settings.paint_alpha,
		labelProperty: 'surface',
		labelColor: 'black',
		unit: 'px'
	});
	return { url: painted.toDataURL() };
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import type { ui_settings } from './types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};
