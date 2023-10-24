import type { MusicData } from '$lib/types';
import type { Roi } from 'image-js';

export function translateRoisToMusic(rois: Roi[]) {
	const musicData: MusicData[] = [];
	for (const roi of rois) {
		const note = mapSurfaceToNote(roi.surface);
		let duration = roi.perimeter;
		//roi.perimeter is aspected to be a random number between a large range but i want to scale it between 0.1 and 3
		duration = duration / 10;
		duration = duration < 0.1 ? 0.1 : duration;
		duration = duration > 3 ? 3 : duration;

		const time = 0;
		const velocity = 0.8;
		musicData.push({ note, duration, time, velocity });
	}

	console.log(musicData);

	return musicData;
}

export function mapSurfaceToNote(surface: number) {
	// Definisci un array di note nella tonalità di C Major
	const cMajorScale = [
		'C4',
		'D4',
		'E4',
		'F4',
		'G4',
		'A4',
		'B4',
		'C5',
		'D5',
		'E5',
		'F5',
		'G5',
		'A5',
		'B5'
	];

	// Usa il valore della superficie per selezionare una nota dalla scala
	const noteIndex = Math.floor(surface % cMajorScale.length);
	const selectedNote = cMajorScale[noteIndex];

	return selectedNote;
}

export function mapROItoSYNTH(roi: Roi) {
	const notes = mapSurfaceToNote(roi.surface);
	const duration = roi.perimeter;
	const time = 0;
	const velocity = 0.8;

	return {
		notes,
		duration,
		time,
		velocity
	};
}
