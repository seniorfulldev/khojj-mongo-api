const request = require("request");
const services = require("./../helpers/Service");
const validate = require("./../services/validate");
const Humanoid = require("humanoid-js");
const cache = require("memory-cache");
const SCRAP_API_URL = process.env.SCRAP_API_URL;
const timeout = process.env.TIMEOUT || 42000;
const perChunc = process.env.PERCHUNC || 50;
const humanoid = new Humanoid((autoBypass = false));
const SCRAP_API_KEY = process.env.SCRAP_API_KEY;
let memCache = new cache.Cache();
const duration = process.env.CACHE_PERIOD || 3600*24*30;
exports.leadsEamil = async (req, res) => {
  try {
    const inputUrl = req.body.domain;
    const hostName = services.parseURL(inputUrl).rootdomain;

    request(
      `${SCRAP_API_URL}leads?token=${SCRAP_API_KEY}&domain=${hostName}`,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.status(200).send(body);
        } else {
          console.log(
            "There was a problem connecting to the url requested",
            error
          );
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.crawlEamil = async (req, res) => {
  try {
    const inputUrl = req.body.domain;
    let urlList = [];
    // const hostName = services.parseURL(inputUrl).rootdomain;
    let key = "__urlList__" + inputUrl;
    let cacheContent = memCache.get(key);
    if (cacheContent) {
      urlList = cacheContent;
      const result = await getEmailList(urlList);
      res.status(200).send(result);
    } else {
      request(
        `${SCRAP_API_URL}scraper?token=${SCRAP_API_KEY}&url=${inputUrl}`,
        async function (error, response, body) {
          if (!error && response.statusCode == 200) {
            urlList = JSON.parse(body).body.links;
            memCache.put(key, urlList, duration * 1000);
          }
          const result = await getEmailList(urlList);
          res.status(200).send(result);
        }
      );
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getEmailList = (urlList) => {
  return new Promise((resolve, reject) => {
    const actions = urlList.map(getEmailFn);
    let results = Promise.all(actions);
    results.then((data) => {
      // validate.emailvalidate(data);
      const result = filterEmails(data);
      resolve(result);
    });
  });
};

const getEmailFn = function asyncMultiplyBy2(url) {
  return new Promise((resolve, reject) => {
    let key = "__get_email__" + url;
    let emails = memCache.get(key);
    if (emails) {
      resolve({ email: emails, url: url });
    }
    setTimeout(function () {
      console.log("timeout", url);
      resolve({});
    }, timeout);
    humanoid
      .sendRequest(url)
      .then((res) => {
        let emails = res.body.match(
          /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
        );
        const protectedEmails = res.body.match(
          /(email-protection#+[a-zA-Z0-9]+)/g
        );
        if (protectedEmails) {
          const decodeEmails = services.detectEmail(protectedEmails);
          emails = emails ? emails.concat(decodeEmails) : decodeEmails;
        }
        if (emails) {
          memCache.put(key, emails, duration * 1000);
          resolve({ email: emails, url: url });
        } else {
          resolve({});
        }
      })
      .catch((error) => {
        console.log("error6", error);
        resolve({});
      });
  });
};

const filterEmails = (list) => {
  let mailArray = [];
  try {
    list.forEach((emailElements) => {
      const emails = [...new Set(emailElements.email)];
      emails.map((e) => {
        let validversion = e.match(/(@[0-9]+\.[0-9.]+)/g);
        if (
          !validversion &&
          !e.includes("x") &&
          !e.includes(".png") &&
          !e.includes(".jpg")
        ) {
          const email =
            e.substr(-1) === "."
              ? e.substr(0, e.length - 1).toLocaleLowerCase()
              : e.toLocaleLowerCase();
          const url =
            emailElements.url.includes("#") > 0
              ? emailElements.url.substr(0, emailElements.url.indexOf("#"))
              : emailElements.url;
          mailArray.push({ email: email, url: url });
        }
      });
    });
  } catch (error) {
    console.error("error7", error);
  }
  return mailArray;
};
