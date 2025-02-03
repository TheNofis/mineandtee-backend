import { Rcon } from "rcon-client";
import "dotenv/config";

const rcon = await Rcon.connect({
  host: process.env.RCON_HOST || "play.mineandtee.fun",
  port: process.env.RCON_PORT || 25575,
  password: process.env.RCON_PASSWORD,
})
  .then((rcon) => {
    console.log("RCON connected");
    return rcon;
  })
  .catch((err) => {
    console.log(err);
  });

export default rcon;
