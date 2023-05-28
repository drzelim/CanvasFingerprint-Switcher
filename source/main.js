/* global chrome, portal */
self.importScripts('./get-settings.js');

const settingsAdapter = (settings) => {
  const result = {};
  const moveToTopLevel = (obj) => {
    for (let prop in obj) {
      if (typeof obj[prop] === 'object') {
        moveToTopLevel(obj[prop]);
      } else {
        Object.assign(result, {[prop]: obj[prop]});
      }
    }
  };
  moveToTopLevel(settings);
  return result;
};

const getFPSettings = async () => {
  let {userSettings} = await chrome.storage.local.get('userSettings');

  userSettings = checkSettings(userSettings);
  return settingsAdapter(userSettings);
};

const changeFingerprint = async () => {
  const commonSettings = {
    'allFrames': true,
    'runAt': 'document_start',
    'matchOriginAsFallback': true,
    'matches': ['*://*/*']
  };

  await chrome.scripting.unregisterContentScripts();

  await chrome.scripting.registerContentScripts([
    {
      ...commonSettings,
      'id': '1-inject',
      'js': ['/scripts/inject.js'],
      'world': 'ISOLATED',
    },
    {
      ...commonSettings,
      'id': '2-changeCanvasFP',
      'js': ['/scripts/utils.js'],
      'world': 'MAIN',
    },
    {
      ...commonSettings,
      'id': '3-changeCanvasFP',
      'js': ['/scripts/canvas-fp.js'],
      'world': 'MAIN',
    },
    {
      ...commonSettings,
      'id': '4-webglFP',
      'js': ['/scripts/webgl-fp.js'],
      'world': 'MAIN',
    }]);
};

const executeScriptHandler = async (doc) => {
  const blackListURLS = ['chrome://', 'chrome-untrusted://', 'chrome-extension://', 'about:blank', 'devtools://'];
  const notExecute = blackListURLS.some(item => doc.url.includes(item));
  if (notExecute) return;

  const userSettings = await getFPSettings();

  chrome.scripting.executeScript({
    target: {
      tabId: doc.tabId,
      frameIds: [doc.frameId]
    },
    injectImmediately: true,
    func: (userSettings) => {
      if (typeof portal === 'undefined') {
        self.fpSettings = userSettings;
      } else {
        Object.assign(portal.dataset, userSettings);
      }
    },
    args: [userSettings]
  });
};

chrome.webNavigation.onCommitted.addListener(executeScriptHandler);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getSettings') {
    chrome.storage.local.get('userSettings', function (result) {
      sendResponse({userSettings: result.userSettings});
    });
    return true;
  }
});
