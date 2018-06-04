let imageAddress = "assets/1.png"

function main() {
    var image = new Image();
    image.src = imageAddress;
    image.onload = function () {
        if (image === null) {
            console.log("Image is null");
            return;
        }
        let canvas = document.getElementById("Canvas");
        let gl = setupContext(canvas);
        let program = setupShaders(gl);

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
}

function setRectangle(gl, x, y, width, height) {
    var x2 = x + width;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
        [x, y,
            x2, y,
            x, y2,
            x, y2,
            x2, y,
            x2, y2
        ]), gl.STATIC_DRAW);
}

function setupContext(canvas) {
    // Initialize the GL context
    const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // Set clear color to black, fully opaque
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    // gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
}

function setupShaders(gl) {
    const program = WebGlUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
    return program
}