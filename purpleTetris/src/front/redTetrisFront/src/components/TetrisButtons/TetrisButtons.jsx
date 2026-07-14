import  "./TetrisButtons.css"
import React from "react";

const   TetrisButtons = ({ id, onClick, children }) => {
	return (
		<div
			className={"tetris-button"}
			id={id}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export default TetrisButtons;