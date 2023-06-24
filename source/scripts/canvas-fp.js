/* global chrome */

{
  const portal = document.getElementById('portal-kdfjkdnfmvmcvcv');
  portal.remove();

  const userFPSettings = portal.dataset;
  self.userFPSettings = userFPSettings;

  const edit2DImage = (context, settings) => {
    context.fillStyle = settings.fillStyle;
    context.fill();
    context.font = `${settings.fontSize}pt Arial`;
    context.rotate(settings.angle);
    context.fillText(settings.text, +settings.x, +settings.y);
  };

  const getFakeBufferDataArray = (arr) => arr.map(number => parseFloat(number));

  const editWebglImage = (gl, settings) => {
    let {fakeCoordinates, fakeColor} = settings;

    if (!fakeCoordinates || !fakeColor) {
      return;
    }
    const vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
    const fShaderTemplate = `precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,.${fakeColor[0]},.${fakeColor[1]});}`;
    const vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    const vertices = new Float32Array(getFakeBufferDataArray(fakeCoordinates));
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = 3;
    const program = gl.createProgram();
    const vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vShaderTemplate);
    gl.compileShader(vshader);
    const fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fShaderTemplate);
    gl.compileShader(fshader);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);
    program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
    program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
    gl.enableVertexAttribArray(program.vertexPosArray);
    gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
    gl.uniform2f(program.offsetUniform, 1, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
  };

  const editImage = (canvas, userFPSettings) => {
    const context = canvas.getContext('2d');

    if (context) {
      edit2DImage(context, userFPSettings);
      return;
    }

    const gl = canvas.getContext('webgl') ||
               canvas.getContext('webgl2') ||
               canvas.getContext('experimental-webgl');

    if (gl && userFPSettings.isWebglEnable !== 'false') {
      const webglSettings = JSON.parse(userFPSettings.canvasWebglContextSettings);
      webglSettings?.forEach(settings => editWebglImage(gl, settings));
    }
  }

  const toDataURLOriginalFunction = HTMLCanvasElement.prototype.toDataURL;

  const changeCanvasFP = (object) => {
    if (!object) object = self;

    object.HTMLCanvasElement.prototype.toDataURL = function (type) {
      if (userFPSettings.isCanvasEnable === 'false') {
        return toDataURLOriginalFunction.apply(this, arguments);
      }

      if (!type || (type === 'image/png' || type === 'image/jpeg')) {
        editImage(this, userFPSettings);
      }

      return toDataURLOriginalFunction.apply(this, arguments);
    };

    const convertToBlobOriginalFunction = object?.OffscreenCanvas.prototype.convertToBlob;
    object.OffscreenCanvas.prototype.convertToBlob = async function () {
      editImage(this, userFPSettings);
      return convertToBlobOriginalFunction.apply(this, arguments);
    };
  };

  changeCanvasFP(self);
  self.addMutationObserver(document, changeCanvasFP);
}
