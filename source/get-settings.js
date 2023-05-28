self.importScripts('./data.js');

const getRandomInt = (min, max) => (Math.floor(Math.random() * (max - min + 1) + min));
const getRandomText = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters[getRandomInt(0, characters.length - 1)];
  }
  return result;
};

const getRandomCanvasSettings = (obj) => {
  return {
    canvas: {
      text: getRandomText(getRandomInt(6, 20)),
      fontSize: getRandomInt(12, 26),
      angle: getRandomInt(10, 150) / 1000,
      fillStyle: `rgba(${getRandomInt(250, 255)}, ${getRandomInt(250, 255)}, ${getRandomInt(250, 255)}, 0.0${getRandomInt(1, 5)})`,
      x: getRandomInt(3, 15),
      y: getRandomInt(10, 30),
      isCanvasEnable: true,
      ...obj
    }
  };
};

const getVendorAndRenderer = (obj) => {
  const keys = Object.keys(desktopGraphicsProcessors);
  const vendor = keys[getRandomInt(0, keys.length - 1)];
  const renderer = desktopGraphicsProcessors[vendor][getRandomInt(0, desktopGraphicsProcessors[vendor].length - 1)];
  return {
    webgl: {
      vendor,
      renderer,
      isWebglEnable: true,
      ...obj
    }
  };
};

function isSettingsExist(obj) {
  if (!obj) return false;
  return Object.keys(obj).length <= 1;
}

const checkSettings = (userSettings) => {
  let settingsIsChanged = false;
  if (!userSettings) {
    userSettings = {...getRandomCanvasSettings(), ...getVendorAndRenderer()};
    settingsIsChanged = true;
  } else {
    if (isSettingsExist(userSettings.canvas)) {
      userSettings = {...userSettings, ...getRandomCanvasSettings(userSettings.canvas)};
      settingsIsChanged = true;
    }
    if (isSettingsExist(userSettings.webgl)) {
      userSettings = {...userSettings, ...getVendorAndRenderer(userSettings.webgl)};
      settingsIsChanged = true;
    }
  }

  if (settingsIsChanged) {
    chrome.storage.local.set({'userSettings': userSettings});
  }
  return userSettings;
};
