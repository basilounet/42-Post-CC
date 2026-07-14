import "./Tetrimino.css"
import { getTexture } from "../../utils.jsx";

const   Tetrimino = ({minoType, texture, minoSize = 32}) => {
	const   getTetriminoPattern = (type) => {
		switch (type) {
			case "I": return  [[ 1, 1, 1, 1 ]];
			case "J": return  [[ 1, 0, 0 ], [ 1, 1, 1 ]];
			case "L": return  [[ 0, 0, 1 ], [ 1, 1, 1 ]];
			case "O": return  [[ 1, 1 ], [ 1, 1 ]];
			case "S": return  [[ 0 ,1, 1 ], [ 1, 1, 0 ]];
			case "T": return  [[ 0, 1, 0 ], [ 1, 1, 1 ]];
			case "Z": return  [[ 1, 1, 0 ], [ 0, 1, 1 ]];
			default: return [[ 0 ]]; // Empty or unknown type
		}
	}

	if (!minoType || minoType === "EMPTY") {
		return (
			<div className="tetrimino">
				<img className={"mino"} src={getTexture("EMPTY")} style={{width: `${minoSize}px`, height: `${minoSize}px` }} alt="empty" />
			</div>
		)
	}


	if (!texture)
		texture = getTexture(minoType);

	const   printMino = (minoSize, texture) => {
		return (cell, cellIndex) => (
			<img key={cellIndex} className={"mino"} style={{width: `${minoSize}px`, height: `${minoSize}px` }} src={cell ? texture : getTexture("EMPTY")} alt={cellIndex}/>
		)
	}

	const   printTetrimino = (minoSize, texture) => {
		return (row, rowIndex) => {
			return (
				<div key={rowIndex} className="tetriminoRow" style={{height: `${minoSize}px`}}>
					{ row.map(printMino(minoSize, texture)) }
				</div>
			)
		}
	}

	return (
		<div>
			<div className="tetrimino">
				{ getTetriminoPattern(minoType).map(printTetrimino(minoSize, texture)) }
			</div>
		</div>
	)

}

export default Tetrimino;