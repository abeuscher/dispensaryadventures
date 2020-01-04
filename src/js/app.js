var siteSettings = {
  "imagePath": "",
  "videoPath": "",
  "templates": {},
  "breakpoints": {
    "xs": 0,
    "s": 641,
    "m": 1025,
    "l": 1321,
    "xl": 1921
  }
};
var parseHTML = require("./utils/parse-html.js");

var vidgetTemplates = {
  
};
var ScrollMagic = require("scrollmagic");

window.addEventListener("load", function () {
  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.querySelectorAll(thisAction.element).length > 0) {
      thisAction.action(document.querySelectorAll(thisAction.element), siteSettings.scrollController);
    }
  }
});

var siteActions = [{
  "element": "[data-bg]",
  "action": require("./utils/data-bg")
}, {
  "element": "[data-bg-array]",
  "action": require("./utils/data-bg-array")
}];