let imageAddress = "assets/1.jpg"
var image = null;
var kernel = [0, 0, 0,
              0, 1, 0,
              0, 0, 0];

function main() {
    image = new Image();
    image.src = imageAddress;
    image.onload = function () {
        reload(image);
    }
    // var refreshButton = document.getElementById("refresh-kernel");
    // refreshButton.onclick = kernelChanged();
}

function reload(image) {
    if (image === null) {
        console.log("Image is null");
        return;
    }
    let canvas = document.getElementById("Canvas");
    let gl = setupContext(canvas);
    if (!gl) {
        return;
    }
    let program = WebGlUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"])

    gl.useProgram(program);
    var positionLocation = gl.getAttribLocation(program, "a_position");

    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


    var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
    // set the size of the image
    gl.uniform2f(textureSizeLocation, canvas.width, canvas.height);//image.width, image.height);
    var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
    gl.uniform1fv(kernelLocation, kernel);

    setRectangle(gl, 0.0, 0.0, 1.0, 1.0);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    setRectangle(gl, image.x, image.y, image.width, image.height);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setRectangle(gl, x, y, width, height) {
    var x2 = x + width;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, x2, y, x, y2, x, y2, x2, y, x2, y2]), gl.STATIC_DRAW);
}

function setupContext(canvas) {
    // Initialize the GL context
    const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return null;
    }

    return gl;
}

function kernelChanged() {
    console.log("Kernel Changed");
    kernel = [
        document.getElementById("custom-kernel-input1").value, document.getElementById("custom-kernel-input2").value, document.getElementById("custom-kernel-input3").value,
        document.getElementById("custom-kernel-input4").value, document.getElementById("custom-kernel-input5").value, document.getElementById("custom-kernel-input6").value,
        document.getElementById("custom-kernel-input7").value, document.getElementById("custom-kernel-input8").value, document.getElementById("custom-kernel-input9").value
    ];
    reload(image);
}