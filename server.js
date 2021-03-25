const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

require("dotenv/config");
const baseUrl = "https://nigerialogos.com";

app.use(bodyParser.json());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/", (req, res) => {
  res.json({ message: "Nigerian logos plugin" });
});

app.get("/api/logos", async (req, res) => {
  return request.get(
    {
      url: `${baseUrl}/logos.json`,
    },
    function optionalCallback(err, httpResponse, body) {
      if (httpResponse) {
        res.statusCode = 200;
        res.json(JSON.parse(httpResponse.body));
      } else {
        res.statusCode = 500;
        res.json({ message: "a network error occured" });
      }
    }
  );
});

app.get("/api/logos/:company", async (req, res) => {
  const { company } = req.params;
  return request.get(
    {
      url: `${baseUrl}/logos/${company}/${company}.svg`,
    },
    function optionalCallback(err, httpResponse, body) {
      if (httpResponse) {
        res.statusCode = 200;
        res.json(httpResponse.body);
      } else {
        res.statusCode = 500;
        res.json({ message: "a network error occured" });
      }
    }
  );
});


app.listen(process.env.PORT || 5000);
