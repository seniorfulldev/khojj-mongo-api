exports.allAccess = (req, res) => {
  res.status(200).send("To start using the service please read the Documentation and implement our easy to use Leads emails and Crawling emails in your application to get email addresses from various company domains. Don't forget that the first x requests of your account are free of charge. If you have any problems or questions, you can reach us directly through the support page.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
