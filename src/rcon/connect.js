import { Rcon } from "rcon-client";
import "dotenv/config";

const connectRcon = async (delay = 5000) => {
  while (true) {
    try {
      const rcon = await Rcon.connect({
        host: process.env.RCON_HOST || "play.mineandtee.fun",
        port: process.env.RCON_PORT || 25575,
        password: process.env.RCON_PASSWORD,
      });
      console.log("RCON connected");
      return rcon;
    } catch (err) {
      console.error(`Failed to connect to RCON: ${err.message}`);
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const rcon = await connectRcon();

export default rcon;
