/* global chrome */

{
  const portal = document.getElementById('portal-kdfjkdnfmvmcvcv');
  portal.remove();

  const userFPSettings = portal.dataset;
  self.userFPSettings = userFPSettings;

  const editImage = (context, settings) => {
    if (!context) return context;
    context.fillStyle = settings.fillStyle;
    context.fill();
    context.font = `${settings.fontSize}pt Arial`;
    context.rotate(settings.angle);
    context.fillText(settings.text, +settings.x, +settings.y);
  };

  const changeCanvasFP = (object) => {
    if (!object) object = self;

    const toDataURLOriginalFunction = object?.HTMLCanvasElement.prototype.toDataURL;
    if (!toDataURLOriginalFunction) return;

    object.HTMLCanvasElement.prototype.toDataURL = function (type) {
      if (userFPSettings.isCanvasEnable === 'false') {
        return toDataURLOriginalFunction.apply(this, arguments);
      }
      if (!type || (type === 'image/png' || type === 'image/jpeg')) {
        const context = this.getContext('2d');
        editImage(context, userFPSettings);
      }

      return toDataURLOriginalFunction.apply(this, arguments);
    };

    const convertToBlobOriginalFunction = object?.OffscreenCanvas.prototype.convertToBlob;
    object.OffscreenCanvas.prototype.convertToBlob = async function () {
      const context = this.getContext('2d');
      editImage(context, userFPSettings);
      return convertToBlobOriginalFunction.apply(this, arguments);
    };
  };

  changeCanvasFP(self);
  self.addMutationObserver(document, changeCanvasFP);
}
