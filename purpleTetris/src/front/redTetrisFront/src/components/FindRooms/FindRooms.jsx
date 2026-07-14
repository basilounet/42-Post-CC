import "./FindRooms.css";
import ReturnHomeButton from "../ReturnHomeButton/ReturnHomeButton.jsx";
import { useState, useRef, useEffect } from "react";
import { getRandomUsername } from "../../utils.jsx";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/socket/useSocket.jsx";


const   RoomList = () => {
	const   navigate = useNavigate();
	const socket = useSocket()
	const [rooms, setRooms] = useState(() => []);
	const [page, setPage] = useState(() => 0);

	useEffect(() => {
		socket.emit("quitMultiplayerRoom");

		fetchRooms(socket, setRooms, setPage);
		return () => {
			socket.off("GET_MULTIPLAYER_ROOMS");
		};
	}, [socket, setRooms, setPage]);


	const fetchRooms = (socket, setRooms, setPage) => {
		const   setupRooms = (setRooms, setPage) => { return (rooms) => {
			setRooms(JSON.parse(rooms));
			setPage(0);
		}}

		socket.emit("getMultiplayerRooms");
		socket.once("GET_MULTIPLAYER_ROOMS", setupRooms(setRooms, setPage));
	};

	const handlePageChange = (direction, page, setPage, rooms, socket, setRooms) => {
		if (direction === "refresh")
			fetchRooms(socket, setRooms, setPage);
		if (direction === "next" && ((page + 1) * 10 < rooms.length))
			setPage(page + 1);
		if (direction === "prev" && page > 0)
			setPage(page - 1);
	};

	const getRooms = (roomsEl, rooms, page, i, navigate) => {
		if (page * 10 + i >= rooms.length || i >= 10)
			return roomsEl;
		// concat returns a new array and does not mutate the original array
		return getRooms(roomsEl.concat([
			<div className={"room"} key={rooms[page * 10 + i].code || i} onClick={() =>
				navigate(`/${rooms[page * 10 + i].code}`)}>
				<div className={"roomName"}>{`Room ${page * 10 + i + 1}`}</div>
				<div>{`code: ${rooms[page * 10 + i].code}`}</div>
				<div className={"roomPlayers"}>{`${rooms[page * 10 + i].nbPlayers} players`}</div>
			</div>
		]), rooms, page, i + 1, navigate);
	}

	return (
		<div>
			<div className={"buttonsDiv"}>
				<div className={"button"} onClick={() => handlePageChange("refresh", page, setPage, rooms, socket, setRooms)}>Refresh</div>
				<div className={"nextPrevButtons"}>
					<div className={"button"} onClick={() => handlePageChange("prev", page, setPage, rooms, socket, setRooms)}>Prev</div>
					<div className={"button"} onClick={() => handlePageChange("next", page, setPage, rooms, socket, setRooms)}>Next</div>
				</div>
			</div>
			<div className={"roomList"}>
				{getRooms([], rooms, page, 0, navigate)}
			</div>
		</div>
	);
}

const CreateRoom = ({ display, onClose }) => {
	const   createRoomRef = useRef();
	const   navigate = useNavigate();
	const   [usernameValue, setUsernameValue] = useState(getRandomUsername(Math.random(), Math.random()));
	const   [roomId, setRoomId] = useState("");
	const   [error, setError] = useState("");

	const handleUsernameChange = (inputUsername, navigate) => {
		// Allow alphanumeric and underscores, max 20 characters
		const   username = !(/^[A-Za-z0-9_]{1,20}$/.test(inputUsername)) ? getRandomUsername(Math.random(), Math.random()) : inputUsername;
		navigate(`/${roomId}/${username}`);
	};

	useEffect(() => {
        const handleClickOutside = (createRoomRef, onClose, setUsernameValue) => {
			return (event) => {
				if (createRoomRef.current && !createRoomRef.current.contains(event.target)) {
					onClose();
					setUsernameValue(getRandomUsername(Math.random(), Math.random()));
				}
			}
		};

        document.addEventListener("mousedown", handleClickOutside(createRoomRef, onClose, setUsernameValue));
		return () => {
            document.removeEventListener("mousedown", handleClickOutside(createRoomRef, onClose, setUsernameValue));
        };
	}, [onClose, createRoomRef, setUsernameValue]);

	return (
	<div className={"createRoom"} ref={createRoomRef} style={{ display: display ? "flex" : "none" }} >
		<div className={"title"}>
	        Create Room
		</div>
		<form className={"createRoomForm"} onSubmit={(event) => {
			event.preventDefault();
			if (!(/^[A-Z]{4}$/.test(roomId))) {
				setError("Please enter a valid Room Code (4 uppercase letters).");
				return;
			}
			handleUsernameChange(usernameValue, navigate);
		}} >
			Enter the room code and your username to create a room.
			<span className={"createRoomError"} style={{ color: "red", display: error !== "" ? "block" : "none", margin: "10px" }}>
				{error}
			</span>
			<input className={"createRoomInput"} type="text" placeholder="Room Code" minLength={4} maxLength={4}
				onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
				onChange={e => setRoomId(e.target.value)}
			/>
			<input
				className={"createRoomInput"}
				type="text"
				onChange={e => setUsernameValue(e.target.value)}
				value={usernameValue}
			/>
			<input type={"submit"} className={"submitButton"}/>
		</form>
	</div>
	);
};

const FindRooms = () => {
	const [showCreateRoom, setShowCreateRoom] = useState(false);

	return (
		<div className={"findRooms"}>
			<div className={"title"}>FIND ROOMS</div>
			<ReturnHomeButton/>
			<RoomList/>
			<div className={"createRoomButton"} onClick={() => setShowCreateRoom(true)}>Create Room</div>
			<CreateRoom display={showCreateRoom} onClose={() => setShowCreateRoom(false)}/>
		</div>
	);
};

export default FindRooms;