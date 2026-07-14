import './Hold.css'
import { useState } from "react";
import { getTexture } from "../../utils.jsx";
import Tetrimino from "../Tetrimino/Tetrimino.jsx";

const   HoldPiece = ({ type, canSwap }) => {
	const   [ holdType, setHoldType ] = useState("EMPTY");
	const   [ texture, setTexture ] = useState(getTexture("EMPTY"));
	const   [canSwapState, setCanSwap] = useState(canSwap || true);

	if (type !== holdType) {
		setHoldType(type !== "None" ? type : "EMPTY");
		setTexture(getTexture(canSwap ? type : "SHADOW"));
	}

	if (canSwap !== canSwapState) {
		setCanSwap(canSwap);
		if (canSwap)
			setTexture(getTexture(type))
	}


	return (
		<div className="holdPiece">
			<Tetrimino minoType={holdType} texture={texture} />
		</div>
		)
}

const   Hold = ({ holdPiece }) => {
	return (
		<div className="hold">
			<div className="holdTitle">HOLD</div>
			<div className="holdPiece">
				{
					holdPiece.hold ?
						<HoldPiece type={holdPiece.hold.name} canSwap={holdPiece.canSwap}/>
					:
						<div/>
				}
			</div>
		</div>
	)
}

export default Hold;