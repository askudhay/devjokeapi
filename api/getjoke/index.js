var unirest = require("unirest");
// allowCors function will be called to pass the response back
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const handler = async (request, response) => {
  // this function will be launched when the API is called.
  try {
    jokeId = between(1, 11);
    var req = unirest("POST", `API_URL`)
      .headers({
        "Content-Type": "application/json",
        Authorization: `API_KEY`,
      })
      .send(
        JSON.stringify({
          operation: "search_by_value",
          schema: "prod",
          table: "devjoke",
          search_attribute: "joke-id",
          search_value: jokeId,
          get_attributes: ["name", "twitter", "question", "punchline"],
        })
      )
      .end(function (res) {
        if (res.error) throw new Error(res.error);
        response.send(res.raw_body); // Send Joke JSON
      });
  } catch (err) {
    response.send(err); // send the thrown error
  }
};

module.exports = allowCors(handler);
