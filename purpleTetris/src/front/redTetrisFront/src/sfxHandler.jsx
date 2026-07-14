const   btbSounds = (sound) => {
	const   btb_value = sound > 3 ? 3 : sound;

	switch(btb_value) {
		case 1: return new Audio("/src/assets/sfx/BejeweledSR/btb_1.ogg");
		case 2: return new Audio("/src/assets/sfx/BejeweledSR/btb_2.ogg");
		case 3: return new Audio("/src/assets/sfx/BejeweledSR/btb_3.ogg");
		case "break": return new Audio("/src/assets/sfx/BejeweledSR/btb_break.ogg");
		default:
			return undefined;
	}
}

const   clearSounds = (sound) => {
	switch(sound) {
		case "allclear": return new Audio("/src/assets/sfx/BejeweledSR/allclear.ogg");
		case "btb": return new Audio("/src/assets/sfx/BejeweledSR/clearbtb.ogg");
		case "line": return new Audio("/src/assets/sfx/BejeweledSR/clearline.ogg");
		case "quad": return new Audio("/src/assets/sfx/BejeweledSR/clearquad.ogg");
		case "spin": return new Audio("/src/assets/sfx/BejeweledSR/clearspin.ogg");
		default:
			return undefined;
	}
}

const   comboSounds = (sound) => {
	switch(sound) {
		case 1: return new Audio("/src/assets/sfx/BejeweledSR/combo_1.ogg");
		case 2: return new Audio("/src/assets/sfx/BejeweledSR/combo_2.ogg");
		case 3: return new Audio("/src/assets/sfx/BejeweledSR/combo_3.ogg");
		case 4: return new Audio("/src/assets/sfx/BejeweledSR/combo_4.ogg");
		case 5: return new Audio("/src/assets/sfx/BejeweledSR/combo_5.ogg");
		case 6: return new Audio("/src/assets/sfx/BejeweledSR/combo_6.ogg");
		case 7: return new Audio("/src/assets/sfx/BejeweledSR/combo_7.ogg");
		case 8: return new Audio("/src/assets/sfx/BejeweledSR/combo_8.ogg");
		case 9: return new Audio("/src/assets/sfx/BejeweledSR/combo_9.ogg");
		case 10: return new Audio("/src/assets/sfx/BejeweledSR/combo_10.ogg");
		case 11: return new Audio("/src/assets/sfx/BejeweledSR/combo_11.ogg");
		case 12: return new Audio("/src/assets/sfx/BejeweledSR/combo_12.ogg");
		case 13: return new Audio("/src/assets/sfx/BejeweledSR/combo_13.ogg");
		case 14: return new Audio("/src/assets/sfx/BejeweledSR/combo_14.ogg");
		case 15: return new Audio("/src/assets/sfx/BejeweledSR/combo_15.ogg");
		case 16: return new Audio("/src/assets/sfx/BejeweledSR/combo_16.ogg");
		case "break": return new Audio("/src/assets/sfx/BejeweledSR/combobreak.ogg");
		default:
			return undefined;
	}
}

const   garbageSounds = (sound) => {
	switch(sound) {
		case "counter": return new Audio("/src/assets/sfx/BejeweledSR/counter.ogg");
		case "damage_alert": return new Audio("/src/assets/sfx/BejeweledSR/damage_alert.ogg");
		case "damage_large": return new Audio("/src/assets/sfx/BejeweledSR/damage_large.ogg");
		case "damage_medium": return new Audio("/src/assets/sfx/BejeweledSR/damage_medium.ogg");
		case "damage_small": return new Audio("/src/assets/sfx/BejeweledSR/damage_small.ogg");
		case "garbage_in_large": return new Audio("/src/assets/sfx/BejeweledSR/garbage_in_large.ogg");
		case "garbage_in_medium": return new Audio("/src/assets/sfx/BejeweledSR/garbage_in_medium.ogg");
		case "garbage_in_small": return new Audio("/src/assets/sfx/BejeweledSR/garbage_in_small.ogg");
		case "garbage_out_large": return new Audio("/src/assets/sfx/BejeweledSR/garbage_out_large.ogg");
		case "garbage_out_medium": return new Audio("/src/assets/sfx/BejeweledSR/garbage_out_medium.ogg");
		case "garbage_out_small": return new Audio("/src/assets/sfx/BejeweledSR/garbage_out_small.ogg");
		default:
			return undefined;
	}
}

const   userEffectSounds = (sound) => {
	switch(sound) {
		case "harddrop": return new Audio("/src/assets/sfx/BejeweledSR/harddrop.ogg");
		case "softdrop": return new Audio("/src/assets/sfx/BejeweledSR/softdrop.ogg");
		case "hold": return new Audio("/src/assets/sfx/BejeweledSR/hold.ogg");
		case "move": return new Audio("/src/assets/sfx/BejeweledSR/move.ogg");
		case "rotate": return new Audio("/src/assets/sfx/BejeweledSR/rotate.ogg");
		default:
			return undefined;
	}
}

const   levelSounds = (sound) => {
	switch(sound) {
		case "1": return new Audio("/src/assets/sfx/BejeweledSR/level1.ogg");
		case "5": return new Audio("/src/assets/sfx/BejeweledSR/level5.ogg");
		case "10": return new Audio("/src/assets/sfx/BejeweledSR/level10.ogg");
		case "15": return new Audio("/src/assets/sfx/BejeweledSR/level15.ogg");
		case "up": return new Audio("/src/assets/sfx/BejeweledSR/levelup.ogg");
		default:
			return undefined;
	}
}

const   lockSounds = (sound) => {
	switch(sound) {
		case "spinend": return new Audio("/src/assets/sfx/BejeweledSR/spinend.ogg");
		case "lock": return new Audio("/src/assets/sfx/BejeweledSR/lock.ogg");
		default:
			return undefined;
	}
}

const   boardSounds = (sound) => {
	switch(sound) {
		case "floor": return new Audio("/src/assets/sfx/BejeweledSR/floor.ogg");
		case "sidehit": return new Audio("/src/assets/sfx/BejeweledSR/sidehit.ogg");
		case "topout": return new Audio("/src/assets/sfx/BejeweledSR/topout.ogg");
		case "victory": return new Audio("/src/assets/sfx/BejeweledSR/victory.mp3");
		case "gameover": return new Audio("/src/assets/sfx/BejeweledSR/gameover.mp3");
		default:
			return undefined;
	}
}

export const    sfxPlayer = (type, sound) => {
	switch(type) {
		case "BTB":
			return btbSounds(sound);
		case "CLEAR":
			return clearSounds(sound);
		case "COMBO":
			return comboSounds(sound);
		case "GARBAGE":
			return garbageSounds(sound);
		case "USER_EFFECT":
			return userEffectSounds(sound);
		case "LEVEL":
			return levelSounds(sound);
		case "LOCK":
			return lockSounds(sound);
		case "SPIN":
			return new Audio("/src/assets/sfx/BejeweledSR/spin.ogg");
		case "BOARD":
			return boardSounds(sound);
		default:
			return undefined;
	}
}