const screenshot = require("screenshot-desktop");
const fs = require("fs");
var https = require("https");

screenshot()
  .then((img) => {
    let base64Data = Buffer.from(img).toString("base64");
    reqBody = {
      folderId: "b1gov34hgokpd0kcjie8",
      analyze_specs: [
        {
          content: base64Data,
          features: [
            {
              type: "TEXT_DETECTION",
              text_detection_config: {
                language_codes: ["*"],
              },
            },
          ],
        },
      ],
    };

    const options = {
      host: "vision.api.cloud.yandex.net",
      path: "/vision/v1/batchAnalyze",
      method: "POST",
    };

    function callback(response) {
      let str = "";
      response.on("data", function (chunk) {
        str += chunk;
      });

      response.on("end", function () {
        let myResp = JSON.parse(str);
        console.log(myResp.results);
        let blocks = myResp.results[0].results[0].textDetection.pages[0].blocks;
        let myText = "";
        blocks.forEach(({ lines }) => {
          myText += "\n";
          lines.forEach(({ words }) =>
            words.forEach(({ text }) => (myText += " " + text))
          );
        });

        fs.writeFile("text.txt", myText, function (err) {
          if (err) return console.log(err);
          console.log("text recognised: text.txt");
        });
      });
    }

    let req = https.request(options, callback);
    req.setHeader("Content-Type", "application/json");
    req.setHeader(
      "Authorization",
      "Bearer t1.9euelZrImMbHmMiLy5HJzZjIm5CKmu3rnpWal5Gclo2cmZuenZqdnZWJiZjl8_cnW3Vr-e8pexd8_t3z92cJc2v57yl7F3z-.ohwfzVavJWchoWIE52iGC8Tyf2Q_DT7AVgLr6Uc3IoXuROY4uczjAndF6t_iKG9tXBmfgPRqVxB7HcM7SCc0BA"
    );
    req.write(JSON.stringify(reqBody));
    req.end();
  })
  .catch((err) => {
    console.log(err);
  });
