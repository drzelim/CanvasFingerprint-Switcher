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

const getFakeWebglCoordinates = () => {
  const getConvertString = (str, pad) => pad.substring(str.toString().length) + str;

  const fakeNumber1 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber2 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber3 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber4 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber5 = getConvertString(getRandomInt(1, 99), '00');
  const fakeNumber6 = getConvertString(getRandomInt(1, 99), '00');
  return [`0.45${fakeNumber1}`, `0.46${fakeNumber2}`, '0', `0.51${fakeNumber3}`, `0.51${fakeNumber4}`, '0', `0,00${fakeNumber5}`, `0.0${fakeNumber6}`, '0'];
};

const getFakeColor = () => [getRandomInt(85, 95), getRandomInt(10, 20)];

const getWebglSettings = () => {
  return [
    {
      fakeCoordinates: getFakeWebglCoordinates(),
      fakeColor: getFakeColor(),
    },
    {
      fakeCoordinates: getFakeWebglCoordinates(),
      fakeColor: getFakeColor(),
    }
  ];
};

const getSettingsForReadPixelsFunc = () => {
  const settings = {};
  for (let i = 0; i < 10; i++) {
    settings[getRandomInt(0, 250)] = getRandomInt(0, 255);
  }
  return settings;
};

const getRandomWebglSettings = (obj) => {
  const keys = Object.keys(desktopGraphicsProcessors);
  const vendor = keys[getRandomInt(0, keys.length - 1)];
  const renderer = desktopGraphicsProcessors[vendor][getRandomInt(0, desktopGraphicsProcessors[vendor].length - 1)];

  return {
    webgl: {
      vendor,
      renderer,
      settingsForReadPixelsFunc: JSON.stringify(getSettingsForReadPixelsFunc()),
      canvasWebglContextSettings: JSON.stringify(getWebglSettings()),
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
    userSettings = {...getRandomCanvasSettings(), ...getRandomWebglSettings()};
    settingsIsChanged = true;
  } else {
    if (isSettingsExist(userSettings.canvas)) {
      userSettings = {...userSettings, ...getRandomCanvasSettings(userSettings.canvas)};
      settingsIsChanged = true;
    }
    if (isSettingsExist(userSettings.webgl)) {
      userSettings = {...userSettings, ...getRandomWebglSettings(userSettings.webgl)};
      settingsIsChanged = true;
    }
  }

  if (settingsIsChanged) {
    chrome.storage.local.set({'userSettings': userSettings});
  }
  return userSettings;
};
