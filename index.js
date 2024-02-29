import express from "express";
import cors from "cors";
import generatePDF from "./utils/helpers.js";
import { scraphtml, test } from "./utils/htmlScrapper.js";

import WebSocket from "ws";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log("server running"));

app.get("/test", async (req, res) => {
	await generatePDF();
	res.send("file generated");
});

app.get("/test1", async (req, res) => {
	await scraphtml();
	res.send("scrapping html");
});

app.post("/journey-auth", async (req, res) => {
	let { userId, sessionId } = req.body;
	if (!userId.trim() || !sessionId.trim()) {
		return res.status(400).send("userId or sessionId missing");
	}

	let authRes = await journeySocket(userId, sessionId);
	console.log(authRes);

	return res.send(authRes);
});

async function journeySocket(userId, sessionId) {
	return new Promise((resolve, reject) => {
		const url = `wss://app.journeyid.io/api/iframe/ws/users/${userId}/sessions/${sessionId}`;

		let ws = new WebSocket(url);

		ws.on("open", () => {
			console.log("Connected to websocket");
			ws.send(
				"CONNECT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrYW1sZXNoamFpbiIsImlmciI6IjBlYjcyNDUzLTZmNmMtNDdhMC05YmRhLWYyOTFkN2E1MDNhOCIsImV4cCI6MTcwODY4NTAyNzgzOSwiaWF0IjoxNzA4Njg0OTQxfQ.28rpU-75lyTBO8ZpBP9HrlaWLZNMvc1qekZq92dNGFI"
			);
		});

		ws.on("message", (data) => {
			let messageData = JSON.parse(data);
			console.log("Received message:", messageData.event);

			if (
				messageData.event === "session-authenticated" ||
				messageData.event === "execution-completed"
			) {
				ws.close();
				resolve({ authentication: true });
			}
		});

		ws.on("close", () => {
			console.log("Connection closed");
			// connect();
		});

		ws.on("error", (err) => {
			reject(err);
		});
	});
}
