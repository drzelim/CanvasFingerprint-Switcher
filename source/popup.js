const form = document.getElementById('options-form');
const [message, messageClearAll, messageError] = Array.from(document.querySelectorAll('.message'));
const saveButton = form.querySelector('#save');
const resetButton = form.querySelector('#clear');
const canvasSwitcherCheckbox = form.querySelector('#canvas-enable');
const webglSwitcherCheckbox = form.querySelector('#webgl-enable');

(async () => {
  const {userSettings} = await chrome.storage.local.get('userSettings');
  if (!userSettings) return;
  canvasSwitcherCheckbox.checked = !!userSettings.canvas?.isCanvasEnable;
  webglSwitcherCheckbox.checked = !!userSettings.webgl?.isWebglEnable;
})();

const MESSAGE_SHOW_TIME = 7000;
const SwitcherID = {
  CANVAS: 'canvas-enable',
  WEBGL: 'webgl-enable'
};

const showMessage = (element) => {
  element.classList.remove('hidden');
  setTimeout(() => element.classList.add('hidden'), MESSAGE_SHOW_TIME);
};

saveButton.addEventListener('click', async (evt) => {
  evt.preventDefault();

  const settings = {
    canvasChange: document.getElementById('canvas').checked,
    isCanvasEnable: document.getElementById(SwitcherID.CANVAS).checked,
    webglChange: document.getElementById('webgl').checked,
    isWebglEnable: document.getElementById(SwitcherID.WEBGL).checked,
  };

  try {
    const {userSettings} = await chrome.storage.local.get('userSettings');

    if (settings.canvasChange) {
      userSettings.canvas = {};
    }
    if (settings.webglChange) {
      userSettings.webgl = {};
    }

    userSettings.canvas = {...userSettings.canvas, isCanvasEnable: settings.isCanvasEnable};
    userSettings.webgl = {...userSettings.webgl, isWebglEnable: settings.isWebglEnable};

    await chrome.storage.local.set({userSettings});
    showMessage(message);

  } catch (err) {
    messageError?.classList.remove('hidden');
  }

});

resetButton.addEventListener('click', async (evt) => {
  evt.preventDefault();
  const settings = {
    isCanvasEnable: document.getElementById(SwitcherID.CANVAS).checked,
    isWebglEnable: document.getElementById(SwitcherID.WEBGL).checked,
  };
  const userSettings = {
    canvas: {
      isCanvasEnable: settings.isCanvasEnable
    },
    webgl: {
      isWebglEnable: settings.isWebglEnable
    }
  };
  try {
    await chrome.storage.local.set({userSettings});
    showMessage(messageClearAll);
  } catch {
    messageError.classList.remove('hidden');
  }
});
