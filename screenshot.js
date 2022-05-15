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

    var options = {
      host: "vision.api.cloud.yandex.net",
      path: "/vision/v1/batchAnalyze",
      method: "POST",
    };

    function callback(response) {
      var str = "";
      response.on("data", function (chunk) {
        str += chunk;
      });

      response.on("end", function () {
        let myResp = JSON.parse(str);
        let blocks = myResp.results[0].results[0].textDetection.pages[0].blocks;
        let myText = "";
        blocks.forEach((block) => {
          block.lines.forEach((line) => {
            line.words.forEach((word) => [(myText += " " + word.text)]);
          });
        });
        // console.log(myText);

        fs.writeFile("text.txt", myText, function (err) {
          if (err) return console.log(err);
          console.log("Hello World > helloworld.txt");
        });
      });
    }

    var req = https.request(options, callback);
    req.setHeader("Content-Type", "application/json");
    req.setHeader(
      "Authorization",
      "Bearer t1.9euelZqQmYudjpTKz5WXl4nMi56NzO3rnpWal5Gclo2cmZuenZqdnZWJiZjl8_d1D3xr-e8RME08_d3z9zU-eWv57xEwTTz9.nhG_62cM_Rvmo0L2MHxQAgoeWFZjhznHseLoCJm00NHRVxUoZesZUzY8SVIb8e9_Pe0CEEIizjklhMZQzDBDAg"
    );
    req.write(JSON.stringify(reqBody));
    req.end();
  })
  .catch((err) => {
    console.log(err);
  });
