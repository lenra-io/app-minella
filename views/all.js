const { View } = require('@lenra/components');
const navigationService = require('../services/navigationService.js');
const views = {
  main,
  app: require('./app'),
  ...require("./components/all.js"),
  ...require("./pages/all.js"),
  ...require("./modals/all.js"),
};

module.exports = views;


function main() {
  return View("app", {
    "user": "@me"
  })
    .data(navigationService.collection,);
}