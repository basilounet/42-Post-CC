"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.fastify = exports.dlog = void 0;

const dlog = (message) => {
	if (process.env.PRINT_LOGS === "true")
		console.log(message);
}
exports.dlog = dlog;

const fastify = __importDefault(require("fastify"));
const cors = __importDefault(require("@fastify/cors"));
const socket_io = require("socket.io");
const dotenv = require("dotenv");
const { quitMultiplayerRoom } = require("../tetris_app/socket/controllers");
const routes = __importDefault(require("../tetris_app/socket/routes"));



dotenv.config({ path : __dirname + "/../../../.env" });
// dlog("Environment variables loaded: " + process.env.BACK_PORT);
exports.fastify = (0, fastify.default)();
exports.address = process.env.VITE_API_ADDRESS;


exports.io = new socket_io.Server(exports.fastify.server, {
	cors: {
		origin: '*', // Allow all origins, or specify your frontend's origin
		methods: ['GET', 'POST'],
	},
});

// Register routes
exports.fastify.register((fastify) => {
	fastify.get('/health', async (request, reply) => {
		// You can add more complex health checks here if needed
		return { status: 'ok' };
	});
});

if (require.main === module) {
	exports.fastify.listen({port: parseInt(process.env.BACK_PORT) || 3000, host: "0.0.0.0"}, (err, address) => {
		if (err) {
			exports.fastify.log.error(err);
			process.exit(1);
		}
		exports.io.on('connection', (socket) => {
			dlog(`${socket.id} connected!`);

			socket.on("message", (message) => {
				dlog(`Message from ${socket.id}: ${message}`);
			});
			(0, routes.default)(socket);
			// tetrisRoutes();

			socket.on('disconnect', () => {
				// Handle disconnection
				dlog(`${socket.id} disconnected!`);
				quitMultiplayerRoom(socket);
			});
		});
		dlog(`🚀 Server listening at ${address}`);
	});
}
else {
	dlog("Server module loaded, but not running. Use 'node server.js' to start the server.");
}
