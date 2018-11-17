const appInfo = require("../package.json");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const { getPrefix, allCommands } = require("../commands");
const { logger } = require("../utils");
const buildTwiml = (twiml, result) => {
  const message = twiml.message();
  message.body(result.text);
  message.media(result.image);
};
module.exports = (server, options) => {
  server.route({
    method: "GET",
    path: "/",
    handler: async () => {
      return `${appInfo.name} v${appInfo.version} \n${appInfo.description}`;
    }
  });
  server.route({
    method: "GET",
    path: "/{file*}",
    handler: async (req, h) => {
      return h.file(req.params.file);
    }
  });
  server.route({
    options: {
      state: {
        parse: true, // parse cookies and store in request.state
        failAction: "log" // may also be 'ignore' or 'log'
      }
    },
    method: "POST",
    path: "/sms",
    handler: async (request, h) => {
      const { lastMsg, lastPrefix } = request.state.sms;
      const twiml = new MessagingResponse();
      const { Body } = request.payload;
      const prefix = getPrefix(Body);
      logger("new sms received");
      if (prefix) {
        const prefixIndex = Body.indexOf(prefix.value);
        let msg = Body.slice(prefixIndex + prefix.value.length); // slice of the prefix on the message
        // let args = msg.split(" "); // break the message into part by spaces
        //args.shift(); // delete the first word from the args
        //const cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
        if (prefix.match === "search") {
          logger("sms is search");
          const result = await prefix.handle(msg);
          buildTwiml(twiml, result);
        } else if (prefix.match === "add") {
          logger("sms is add");
          let shouldShowImage = true;
          if (msg == "" && lastMsg) {
            msg = lastMsg;
            shouldShowImage = false;
          }
          const result = await prefix.handle(msg, shouldShowImage);
          if (shouldShowImage) {
            buildTwiml(twiml, result);
          } else {
            twiml.message(result.text);
          }
        } else if (prefix.match === "cart") {
          logger("sms is cart");
          const result = await prefix.handle(msg);
          buildTwiml(twiml, result);
        } else {
          logger("could not find a command");
          twiml.message("Commands are:\n" + allCommands());
        }
        h.state("sms", { lastMsg: msg, lastPrefix: prefix.value });
      } else {
        logger("could not find a command");
        twiml.message("Commands are:\n" + allCommands());
      }

      logger("sending response");

      return h.response(twiml.toString()).header("Content-type", "text/xml");
    }
  });

  server.route({
    method: "POST",
    path: "/fail",
    handler: async (request, h) => {
      const twiml = new MessagingResponse();
      logger("a sms failed");
      twiml.message(
        "Sorry seems like it's taking too long to load. Please try again later!"
      );
      return h.response(twiml.toString()).header("Content-type", "text/xml");
    }
  });
};
