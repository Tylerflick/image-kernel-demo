class WebGlUtils {
  /**
   * Creates and compiles a shader.
   *
   * @param {!WebGLRenderingContext} gl The WebGL Context.
   * @param {string} shaderSource The GLSL source code for the shader.
   * @param {number} shaderType The type of shader, VERTEX_SHADER or
   *     FRAGMENT_SHADER.
   * @return {!WebGLShader} The shader.
   */
  static compileShader(gl, shaderSource, shaderType) {
      // Create the shader object
      var shader = gl.createShader(shaderType);

      // Set the shader source code.
      gl.shaderSource(shader, shaderSource);

      // Compile the shader
      gl.compileShader(shader);

      // Check if it compiled
      var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
          // Something went wrong during compilation; get the error
          throw "could not compile shader:" + gl.getShaderInfoLog(shader);
      }

      return shader;
  }


  /**
   * Creates a program from 2 shaders.
   *
   * @param {!WebGLRenderingContext) gl The WebGL context.
   * @param {!WebGLShader} vertexShader A vertex shader.
   * @param {!WebGLShader} fragmentShader A fragment shader.
   * @return {!WebGLProgram} A program.
   */
  static createProgram(gl, vertexShader, fragmentShader) {
      // create a program.
      var program = gl.createProgram();

      // attach the shaders.
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);

      // link the program.
      gl.linkProgram(program);

      // Check if it linked.
      var success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!success) {
          // something went wrong with the link
          throw ("program filed to link:" + gl.getProgramInfoLog(program));
      }

      return program;
  };


  /**
   * Creates a shader from the content of a script tag.
   *
   * @param {!WebGLRenderingContext} gl The WebGL Context.
   * @param {string} scriptId The id of the script tag.
   * @param {string} opt_shaderType. The type of shader to create.
   *     If not passed in will use the type attribute from the
   *     script tag.
   * @return {!WebGLShader} A shader.
   */
  static createShaderFromScript(gl, scriptId, opt_shaderType) {
      // look up the script tag by id.
      var shaderScript = document.getElementById(scriptId);
      if (!shaderScript) {
        throw("*** Error: unknown script element" + scriptId);
      }
    
      // extract the contents of the script tag.
      var shaderSource = shaderScript.text;
    
      // If we didn't pass in a type, use the 'type' from
      // the script tag.
      if (!opt_shaderType) {
        if (shaderScript.type == "x-shader/x-vertex") {
          opt_shaderType = gl.VERTEX_SHADER;
        } else if (shaderScript.type == "x-shader/x-fragment") {
          opt_shaderType = gl.FRAGMENT_SHADER;
        } else if (!opt_shaderType) {
          throw("*** Error: shader type not set");
        }
      }
    
      return WebGlUtils.compileShader(gl, shaderSource, opt_shaderType);
    };


    /**
   * Creates a program from 2 script tags.
   *
   * @param {!WebGLRenderingContext} gl The WebGL Context.
   * @param {string[]} shaderScriptIds Array of ids of the script
   *        tags for the shaders. The first is assumed to be the
   *        vertex shader, the second the fragment shader.
   * @return {!WebGLProgram} A program
   */
  static createProgramFromScripts(
      gl, shaderScriptIds) {
    var vertexShader = WebGlUtils.createShaderFromScript(gl, shaderScriptIds[0], gl.VERTEX_SHADER);
    var fragmentShader = WebGlUtils.createShaderFromScript(gl, shaderScriptIds[1], gl.FRAGMENT_SHADER);
    return WebGlUtils.createProgram(gl, vertexShader, fragmentShader);
  }

  /**
   * Resizes a context for appropriate fix in the canvas.
   *
   * @param {!WebGLRenderingContext} gl The WebGL Context.
   */
  static resize(gl) {
    var realToCSSPixels = window.devicePixelRatio;
  
    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    var displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
    var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);
  
    // Check if the canvas is not the same size.
    if (gl.canvas.width  !== displayWidth ||
        gl.canvas.height !== displayHeight) {
  
      // Make the canvas the same size
      gl.canvas.width  = displayWidth;
      gl.canvas.height = displayHeight;
    }
  }
}