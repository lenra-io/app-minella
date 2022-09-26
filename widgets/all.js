const navigationService = require('../services/navigationService.js');
const userService = require('../services/userService.js');
const widgets = {
  main,
  app: require('./app'),
  ...require("./components/all.js"),
  ...require("./pages/all.js"),
  ...require("./modals/all.js"),
};

module.exports = widgets;


function main() {
  return {
    type: "widget",
    name: "app",
    coll: navigationService.collection,
    query: {
      "user": "@me"
    }
  };
}