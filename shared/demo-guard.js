(function () {
  window.__STATIC_DEMO__ = true;

  var blocked = /feixiangxingqiu\.(com|biz)|login\.feixiang/i;

  function shouldBlock(url) {
    return !!url && blocked.test(String(url));
  }

  var loc = window.location;
  var originalReplace = loc.replace.bind(loc);
  var originalAssign = loc.assign.bind(loc);

  loc.replace = function (url) {
    if (shouldBlock(url)) {
      console.warn('[demo-guard] blocked location.replace:', url);
      return;
    }
    return originalReplace(url);
  };

  loc.assign = function (url) {
    if (shouldBlock(url)) {
      console.warn('[demo-guard] blocked location.assign:', url);
      return;
    }
    return originalAssign(url);
  };

  try {
    var proto = window.Location && window.Location.prototype;
    var desc = proto && Object.getOwnPropertyDescriptor(proto, 'href');
    if (desc && desc.set) {
      var originalSet = desc.set;
      Object.defineProperty(loc, 'href', {
        configurable: true,
        enumerable: true,
        get: desc.get ? desc.get.bind(loc) : function () {
          return loc.toString();
        },
        set: function (url) {
          if (shouldBlock(url)) {
            console.warn('[demo-guard] blocked location.href:', url);
            return;
          }
          originalSet.call(loc, url);
        }
      });
    }
  } catch (error) {
    console.warn('[demo-guard] href guard unavailable', error);
  }
})();
