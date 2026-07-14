import "./ArcadeBoard.css";
import Matrix from "../Matrix/Matrix.jsx";
import { useEffect, useState } from "react";
import { sfxPlayer } from "../../sfxHandler.jsx";
import Hold from "../Hold/Hold.jsx";
import Bags from "../Bags/Bags.jsx";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/socket/useSocket.jsx";

const   EndDisplay = ({stats, display = false}) => {
	const navigate = useNavigate();

	if (!stats) {
		return <div className={"statsDisplay"}></div>;
	}

	return (
		<div className={"statsDisplay"} style={{display: display ? "block" : "none"}}>
			<div className={"endTitle"}>GAME OVER</div>
			<div className={"score"}>Score: {stats.score}</div>

			<div className={"detailsTable"}>
				<div className={"infoTable"}>
					<div className={"infoTitle"}>Total Time:</div>
					<div className={"infoValue"}>{stats?.totalTime}</div>
					<div className={"infoTitle"}>Level:</div>
					<div className={"infoValue"}>{stats?.level}</div>
					<div className={"infoSpacing"}/>
					<div className={"infoSpacing"}/>
					<div className={"infoTitle"}>Max Combo:</div>
					<div className={"infoValue"}>{stats?.maxCombo}</div>
					<div className={"infoTitle"}>Max B2B:</div>
					<div className={"infoValue"}>{stats?.maxB2B}</div>
					<div className={"infoTitle"}>Perfect Clears:</div>
					<div className={"infoValue"}>{stats?.perfectClears}</div>
					<div className={"infoTitle"}>Pieces:</div>
					<div className={"infoValue"}>{stats?.piecesPlaced} placed | {stats?.piecesPerSecond} / s</div>
					<div className={"infoSpacing"}/>
					<div className={"infoSpacing"}/>
					<div className={"infoTitle"}>Keys:</div>
					<div className={"infoValue"}>{stats?.keysPressed} pressed | {stats?.keysPerPiece} / pieces
						| {stats?.keysPerSecond} / s
					</div>
					<div className={"infoTitle"}>Holds:</div>
					<div className={"infoValue"}>{stats?.holds}</div>
					<div className={"infoTitle"}>Lines:</div>
					<div className={"infoValue"}>{stats?.linesCleared} cleared | {stats?.linesPerMinute} / min</div>
					<div className={"infoSpacing"}/>
					<div className={"infoSpacing"}/>
				</div>
			</div>
			<div className={"clearsTable"}>
				<div className={"clearsInfoTitle"}>TYPE</div>
				<div className={"clearsInfoTitle"}>Zero</div>
				<div className={"clearsInfoTitle"}>Single</div>
				<div className={"clearsInfoTitle"}>Double</div>
				<div className={"clearsInfoTitle"}>Triple</div>
				<div className={"clearsInfoTitle"}>Quad</div>

				<div className={"clearsInfoKey"}>Clears</div>
				<div className={"clearsInfoValueEmpty"}></div>
				<div className={"clearsInfoValue"}>{stats?.single}</div>
				<div className={"clearsInfoValue"}>{stats?.double}</div>
				<div className={"clearsInfoValue"}>{stats?.triple}</div>
				<div className={"clearsInfoValue"}>{stats?.quad}</div>

				<div className={"clearsInfoKey"}>Tspin</div>
				<div className={"clearsInfoValue"}>{stats?.tspinZero}</div>
				<div className={"clearsInfoValue"}>{stats?.tspinSingle}</div>
				<div className={"clearsInfoValue"}>{stats?.tspinDouble}</div>
				<div className={"clearsInfoValue"}>{stats?.tspinTriple}</div>
				<div className={"clearsInfoValueEmpty"}></div>

				<div className={"clearsInfoKey"}>Mini Tspin</div>
				<div className={"clearsInfoValue"}>{stats?.miniTspinZero}</div>
				<div className={"clearsInfoValue"}>{stats?.miniTspinSingle}</div>
				<div className={"clearsInfoValueEmpty"}></div>
				<div className={"clearsInfoValueEmpty"}></div>
				<div className={"clearsInfoValueEmpty"}></div>

				<div className={"clearsInfoKey"}>Mini Spin</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinZero}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinSingle}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinDouble}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinTriple}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinQuad}</div>
			</div>
			<div className={"backHomeButtonArcade"} onClick={ () => navigate("/")} > Go Back Home </div>
		</div>
	);
}

const   ScoreDisplay = ({score}) => {
	return (
		<div className={"scoreDisplay"}>
			<div className={"scoreDisplayTitle"}>Score:</div>
			<div className={"scoreDisplayValue"}>{ score }</div>
		</div>
	)
}

const   GameStats = ({gameInfo}) => {
	return (
		<div className={"gameStats"}>
			<div className={"gameStatsKey"}>{"Level:"}</div>
			<div className={"gameStatsValue"}>{gameInfo.level}</div>
			<div className={"gameStatsKey"}>{"Time:"}</div>
			<div className={"gameStatsValue"}>{new Date(gameInfo.time || 0).toISOString().substring(14, 23)}</div>
			<div className={"gameStatsKey"}>{"Goal:"}</div>
			<div className={"gameStatsValue"}>{gameInfo.linesCleared + " / " + gameInfo.lineClearGoal}</div>
			<div className={"gameStatsKey"}>{"Pieces:"}</div>
			<div className={"gameStatsValue"}>{gameInfo.piecesPlaced + ", " + gameInfo.piecesPerSecond + "/s"}</div>
		</div>
	)
}

const ArcadeBoard = () => {

	const socket = useSocket();
	const [abortController, setAbortController] = useState(new AbortController());
	const [game, setGame] = useState({
		matrix: Array.from({length: 41}, () => Array.from({length: 10}, () => ({texture: "EMPTY"}))),
		bags: null,
		hold: null,
		canSwap: null,
		gameId: null,
		score: null,
		level: null,
		time: null,
		awaitingGarbage: null,
		linesCleared: null,
		lineClearGoal: null,
		piecesPlaced: null,
		piecesPerSecond: null
	});
	const [stats, setStats] = useState({
		attacksReceived: 0,
		attacksReceivedPerMinute: 0,
		attacksSent: 0,
		attacksSentPerMinute: 0,
		double: 0,
		gameTime: 1956,
		holds: 0,
		isInRoom: false,
		keysPerPiece: 0,
		keysPerSecond: 0.0,
		keysPressed: 0,
		level: 0,
		linesCleared: 0,
		linesPerMinute: 0,
		maxB2B: 0,
		maxCombo: 0,
		miniSpinDouble: 0,
		miniSpinQuad: 0,
		miniSpinSingle: 0,
		miniSpinTriple: 0,
		miniSpinZero: 0,
		miniTspinSingle: 0,
		miniTspinZero: 0,
		perfectClears: 0,
		piecesPerSecond: 0.0,
		piecesPlaced: 0,
		quad: 0,
		score: 0,
		single: 0,
		totalTime: "",
		triple: 0,
		tspinDouble: 0,
		tspinSingle: 0,
		tspinTriple: 0,
		tspinZero: 0,
	});
	const [displayStats, setDisplayStats] = useState(false);

	const gameControllers = async (abortController, socket) => {
		const signal = abortController.signal;
		const keydownHandler = async (event) => {
			if (!event.repeat)
				socket.emit("keydown", event.key)
		};
		const keyupHandler = async (event) => {
			if (!event.repeat)
				socket.emit("keyup", event.key)
		};

		document.addEventListener("keydown", keydownHandler, {signal});
		document.addEventListener("keyup", keyupHandler, {signal});
	}

	useEffect(() => {

		const   handleGameReplacement = (setGame) => {
			return (data) => {
				const new_data = JSON.parse(data);
				setGame(new_data.game);
			}
		}

		const   handleSfx = (data) => {
			const new_data = JSON.parse(data);
			const sfx = sfxPlayer(new_data.type, new_data.value);

			sfx?.play();
		}

		const   handleStatsUpdate = (setStats, setDisplayStats, abortController, socket) => {
			return (data) => {
				const new_data = JSON.parse(data);

				setStats(new_data.stats);
				setDisplayStats(true);
				abortController.abort();
				socket.off("GAME_START");
				socket.off("GAME");
				socket.off("EFFECT");
				socket.off("STATS");
			}
		}

		socket.emit("arcadeStart");

		socket.on("GAME_START", handleGameReplacement(setGame));

		socket.on("GAME", handleGameReplacement(setGame));

		socket.on("EFFECT", handleSfx);

		socket.on("STATS", handleStatsUpdate(setStats, setDisplayStats, abortController, socket));

		gameControllers(abortController, socket);
	}, [socket, abortController, setGame, setStats, setDisplayStats]);

	return (
		<div className={"board"}>
			<div className={"boardHold"}>
				<Hold holdPiece={{hold: game.hold, canSwap: game.canSwap}}/>
			</div>
			<div className={"boardMatrix"}>
				<Matrix matrix={game.matrix} width={320} height={640}/>
			</div>
			<div className={"boardBag"}>
				<Bags bags={game.bags}/>
			</div>
			<GameStats gameInfo={game} />
			<ScoreDisplay score={game.score} />
			<EndDisplay stats={stats} display={displayStats}/>
		</div>
	);
}

export default ArcadeBoard;