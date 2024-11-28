var express = require("express");
var app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
var corsOptions = {
  origin: "https://shopee.vn",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});

var upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.options("*", cors(corsOptions));
app.post(
  "/save-data",
  cors(corsOptions),
  upload.none(),
  async (req, res, next) => {
    const { data, offset, item_id } = req.body;

    if (item_id) {
      await fs.writeFileSync(
        "./response/data/product/" + item_id + ".json",
        JSON.stringify(data),
        (err) => {
          console.log(err);
        }
      );
    } else if (data) {
      await fs.writeFileSync(
        "./response/data/product_" + offset + ".json",
        JSON.stringify(data),
        (err) => {
          console.log(err);
        }
      );
    }

    res.send({ success: true });
  }
);

app.post(
  "/upload-file",
  cors(corsOptions),
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
  }
);

app.post(
  "/save-image",
  cors(corsOptions),
  upload.none(),
  async (req, res, next) => {
    const { data, bookSlug, chapterSlug, filename } = req.body;
    console.log(bookSlug, chapterSlug, filename);
    const data1 = data.replace(/^data:image\/\w+;base64,/, "");

    const buf = Buffer.from(data1, "base64");
    if (!fs.existsSync("./source/" + bookSlug)) {
      fs.mkdirSync("./source/" + bookSlug);
    }
    if (!fs.existsSync("./source/" + bookSlug + "/" + chapterSlug)) {
      fs.mkdirSync("./source/" + bookSlug + "/" + chapterSlug);
    }
    await fs.writeFileSync(
      "./source/" + bookSlug + "/" + chapterSlug + "/" + filename + ".png",
      buf,
      (err) => {
        console.log(err);
      }
    );
    res.send({ success: true });
  }
);

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listen at: http://%s:%s", host, port);
});
