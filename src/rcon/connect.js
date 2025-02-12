import { Rcon } from "rcon-client";
import "dotenv/config";

const connectRcon = async (host, password, port = 25575, delay = 5000) => {
  while (true) {
    try {
      const rcon = await Rcon.connect({
        host,
        port,
        password,
      });
      console.log(`RCON connected to ${host}:${port}`);
      return rcon;
    } catch (err) {
      console.error(`Failed to connect to RCON: ${err.message}`);
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const Lobby = await connectRcon(
  process.env.RCON_HOST_LOBBY,
  process.env.RCON_PASSWORD_LOBBY,
);

const Proxy = await connectRcon(
  process.env.RCON_HOST_PROXY,
  process.env.RCON_PASSWORD_PROXY,
);

export default { Lobby, Proxy };
