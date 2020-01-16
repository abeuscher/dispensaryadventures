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

var widgetTemplates = {

};
var ReviewCarousel = require("./page-elements/review-carousel");
var Magnifier = require("./magnifier/");
var SortTable = require("./sort-table/");
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
  "element":".sortable",
  "action":function(els) {
    SortTable(els);
  }
},{
  "element":".zoom-icon",
  "action":function(els) {
    for (i = 0; i < els.length; i++) {
      els[i].addEventListener("click", function(e) {
        e.preventDefault();
        var lens = e.target.parentNode.querySelectorAll(".lens")[0];
        if (lens) {
          if (lens.classList.contains("active")) {
            lens.classList.remove("active");
          }
          else {
            lens.classList.add("active");
          }
          
        }
      })
    }
  }
},{
  "element": ".magnify",
  "action": function (els) {
    for (i = 0; i < els.length; i++) {
      Magnifier(els[i], 2, 400, document.getElementById("review-carousel"));
    }
  }
}, {
  "element": "#review-carousel",
  "action": ReviewCarousel
}, {
  "element": "[data-bg]",
  "action": require("./utils/data-bg")
}, {
  "element": "[data-bg-array]",
  "action": require("./utils/data-bg-array")
}];