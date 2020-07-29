/**
 * Houses.js
 * Author: Ahmet Furkan Biyik
 * Date: 21.10.2019
 */

/**
 * Generates houses with house coordinates
 */
function generateHouses() {

    // Add Houses
    for (var i = 0; i < variables.generated.houseCoordinates.length; i++)
    {
        addHouse1(variables.generated.houseCoordinates[i], Math.random()*Math.PI*2);
    }
}

/**
 * Add an house to arrays
 * @param worldPosition vec2 position values between -1 and 1
 * @param vertexRotation float angle between 0 and 2PI
 */
function addHouse1(worldPosition, vertexRotation) {

    houseVertexPositions.push(
        // Up
        vec2( -0.08,  0.05 ),
        vec2(  0.08,  0.05 ),
        vec2( -0.08, 0 ),
        vec2(  0.08, 0 ),
        // Down
        vec2( -0.08,  0 ),
        vec2(  0.08,  0 ),
        vec2( -0.08, -0.05 ),
        vec2(  0.08, -0.05 ),
        // Chimney
        vec2(  0.06,  0.0125 ),
        vec2(  0.035,  0.0125 ),
        vec2(  0.06, -0.0125 ),
        vec2(  0.035, -0.0125 )
    );

    houseVertexColors.push(
        // Up
        vec3(0.6431, 0.2901, 0.2901),
        vec3(0.6431, 0.2901, 0.2901),
        vec3(0.6431, 0.2901, 0.2901),
        vec3(0.6431, 0.2901, 0.2901),
        // Down
        vec3(0.4117, 0.1843, 0.1843),
        vec3(0.4117, 0.1843, 0.1843),
        vec3(0.4117, 0.1843, 0.1843),
        vec3(0.4117, 0.1843, 0.1843),
        // Chimney
        vec3(0.1686, 0.0745, 0.0745),
        vec3(0.1686, 0.0745, 0.0745),
        vec3(0.1686, 0.0745, 0.0745),
        vec3(0.1686, 0.0745, 0.0745)
    );

    for (var i = 0; i < 12; i++)
    {
        houseWorldPositions.push(worldPosition);
        houseVertexRotations.push(vertexRotation)
    }

    variables.generated.houseRotations.push(vertexRotation);

    numberOfRectangles += 3;

    addDebugCircle(worldPosition);
}

/**
 * Add an house to arrays
 * @param worldPosition vec2 position values between -1 and 1
 * @param vertexRotation float angle between 0 and 2PI
 */
function addHouse2(worldPosition, vertexRotation) {

    houseVertexPositions.push(
        // Up
        vec2( -0.08,  0.05 ),
        vec2(  0.08,  0.05 ),
        vec2( -0.08, 0 ),
        vec2(  0.08, 0 ),
        // Down
        vec2( -0.08,  0 ),
        vec2(  0.08,  0 ),
        vec2( -0.08, -0.05 ),
        vec2(  0.08, -0.05 ),
        // Chimney
        vec2(  0.06,  0.0125 ),
        vec2(  0.035,  0.0125 ),
        vec2(  0.06, -0.0125 ),
        vec2(  0.035, -0.0125 )
    );

    houseVertexColors.push(
        // Up
        vec3(0.6431, 0.2901, 0.2901),
        vec3(0.6431, 0.2901, 0.2901),
        vec3(0.6431, 0.2901, 0.2901),
        vec3(0.6431, 0.2901, 0.2901),
        // Down
        vec3(0.4117, 0.1843, 0.1843),
        vec3(0.4117, 0.1843, 0.1843),
        vec3(0.4117, 0.1843, 0.1843),
        vec3(0.4117, 0.1843, 0.1843),
        // Chimney
        vec3(0.1686, 0.0745, 0.0745),
        vec3(0.1686, 0.0745, 0.0745),
        vec3(0.1686, 0.0745, 0.0745),
        vec3(0.1686, 0.0745, 0.0745)
    );

    for (var i = 0; i < 12; i++)
    {
        houseWorldPositions.push(worldPosition);
        houseVertexRotations.push(vertexRotation)
    }

    numberOfRectangles += 3;

    addDebugCircle(worldPosition);
}

/**
 * Draw houses with values in arrays.
 */
function drawHouses() {

    // No house
    if (numberOfRectangles === 0){
        return;
    }

    // Bind Buffers
    {
        // Init shaders
        var program = initShaders( gl, "v_house", "f_default" );
        gl.useProgram( program );

        // Init scale
        var vertexScale = gl.getUniformLocation( program, "vertexScale" );
        gl.uniform1f( vertexScale, variables.userDefined.scale );

        // Set vertex position buffer
        var vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(houseVertexPositions), gl.STATIC_DRAW );

        var vertexPosition = gl.getAttribLocation( program, "vertexPosition" );
        gl.vertexAttribPointer( vertexPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexPosition );

        // Set world position buffer
        var worldPositionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, worldPositionBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(houseWorldPositions), gl.STATIC_DRAW );

        var worldPosition = gl.getAttribLocation( program, "worldPosition" );
        gl.vertexAttribPointer( worldPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( worldPosition );

        // Set color buffer
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(houseVertexColors), gl.STATIC_DRAW );

        var vertexColor = gl.getAttribLocation( program, "vertexColor" );
        gl.vertexAttribPointer( vertexColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexColor );

        // Set rotation buffer
        var rotationBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, rotationBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(houseVertexRotations), gl.STATIC_DRAW );

        var vertexRotation = gl.getAttribLocation( program, "vertexRotation" );
        gl.vertexAttribPointer( vertexRotation, 1, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexRotation );
    }

    // Draw rectangles
    for (var i = 0; i < numberOfRectangles; i++){
        gl.drawArrays( gl.TRIANGLE_STRIP, i*4, 4 );
    }
}