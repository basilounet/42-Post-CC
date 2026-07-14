import "./ChooseUsername.css";
import { useNavigate, useParams } from "react-router-dom";
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import { useEffect, useState } from "react";
import { getRandomUsername } from "../../utils.jsx";
import { useSocket } from "../../hooks/socket/useSocket.jsx";


const   InvalidRoomId = ({roomId}) => {
	const navigate = useNavigate();

	return (
		<>
			{roomId} is an invalid room ID. <br />
			Please use a valid room code. <br />
			Valid room codes are 4 uppercase letters (A-Z). <br />

			<div className={"invalidRoomButton"}>
				<TetrisButtons onClick={() => navigate("/")}>Return Home</TetrisButtons>
			</div>
		</>
	)
}

const ChooseUsername = () => {
	const   { roomId } = useParams();
	const   [inputValue, setInputValue] = useState(getRandomUsername(Math.random(), Math.random()));
	const   navigate = useNavigate();
	const  socket = useSocket();

	const handleUsernameChange = (inputUsername, navigate) => {
		const   username = !(/^[A-Za-z0-9_]{1,20}$/.test(inputUsername)) ? getRandomUsername(Math.random(), Math.random()) : inputUsername;
		navigate(`/${roomId}/${username}`);
	};

	const findRoom = (navigate) => {
		navigate("/find-room");
	}

	useEffect(() => {
		socket.emit("quitMultiplayerRoom");
	}, [socket]);

	if ((/^[A-Z]+$/.test(roomId)) === false || roomId.length !== 4) {
		return (
			<>
				<InvalidRoomId roomId={roomId} />
			</>
		);
	}

	return (
		<div>
			You are in room: {roomId}. <br />
			You can choose a username here. <br />

			<form onSubmit={(e) => {
				e.preventDefault();
				handleUsernameChange(inputValue, navigate);
			}} id={"chooseUsernameForm"} className={"chooseUsernameForm"}>
				<div style={{marginBottom: `5%`}}></div>
				<input
					className={"usernameInput"}
					type="text"
					placeholder={getRandomUsername(Math.random(), Math.random())}
					style={{ marginTop: "10px", padding: "8px", fontSize: "16px", marginBottom: "5%" }}
					onChange={e => setInputValue(e.target.value)}
					value={inputValue}
				/>
				<input className={"submitButton"} type="submit" value="Submit" style={{marginBottom: `5%`}}/>
				<div className={"findRoomButton"} onClick={() => findRoom(navigate)}>Find a Room</div>
			</form>
		</div>
	);
};

export default ChooseUsername;