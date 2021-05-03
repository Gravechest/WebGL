<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title></title>
</head>
<body  onkeyup="keyHandUp(event)" onkeydown="keyHandDown(event)">
    <canvas id="raycaster" width="1000" height="500" onclick="append(event)"></canvas>
</body>
</html>
<script>
    var camPos = [0, 0];
    var zoom = 1.0;
    var vlak = document.getElementById("raycaster");
    vlak.style.borderWidth = "5px";
    vlak.style.borderStyle = "solid";
    gl = vlak.getContext("webgl2");
    var Keys = [0,0,0,0,0,0];
    var verticles = [];
    function keyHandDown(event) {
        switch (event.key) {
            case 'z':
                Keys[0] = 1;
                break;
            case 'x':
                Keys[1] = 1;
                break;
            case 'w':
                Keys[2] = 1;
                break;
            case 'a':
                Keys[3] = 1;
                break;
            case 's':
                Keys[4] = 1;
                break;
            case 'd':
                Keys[5] = 1;
                break;
        }
    }
    function keyHandUp(event) {
        switch (event.key) {
            case 'z':
                Keys[0] = 0;
                break;
            case 'x':
                Keys[1] = 0;
                break;
            case 'w':
                Keys[2] = 0;
                break;
            case 'a':
                Keys[3] = 0;
                break;
            case 's':
                Keys[4] = 0;
                break;
            case 'd':
                Keys[5] = 0;
                break;
        }
    }
    function append(event) {
        var xCoord = ((event.clientX - 13) / 500 - 1.0) / zoom;
        var yCoord = -((event.clientY - 13) / 250 - 1.0) / zoom;

            verticles.push(xCoord, yCoord + 0.1,
                xCoord, yCoord,
                xCoord + 0.1, yCoord,
                xCoord, yCoord + 0.1,
                xCoord + 0.1, yCoord + 0.1,
                xCoord + 0.1, yCoord);
    }
    function createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }
    function shaderAttribute(dimension, name, variable, shaderprogram) {
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(variable), gl.STATIC_DRAW);
        var positionvert = gl.getAttribLocation(shaderprogram, name);
        gl.enableVertexAttribArray(positionvert); 
        gl.vertexAttribPointer(positionvert, dimension, gl.FLOAT, false, 0, 0);
    }
    const fragshader = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }`;
    const vershader = `
        attribute vec4 verticles;
        uniform float zoom;
        uniform float camPos;
        void main() {
            gl_Position = vec4(verticles[0] * zoom + camPos[0],verticles[1] * zoom + camPos[1],verticles[2],verticles[3]);  
        }`;
    var shaderprogram = gl.createProgram();
    var vs = createShader(gl, gl.VERTEX_SHADER, vershader);
    var fs = createShader(gl, gl.FRAGMENT_SHADER, fragshader);
    gl.attachShader(shaderprogram, vs);
    gl.attachShader(shaderprogram, fs);
    gl.linkProgram(shaderprogram);  
    gl.useProgram(shaderprogram);
    window.requestAnimationFrame(opengl)
    function opengl() {
        if (Keys[0] == 1) {
            zoom *= 1.01;
        }
        if (Keys[1] == 1) {
            zoom /= 1.01;
        }
        if (Keys[2] == 1) {
            camPos[0] += 1;
        }
        if (Keys[3] == 1) {
            camPos[1] -= 1;
        }
        if (Keys[4] == 1) {
            camPos[0] -= 1;
        }
        if (Keys[5] == 1) {
            camPos[1] += 1;
        }
        gl.uniform1f(gl.getUniformLocation(shaderprogram, "zoom"), zoom);
        gl.uniform2f(gl.getUniformLocation(shaderprogram, "camPos"), camPos[0],camPos[1]);
        shaderAttribute(2, "verticles", verticles, shaderprogram);
        gl.drawArrays(gl.TRIANGLES, 0, verticles.length * 3.0);
        window.requestAnimationFrame(opengl);
    }
</script>
