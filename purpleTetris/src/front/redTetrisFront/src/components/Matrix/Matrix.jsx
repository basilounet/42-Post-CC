import  "./Matrix.css"
import { useState } from "react";
import { getTexture } from "../../utils.jsx";

const   Mino = ({type, width, height, id}) => {
	const   [currentType, setCurrentType] = useState("EMPTY");
	const   [currentTexture, setCurrentTexture] = useState(getTexture("EMPTY"));

	if (currentType !== type.texture) {
		setCurrentType(type.texture);
		setCurrentTexture(getTexture(type.texture));
	}

	return (
		<img className={"mino"} src={currentTexture} style={{ width: `${width}px`, height: `${height}px`  }} alt={type} id={id} />
	);
}

const   Rows = ({row, width, height, id}) => {
	const   [size, setSize] = useState({ width: width || 320, height: height || 32 });

	return (
		<div className={"rowContainer"} style={{ width: `${width}px`, height: `${height}px` }}>
			<Mino type={row[0]} width={size.width / 10} height={size.height} id={id + "_0"}/>
			<Mino type={row[1]} width={size.width / 10} height={size.height} id={id + "_1"}/>
			<Mino type={row[2]} width={size.width / 10} height={size.height} id={id + "_2"}/>
			<Mino type={row[3]} width={size.width / 10} height={size.height} id={id + "_3"}/>
			<Mino type={row[4]} width={size.width / 10} height={size.height} id={id + "_4"}/>
			<Mino type={row[5]} width={size.width / 10} height={size.height} id={id + "_5"}/>
			<Mino type={row[6]} width={size.width / 10} height={size.height} id={id + "_6"}/>
			<Mino type={row[7]} width={size.width / 10} height={size.height} id={id + "_7"}/>
			<Mino type={row[8]} width={size.width / 10} height={size.height} id={id + "_8"}/>
			<Mino type={row[9]} width={size.width / 10} height={size.height} id={id + "_9"}/>
		</div>
	);
}

const   UsernameDisplay = ({ username }) => {
	if (!username)
		return (<></>);

	return (
		<div className={"usernameContainer"}>
			<span className="username">
				{username}
			</span>
		</div>
	);
}

const   Matrix = ({ matrix, width, height, id, username }) => {
	const   [size, setSize] = useState({ width: width || 320, height: height || 640 });
	// if (!matrix)
	// 	return Matrix({
	// 		matrix: Array(40).fill(Array(10).fill({ texture: "EMPTY" })),
	// 		width: width || 320,
	// 		height: height || 640,
	// 		id: id || "matrix",
	// 		username: username || null
	// 	});


	return (
		<div className={"matrixContainer"}>
			<div className={"matrixGrid"}>
				<div className={"colContainer"} style={{width: `${width}px`, height: `${height}px`}} id={id}>
					<Rows row={matrix[20]} width={size.width} height={size.height / 20} id={id + "_0"}/>
					<Rows row={matrix[21]} width={size.width} height={size.height / 20} id={id + "_1"}/>
					<Rows row={matrix[22]} width={size.width} height={size.height / 20} id={id + "_2"}/>
					<Rows row={matrix[23]} width={size.width} height={size.height / 20} id={id + "_3"}/>
					<Rows row={matrix[24]} width={size.width} height={size.height / 20} id={id + "_4"}/>
					<Rows row={matrix[25]} width={size.width} height={size.height / 20} id={id + "_5"}/>
					<Rows row={matrix[26]} width={size.width} height={size.height / 20} id={id + "_6"}/>
					<Rows row={matrix[27]} width={size.width} height={size.height / 20} id={id + "_7"}/>
					<Rows row={matrix[28]} width={size.width} height={size.height / 20} id={id + "_8"}/>
					<Rows row={matrix[29]} width={size.width} height={size.height / 20} id={id + "_9"}/>
					<Rows row={matrix[30]} width={size.width} height={size.height / 20} id={id + "_10"}/>
					<Rows row={matrix[31]} width={size.width} height={size.height / 20} id={id + "_11"}/>
					<Rows row={matrix[32]} width={size.width} height={size.height / 20} id={id + "_12"}/>
					<Rows row={matrix[33]} width={size.width} height={size.height / 20} id={id + "_13"}/>
					<Rows row={matrix[34]} width={size.width} height={size.height / 20} id={id + "_14"}/>
					<Rows row={matrix[35]} width={size.width} height={size.height / 20} id={id + "_15"}/>
					<Rows row={matrix[36]} width={size.width} height={size.height / 20} id={id + "_16"}/>
					<Rows row={matrix[37]} width={size.width} height={size.height / 20} id={id + "_17"}/>
					<Rows row={matrix[38]} width={size.width} height={size.height / 20} id={id + "_18"}/>
					<Rows row={matrix[39]} width={size.width} height={size.height / 20} id={id + "_19"}/>
				</div>
			</div>
			<UsernameDisplay username={username} />
		</div>
	);
}

export default Matrix;