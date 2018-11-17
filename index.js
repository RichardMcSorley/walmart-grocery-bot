require("dotenv").config();
const Hapi = require("hapi");
const Path = require("path");
const server = Hapi.server({
  port: process.env.PORT,
  host: "localhost",
  routes: {
    files: {
      relativeTo: Path.join(__dirname, "screenshots")
    }
  }
});

require("./commands");
require("./routes")(server); //setup routes

const init = async () => {
  server.state("sms", {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: "base64json",
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
  });
  await server.start();
  await server.register(require("inert"));
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Closing server...");
  server.stop().then(async err => {
    console.log("hapi server stopped ");
    process.exit(err ? 1 : 0);
  });
  // Force close server after 5secs
  setTimeout(e => {
    console.log("Forcing server close !!!", e);
    process.exit(1);
  }, 6000);
});
init();
