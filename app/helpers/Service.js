exports.parseURL = (url) => {
  parsed_url = {};

  if (url == null || url.length == 0) return parsed_url;

  protocol_i = url.indexOf("://");
  parsed_url.protocol = url.substr(0, protocol_i);
  remaining_url = protocol_i < 0 ? url : url.substr(protocol_i + 3, url.length);
  domain_i = remaining_url.indexOf("/");
  domain_i = domain_i == -1 ? remaining_url.length : domain_i;
  domain = remaining_url.substr(0, domain_i);
  parsed_url.domain = domain;
  parsed_url.rootdomain = domain.includes("www.")
    ? domain.replace("www.", "")
    : domain;
  parsed_url.path =
    domain_i == -1 || domain_i + 1 == remaining_url.length
      ? null
      : remaining_url.substr(domain_i + 1, remaining_url.length);

  domain_parts = parsed_url.domain.split(".");
  switch (domain_parts.length) {
    case 2:
      parsed_url.subdomain = null;
      parsed_url.host = domain_parts[0];
      parsed_url.tld = domain_parts[1];
      break;
    case 3:
      parsed_url.subdomain = domain_parts[0];
      parsed_url.host = domain_parts[1];
      parsed_url.tld = domain_parts[2];
      break;
    case 4:
      parsed_url.subdomain = domain_parts[0];
      parsed_url.host = domain_parts[1];
      parsed_url.tld = domain_parts[2] + "." + domain_parts[3];
      break;
  }

  parsed_url.parent_domain = parsed_url.host + "." + parsed_url.tld;

  return parsed_url;
};

exports.detectEmail = (emailList) => {
  let encodedList = [];
  emailList.forEach((element) => {
    let encodedString = element.split("#")[1];
    const email = cfDecodeEmail(encodedString);
    encodedList.push(email);
  });
  return encodedList;
};

exports.wait = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

exports.arrayChunc = (inputArray, perChunk) => {
  const result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  return result;
};

function cfDecodeEmail(encodedString) {
  var email = "",
    r = parseInt(encodedString.substr(0, 2), 16),
    n,
    i;
  for (n = 2; encodedString.length - n; n += 2) {
    i = parseInt(encodedString.substr(n, 2), 16) ^ r;
    email += String.fromCharCode(i);
  }
  return email;
}
