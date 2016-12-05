/* global define, require*/

define( [],
    function (){

		var Utils = {

            //////////////////////////// NUMBER UTILS /////////////////////////////////////////////
            randomIntInRange: function (_minimum, _maximum, _roundToInterval)
            {
                if(_roundToInterval === undefined) {
                    _roundToInterval =1;
                }

                // If the minimum is greater than the maximum: swap them.
                if (_minimum > _maximum)
                {
                    var nTemp = _minimum;
                    _minimum = _maximum;
                    _maximum = nTemp;
                }
                // Calculate the range by subtracting the minimum from the maximum. Add
                // 1 times the round to interval to ensure even distribution.
                var nDeltaRange = (_maximum - _minimum) + (1 * _roundToInterval);

                // Multiply the range by Math.random(). This generates a random number
                // basically in the range, but it won't be offset properly, nor will it
                // necessarily be rounded to the correct number of places yet.
                var nRandomNumber = Math.random () * nDeltaRange;

                // Add the minimum to the random offset to generate a random number in the correct range.
                nRandomNumber += _minimum;

                return this.floor(nRandomNumber, _roundToInterval)
            },

            divideAndFloor: function(_number, _roundToInterval)
            {
                // Return the result
                return Math.floor (_number / _roundToInterval) * _roundToInterval;
            },

            randomNumberInRange: function(min, max)
            {
                return min + Math.random() * (max - min);
            },

            // whether a specified value is close to a specific target value
            // Usage: isInRange(myVal, 150, 0.1) // is myVal within +0.1 or -0.1 of 150
            isInRange: function(value, target, range){
                if(value < (target + range) && value > (target - range))
                {
                    return true;
                }else{
                    return false;
                }
            },

            /* if we have the value of T = 8.809015 we can normalise it to obtain a ratio between 0 & 1;

             normalize([val], [startRange], [endRange])
             normalize(8.809015, 1.61803, 16) = 0.5


             if we have the normalised value of T = 0.5 we can interpolate it to obtain a value

             lerp([normalisedValue], [startRange], [endRange])
             lerp(0.5, 1.61803, 16) = 8.809015
             */

            normalize: function ( value, a, b )
            {

                var min = ( a < b ) ? a : b;
                var max = ( a > b ) ? a : b;
                return (value - min) / (max - min);

            },

            lerp: function lerp( t, a, b )
            {

                var min = ( a < b ) ? a : b;
                var max = ( a > b ) ? a : b;
                return min + ( max - min ) * t;

            },

            // convert degrees to radians
            radians: function(d){
                return d * Math.PI / 180;
            },

            // convert degrees to radians
            degrees: function(r){
                return r * 180 / Math.PI;
            },

            ////////////////////////////// COLOUR UTILS ///////////////////////////////////////////////

            randomColor: function(){
                // random values between 0 and 255, these are the 3 colour values
                var r = Math.floor(Math.random()*256);
                var g = Math.floor(Math.random()*256);
                var b = Math.floor(Math.random()*256);
                return this.getHex(r, g, b);
            },

            // intToHex()
            intToHex: function(n){
                n = n.toString(16);
                // eg: #0099ff. without this check, it would output #099ff
                if( n.length < 2)
                    n = "0"+n;
                return n;
            },

            // getHex()
            // shorter code for outputing the whole hex value
            getHex: function(r, g, b){
                return '#'+this.intToHex(r)+this.intToHex(g)+this.intToHex(b);
            },

            // param: string e.g. 'ffffff'
            hexToInt:function(hex){
                return parseInt(hex, 16);
            },

            // takes array of hsv values e.g. [0, 100, 100] (red)
            hsvToRGB: function( hsv ) {

                var r, g, b;
                var i;
                var f, p, q, t;

                // Make sure our arguments stay in-range
                h = Math.max(0, Math.min(360, hsv[0] ));
                s = Math.max(0, Math.min(100, hsv[1] ));
                v = Math.max(0, Math.min(100, hsv[2] ));

                // We accept saturation and value arguments from 0 to 100 because that's
                // how Photoshop represents those values. Internally, however, the
                // saturation and value are calculated from a range of 0 to 1. We make
                // That conversion here.
                s /= 100;
                v /= 100;

                if ( s == 0 ) {
                    // Achromatic (grey)
                    r = g = b = v;
                    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
                }

                h /= 60; // sector 0 to 5
                i = Math.floor(h);
                f = h - i; // factorial part of h
                p = v * (1 - s);
                q = v * (1 - s * f);
                t = v * (1 - s * (1 - f));

                switch(i) {

                    case 0:
                        r = v;
                        g = t;
                        b = p;
                        break;

                    case 1:
                        r = q;
                        g = v;
                        b = p;
                        break;

                    case 2:
                        r = p;
                        g = v;
                        b = t;
                        break;

                    case 3:
                        r = p;
                        g = q;
                        b = v;
                        break;

                    case 4:
                        r = t;
                        g = p;
                        b = v;
                        break;

                    default: // case 5:
                        r = v;
                        g = p;
                        b = q;
                }

                return [ Math.round( r * 255 ), Math.round( g * 255 ), Math.round( b * 255 ) ];
            },

            rgbToHSV:function (rgb) {
                var rr, gg, bb,
                    r = rgb[0] / 255,
                    g = rgb[1] / 255,
                    b = rgb[2] / 255,
                    h, s,
                    v = Math.max(r, g, b),
                    diff = v - Math.min(r, g, b),
                    diffc = function(c){
                        return (v - c) / 6 / diff + 1 / 2;
                    };

                if (diff == 0) {
                    h = s = 0;
                } else {
                    s = diff / v;
                    rr = diffc(r);
                    gg = diffc(g);
                    bb = diffc(b);

                    if (r === v) {
                        h = bb - gg;
                    }else if (g === v) {
                        h = (1 / 3) + rr - bb;
                    }else if (b === v) {
                        h = (2 / 3) + gg - rr;
                    }
                    if (h < 0) {
                        h += 1;
                    }else if (h > 1) {
                        h -= 1;
                    }
                }

                return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
            },

            rgbToHEX: function( rgb ) {

                function nth( n ) {
                    var h = n.toString( 16 );
                    return ( h.length == 1 ) ? '0' + h : h;
                }

                return [ '#', nth( rgb[ 0 ] ), nth( rgb[ 1 ] ), nth( rgb[ 2 ] ) ].join('');

            },

            hexToRgb:function(hex) {
                // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

                return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
            },

            hsvToHEX: function( hsv ) {

                var rgb = this.hsvToRGB( hsv );
                function nth( n ) {
                    var h = n.toString( 16 );
                    return ( h.length == 1 ) ? '0' + h : h;
                }

                return [ '#', nth( rgb[ 0 ] ), nth( rgb[ 1 ] ), nth( rgb[ 2 ] ) ].join('');

            },

            hexToHSV:function(hex){
                var rgb = this.hexToRgb(hex);
                var hsv = this.rgbToHSV(rgb);
                return hsv;
            },

            ////////////////////////////// EASING UTILS ///////////////////////////////////////////////

            //current time; start value; change in value; duration
            easeInOutCubic : function  (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            },

            ////////////////////////////// OBJECT UTILS ///////////////////////////////////////////////

            // deep clones an object/array
            // from: http://www.overset.com/2007/07/11/javascript-recursive-object-copy-deep-object-copy-pass-by-value/
            deepObjCopy: function(dupeObj) {

                var retObj = new Object();

                if (typeof(dupeObj) == 'object') {

                    if (typeof(dupeObj.length) != 'undefined'){

                        var retObj = new Array();
                    }

                    for (var objInd in dupeObj) {

                        if (typeof(dupeObj[objInd]) == 'object') {

                            retObj[objInd] = deepObjCopy(dupeObj[objInd]);

                        } else if (typeof(dupeObj[objInd]) == 'string') {

                            retObj[objInd] = dupeObj[objInd];

                        } else if (typeof(dupeObj[objInd]) == 'number') {

                            retObj[objInd] = dupeObj[objInd];

                        } else if (typeof(dupeObj[objInd]) == 'boolean') {

                            ((dupeObj[objInd] == true) ? retObj[objInd] = true : retObj[objInd] = false);
                        }
                    }
                }
                return retObj;
            },

            //re. http://newcodeandroll.blogspot.nl/2012/01/how-to-find-duplicates-in-array-in.html
            inspectArrayForDuplicates: function(pArray){

                var length = pArray.length;

                //The array arrayWithUniqueValues will contain only one value for each entry of array
                var arrayWithUniqueValues = [];

                // objectCounter will store the distinct values of array as key and
                // the number of times they are present in array as values
                var objectCounter = {};

                for (i = 0; i < length; i++) {

                    // First stringify the current member of the Array, this will be the key
                    // used to check if the value is already present
                    var currentMemboerOfArrayKey = JSON.stringify(array[i]);

                    //This is the value stored only once in arrayWithUniqueValues
                    var currentMemberOfArrayValue = pArray[i];

                    if (objectCounter[currentMemberOfArrayKey] === undefined){

                        // If the property is undefined, this is the first time we have this value
                        // in the array, so add it to arrayWithUniqueValues
                        arrayWithUniqueValues.push(currentMemberOfArrayValue);

                        // Set the current value of the object to one: this is both for counting
                        // reasons and for avoiding duplicates because  the next time
                        // objectCounter[currentMemberOfArrayKey] === undefined will be false and
                        // the value will not be added to arrayWithUniqueValues
                        objectCounter[currentMemberOfArrayKey] = 1;

                    }else{

                        //The key was already present, augment the counter/value by one
                        objectCounter[currentMemberOfArrayKey]++;
                    }
                }

                console.log('objectCounter=',objectCounter);
                console.log('arrayWithUniqueValues=',arrayWithUniqueValues);
            },

            fileSizeToLength : function (pFileSize, pBitRate){

                var bitRate = pBitRate || 192;// we need to know bit rate

                // Find bitRate from command line:
                //$ afinfo /Users/{userName}/Music/Chowchill.mp3 | grep "bit rate"

                var mBytes = pFileSize / 1000000;

                //        re. http://www.wjunction.com/202-general-discussion-archive/80348-calculate-mp3-time-length-bitrate-file-size.html
                var kBytes = mBytes * 1024;
                var kBits = kBytes * 8;
                var secs = kBits / bitRate

                return secs;

                // pFileSize / 1000000 * 1024 * 8 / bitRate
            },

            // Loop over an array of values, first grouping the values into bins.
            // Then find the average value for each bin
            loopOverBins : function(pNumValues, pBinSize, pData, pCallback, pScope){

                var step = Math.floor(pNumValues / pBinSize);

                // comments based on: pBinSize = 25 & pNumValues = 512, so step = 20

                for (var i = 0; i < pBinSize; i ++){

                    var binStart = i * step;// 0,20...480

                    var binEnd = (i + 1) * step;// 20,40...500

                    var total = 0;

                    // Collect average value for the bin
                    for(var j = binStart; j < binEnd; j++){

                        var val = pData[j];// take values 0-19, take values 20 - 39...take values 480-499

                        total += val;
                    }

                    var averageVal = total / step;

                    pCallback.call(pScope, binStart, averageVal, pNumValues, i);
                }
            },

            // from: http://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
            // see also: http://mathworld.wolfram.com/Circle-CircleIntersection.html
            // Checks to see if circle 1 (at position x1, y1 with radius r1) intersects
            // with circle 2 (at position x2, y2 with radius r2).
            // If it does - an array is returned containing the intersection coords
            // in the format [intersect_x1, intersect_y1, intersect_x2, intersect_y2].
            // If the circles are exactly next to each other then they intersect at only one point: [intersect_x1, intersect_y1]
            circleIntersection : function(x1, y1, r1, x2, y2, r2){

                var a, dx, dy, d, h, rx, ry, rAdd;
                var x3, y3, onePoint = false;

                // dx and dy are the vertical and horizontal distances between the circle centers.
                dx = x2 - x1;
                dy = y2 - y1;
                rAdd = r1 + r2;

                // Determine the straight-line distance between the centers.
                d = Math.sqrt((dy*dy) + (dx*dx));

                // Check for solvability.
                if (d > rAdd) {

                    return false;// no solution. circles do not intersect.
                }
                if (d < Math.abs(r1 - r2)) {

                    return false;// no solution. one circle is contained in the other
                }
                if(d === rAdd){
                    onePoint = true;// circles touch at one point
                }

                /* 'point 2' is the point where the line through the circle
                 * intersection points crosses the line between the circle
                 * centers.
                 * 'point 0' is the centre of the first, left most, circle //nn
                 */

                // Determine the distance from point 0 to point 2.
                a = ((r1*r1) - (r2*r2) + (d*d)) / (2 * d) ;

                // Determine the coordinates of point 2.
                x3 = x1 + (dx * a/d);
                y3 = y1 + (dy * a/d);

                // Determine the distance from point 2 to either of the intersection points.
                h = Math.sqrt((r1*r1) - (a*a));

                // Now determine the offsets of the intersection points from point 2.
                rx = -dy * (h/d);
                ry = dx * (h/d);

                // Determine the absolute intersection points.
                var xi = x3 + rx;
                var xi_prime = x3 - rx;
                var yi = y3 + ry;
                var yi_prime = y3 - ry;

                if(onePoint) return [xi_prime, yi_prime];

                return [xi_prime, yi_prime, xi, yi];
            }
        };

        return Utils;
	}
);
