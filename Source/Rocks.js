/**
 * Rocks.js
 * Author: Ahmet Furkan Biyik
 * Date: 21.10.2019
 */

/**
 * Generates rocks with rock coordinates
 */
function generateRocks() {

    // Add Rocks
    for (var i = 0; i < variables.generated.rockCoordinates.length; i++)
    {
        addRock1(variables.generated.rockCoordinates[i]);
    }
}

/**
 * Add a rock to arrays
 * @param center vec2 position values between -1 and 1
 */
function addRock1(center) {
    var radius = 0.07;
    var color = color3(150, 159, 178	);
    var randomAngles = [];
    var corners = Math.floor(Math.random()*3 + 5 ); // number of corners between 5 and + 8

    // half up
    for (var i = 0; i < corners/2; i++) {
        randomAngles.push(Math.random() * Math.PI);
    }

    // half down
    for (var i = corners/2; i < corners; i++) {
        randomAngles.push(Math.random() * Math.PI + Math.PI);
    }

    // to make convex
    randomAngles.sort();

    for (var i = 0; i < corners; i++){
        variables.generated.rockVertexAngles.push( randomAngles[i] );
        rockVertexColors.push( color );
        rockVertexCenters.push( center);
        rockVertexRadiuses.push( radius );
    }

    numberOfRocks++;
    variables.generated.numberOfCorners.push(corners);

    addDebugCircle(center);
}

/**
 * Add a rock to arrays
 * @param center vec2 position values between -1 and 1
 * @param cornerCount number of corners
 */
function addRock2(center, cornerCount) {
    var radius = 0.07;
    var color = color3(150, 159, 178	);

    for (var i = 0; i < cornerCount; i++){
        rockVertexColors.push( color );
        rockVertexCenters.push( center);
        rockVertexRadiuses.push( radius );
    }

    numberOfRocks++;

    addDebugCircle(center);
}

/**
 * Draw rocks with values in arrays.
 */
function drawRocks() {

    // No rock
    if (numberOfRocks === 0){
        return;
    }

    // Bind Buffers
    {
        // Init shaders
        var program = initShaders( gl, "v_circle", "f_default" );
        gl.useProgram( program );

        // Init scale
        var vertexScale = gl.getUniformLocation( program, "vertexScale" );
        gl.uniform1f( vertexScale, variables.userDefined.scale );

        // Set vertex angle buffer
        var vertexAngleBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertexAngleBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(variables.generated.rockVertexAngles), gl.STATIC_DRAW );

        var vertexAngle = gl.getAttribLocation( program, "vertexAngle" );
        gl.vertexAttribPointer( vertexAngle, 1, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexAngle );

        // Set center buffer
        var centerBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, centerBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(rockVertexCenters), gl.STATIC_DRAW );

        var vertexCenter = gl.getAttribLocation( program, "vertexCenter" );
        gl.vertexAttribPointer( vertexCenter, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexCenter );

        // Set radius
        var radiusBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, radiusBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(rockVertexRadiuses), gl.STATIC_DRAW );

        var vertexRadius = gl.getAttribLocation( program, "vertexRadius" );
        gl.vertexAttribPointer( vertexRadius, 1, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexRadius );

        // Set color buffer
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(rockVertexColors), gl.STATIC_DRAW );

        var vertexColor = gl.getAttribLocation( program, "vertexColor" );
        gl.vertexAttribPointer( vertexColor, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertexColor );
    }

    // Draw rocks
    var index = 0;

    for (var i = 0; i < numberOfRocks; i++){
        gl.drawArrays( gl.TRIANGLE_FAN, index, variables.generated.numberOfCorners[i] );
        index += variables.generated.numberOfCorners[i];
    }
}