import  "./Home.css"
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/socket/useSocket.jsx";
import { useEffect } from "react";

const   Home = () => {
	const   navigate = useNavigate();
	const socket = useSocket()

	useEffect(() => {
		socket.emit("quitMultiplayerRoom");
	}, [socket]);

	const   arcadeOnClick = () => {
		navigate("/arcade-board");
	}


	const   joinGameOnClick = () => {
		navigate("/find-room");
	}

	return (
		<div>
			<div style={{marginTop: "15%"}}></div>
			<div className={"title"}>PURPLE TETRIS</div>
			<div className={"menu"}>
				<TetrisButtons id={"arcade"} onClick={arcadeOnClick}>
					PLAY ARCADE
				</TetrisButtons>
				<TetrisButtons id={"joinGame"} onClick={joinGameOnClick}>
					JOIN A GAME
				</TetrisButtons>
			</div>
		</div>
	)
}

export default Home;