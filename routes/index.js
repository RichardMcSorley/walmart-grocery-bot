const appInfo = require("../package.json");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const { getPrefix } = require("../commands");
module.exports = (server, options) => {
  server.route({
    method: "GET",
    path: "/",
    handler: async () => {
      return `${appInfo.name} v${appInfo.version} \n${appInfo.description}`;
    }
  });

  server.route({
    method: "POST",
    path: "/sms",
    handler: async (request, h) => {
      const twiml = new MessagingResponse();
      const { Body } = request.payload;
      const prefix = getPrefix(Body);
      if (prefix) {
        const prefixIndex = Body.indexOf(prefix.value);
        const msg = Body.slice(prefixIndex + prefix.value.length); // slice of the prefix on the message
        let args = msg.split(" "); // break the message into part by spaces
        const cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
        args.shift(); // delete the first word from the args
        if (prefix.match === "search") {
          const { searchProduct } = require("../commands");
          const result = await searchProduct(msg);
          const message = twiml.message();
          message.body(result.text);
          message.media(result.image);
        } else if (prefix.match === "add") {
          const { addToCart } = require("../commands");
          const result = await addToCart(msg);
          const message = twiml.message();
          message.body(result.text);
          message.media(result.image);
        } else {
          twiml.message("Sorry I dont understand, please use !search or !add");
        }
      } else {
        twiml.message("Sorry I dont understand, please use !search or !add");
      }

      console.log(Body);

      return h.response(twiml.toString()).header("Content-type", "text/xml");
    }
  });

  server.route({
    method: "POST",
    path: "/fail",
    handler: async (request, h) => {
      const twiml = new MessagingResponse();
      twiml.message(
        "Sorry seems like it's taking too long to load. Please try again later!"
      );
      return h.response(twiml.toString()).header("Content-type", "text/xml");
    }
  });
};
