// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
/**
 * Created by 83617 on 2020/7/21.
 */
var hashMap = JSON.parse(localStorage.getItem("ravenMap")) || [];
var collection = $(".collection");
var add = $("#add");
var search = $(".search-icon");
var searchInput = $("#search-input");
var backdrop = $(".backdrop");
var item = collection.find(".item-container:not(#add)");
render();
add.on("click", function (e) {
  e.stopPropagation();
  var url = window.prompt("网址？");

  if (url) {
    hashMap.push(handleUrl(url));
    setStorage();
    render();
  }
}); // 事件代理collection

collection.on("click", function (e) {
  // console.dir(e.target)
  var el = e.target;
  if (el === e.currentTarget) return;

  while (el && el.dataset && el.dataset.idx === undefined) {
    if (el === e.currentTarget) {
      el = null;
      break;
    }

    el = el.parentNode;
  }

  var idx = el.dataset.idx;
  idx && openUrl(hashMap[idx].url);
});
$(".more").on("click", function (e) {
  e.stopPropagation();
  var el = e.target;

  while (el && el.dataset && el.dataset.idx === undefined) {
    el = el.parentNode;
  }

  var idx = el.dataset.idx;
  backdrop.removeClass("dis-none");
  handleDialog(idx);
});
search.on("click", function (e) {
  var searchVal = searchInput.val();
  searchVal.length && $(location).attr("href", "https://cn.bing.com/search?q=".concat(searchVal));
});

function handleUrl(url) {
  var userEnter = url;

  if (!url.match(/^(http:\/\/)|(https:\/\/)/)) {
    url = "https://" + url;
  }

  var domain = url.match(/(?<=(\/\/))[\.\w]*/)[0];
  console.log("输入域名:" + domain);
  return {
    url: url,
    userEnter: userEnter,
    domain: domain
  };
}

function render() {
  var html = "";
  hashMap.map(function (item, idx) {
    html += "\n    <div class=\"item-container\" data-idx=\"".concat(idx, "\">\n      <div class=\"inner\">\n        <div class=\"mini-logo\">").concat(item.domain[0].toUpperCase(), "</div>\n        <div class=\"title\">\n          <span>").concat(item.domain, "</span>\n        </div>\n      </div>\n      <div class=\"more\" data-idx=\"").concat(idx, "\">\n        <svg class=\"icon\" aria-hidden=\"true\">\n          <use xlink:href=\"#icon-more\"></use>\n        </svg>\n      </div>\n    </div>\n    ");
  });
  item.remove();
  $(html).insertBefore(add);
  item = collection.find(".item-container:not(#add)");
}

function handleDialog(idx) {
  var inputSite = $("#inputSite");
  var finish = $(".finish");
  var deleteBtn = $(".delete");
  var hashItem = hashMap[idx];
  inputSite.val(hashItem.url);
  !inputSite.val().length && finish.attr("disabled", "disabled"); // cancel

  $(".cancel").on("click", function () {
    backdrop.addClass("dis-none");
  });
  inputSite.on("input", function (e) {
    inputSite.val().length ? finish.removeAttr("disabled") : finish.attr("disabled", "disabled");
  }); // finish

  finish.on("click", function () {
    hashMap[idx] = handleUrl(inputSite.val());
    backdrop.addClass("dis-none");
    setStorage();
    render();
  });
  deleteBtn.on("click", function () {
    hashMap.splice(idx, 1);
    backdrop.addClass("dis-none");
    setStorage();
    render();
  });
}

function openUrl(url) {
  $(location).attr("href", url);
}

function setStorage() {
  localStorage.setItem("ravenMap", JSON.stringify(hashMap));
}

;

(function () {
  var timer;
  item.on("touchstart", function (e) {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      backdrop.removeClass("dis-none");
      var el = e.target;

      while (el && el.dataset && el.dataset.idx === undefined) {
        el = el.parentNode;
      }

      var idx = el.dataset.idx;
      handleDialog(idx);
    }, 500);
  });
  item.on("touchmove", function () {
    clearTimeout(timer);
  });
  item.on("touchend", function () {
    clearTimeout(timer);
  });
})();
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.3a90d0b0.js.map