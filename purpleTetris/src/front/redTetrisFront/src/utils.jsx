import { clamp } from "ramda";

export const   getTexture = (type) => {
	switch (type) {
		case "I":       return '/src/assets/textures/minimalist/I.png';
		case "J":       return '/src/assets/textures/minimalist/J.png';
		case "L":       return '/src/assets/textures/minimalist/L.png';
		case "O":       return '/src/assets/textures/minimalist/O.png';
		case "S":       return '/src/assets/textures/minimalist/S.png';
		case "T":       return '/src/assets/textures/minimalist/T.png';
		case "Z":       return '/src/assets/textures/minimalist/Z.png';
		case "EMPTY":   return '/src/assets/textures/minimalist/empty.png';
		case "SHADOW":  return '/src/assets/textures/minimalist/shadow.png';
		case "GARBAGE": return '/src/assets/textures/minimalist/garbage.png';
		case "MATRIX":  return '/src/assets/textures/minimalist/matrix.png';
		case "HOLD":    return '/src/assets/textures/minimalist/hold.png';
		case "BAGS":    return '/src/assets/textures/minimalist/bags.png';
		default: 	    return '/src/assets/textures/minimalist/empty.png';
	}
}

export const    getMusic = (name) => {
	switch (name) {
		case "bgm1":    return new Audio('/src/assets/bgm/tetris/bgm1.mp3');
		case "bgm2":    return new Audio('/src/assets/bgm/tetris/bgm2.mp3');
		case "bgm3":    return new Audio('/src/assets/bgm/tetris/bgm3.mp3');
		case "bgm4":    return new Audio('/src/assets/bgm/tetris/bgm4.mp3');
		case "bgm5":    return new Audio('/src/assets/bgm/tetris/bgm5.mp3');
		default:        return null;
	}
}

export const getRandomUsername = (ad_seed, no_seed) => {
	const adjectives = ["Quick", "Brave", "Clever", "Swift", "Bold"];
	const nouns = ["Fox", "Lion", "Eagle", "Tiger", "Wolf"];
	return adjectives[Math.floor(clamp(0, 1, ad_seed) * adjectives.length)] + nouns[Math.floor(clamp(0, 1, no_seed) * nouns.length)];
};
