import type { MusicData } from '$lib/types';
import type { Roi } from 'image-js';
import * as Tone from 'tone';
// interface MusicData {
// 	pitch: number;
// 	duration: number;
// 	midiNote: number;
// 	note: string;
// }

// export function translateRoisToMusic(rois: Roi[]): MusicData[] {
// 	const musicData: MusicData[] = [];

// 	// Define the C major scale
// 	const scale = [0, 2, 4, 5, 7, 9, 11];

// 	for (const roi of rois) {
// 		const duration = roi.surface;
// 		const pitch = (roi.meanX + roi.meanY) / 2;

// 		// Map pitch to a note in the C major scale
// 		const scaleDegree = Math.round((pitch / 1000) * scale.length) % scale.length;
// 		const midiNote = 60 + scale[scaleDegree]; // MIDI note number for C4 + scale degree
// 		const note = `C${Math.floor(midiNote / 12) - 1}#${
// 			['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][midiNote % 12]
// 		}`; // Note name for MIDI note number

// 		musicData.push({ pitch, duration, midiNote, note });
// 	}

// 	return musicData;
// }

export function translateRoisToMusic(rois: Roi[]): MusicData[] {
	const musicData: MusicData[] = [];

	for (const roi of rois) {
		const duration = '8n';
		const pitch = (roi.meanX + roi.meanY) / 2;

		// Map pitch to a note in the C major scale
		const scaleDegree = Math.round((pitch / 1000) * 7) % 7;
		const midiNote = 60 + [0, 2, 4, 5, 7, 9, 11][scaleDegree]; // MIDI note number for C4 + scale degree
		const note = Tone.Frequency(midiNote, 'midi').toNote(); // Note name for MIDI note number

		musicData.push({ pitch, duration, midiNote, note });
	}

	return musicData;
}
