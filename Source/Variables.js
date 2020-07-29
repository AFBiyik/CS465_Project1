/**
 * Variables.js
 * Author: Ahmet Furkan Biyik
 * Date: 21.10.2019
 */

var diskRadius = 0.1; // Unscaled disk radius
var attractorIndex = 0; // 0 House 1 Tree 2 Rock
var coordinates = [];
var numberOfSegments = 64; // circle segments
var generated = false;
var angles = // vertex angles
    (function () {
        var tmp = [];
        var angle = Math.PI * 2 / numberOfSegments;

        for (var i = 0; i < numberOfSegments; i++) {
            tmp.push(angle * i);
        }

        return tmp;
    })();

// Houses
var houseVertexPositions = [];
var houseWorldPositions = [];
var houseVertexColors = [];
var houseVertexRotations = [];
var numberOfRectangles = 0;

// Trees
var treeVertexAngles = [];
var treeVertexRadiuses = [];
var treeVertexColors = [];
var treeVertexCenters = [];
var numberOfCircles = 0;
var treeIndex = 0;

// Rocks
var rockVertexColors = [];
var rockVertexCenters = [];
var rockVertexRadiuses = [];
var numberOfRocks = 0;

// Debug Circles
var debugCircleVertexAngles = [];
var debugCircleVertexColors = [];
var debugCircleVertexCenters = [];
var debugCircleVertexRadiuses = [];
var numberOfDebugCircles = 0;

var variables = {
    userDefined: {
        scale: 1,
        riverMin: 0.01,
        riverMax: 1.2,
        riverWidth: 0,
        debug: false,
        numberOfEntities: 20,
        houseAttractor: null,
        treeAttractor: null,
        rockAttractor: null
    },
    generated:{
        // Houses
        houseRotations: [],
        houseCoordinates : [],

        // Trees
        apples: [],
        treeCoordinates: [],

        // Rocks
        numberOfCorners: [],
        rockVertexAngles: [],
        rockCoordinates: [],
    }
};