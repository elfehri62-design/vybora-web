
import express from "express";
import { AccessToken } from "livekit-server-sdk";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VYBORA LIVE SERVER OK 💜");
});

app.post("/token", async (req, res) => {
  try {
    const { room, username } = req.body;

    if (!room || !username) {
      return res.status(400).json({
        error: "Salle et pseudo obligatoires"
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        error: "Configuration LiveKit manquante"
      });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: username
    });

    token.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true
    });

    res.json({ token: await token.toJwt() });
  } catch (error) {
    res.status(500).json({
      error: "Impossible de créer le token"
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`VYBORA LIVE écoute sur le port ${port}`);
});
