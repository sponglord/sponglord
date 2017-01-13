/* global define, console, require*/
define(
    [
        'utils/ObjectSuper',
        'avBase',
        'utils/utils2'
    ],
    function(objectSuper,
             baseCode,
             Utils
    ){

        "use strict";

        /**
         * Through the use of options can now represent the effects previously contained in the files:
         *  - intersects
         *  - lines (now with option to clipLines)
         *  - intersectsLines (now with option to clipLines)
         *  - intersectsLinesColor (now with option to clipLines)
         */
        function analyser(){

            // Private vars
            var defaultOptions = {

                // GENERAL
                numFrequencies : 512,
                batchModulo : 1,

                spacing : 40, // 40 for others, 20 for 'lines'

                ampMultiplier : 0.5,
                boostAmp : false,
                boostAmpDivider : 35,

                mapFreqToColor : true,

                canvasFillAlpha : 0.1, //.25 for others, 0.1 for 'lines'
                fillStyle: [255, 255, 255],
                strokeStyle: [255, 255, 255],

                linkAlphaToAmplitude : false,
                invertAlpha : false,


                // SPECIFIC

                // circles
                renderCircles : true,
                numElements : 0,
                linkWidthToAmplitude : false,
                maxLineWidth: 20,

                // intersects
                renderIntersects : true,
                drawIntersects : true, // if false & drawLines is true makes the effect formerly known as: lines
                intersectRadius : 2, // disregarded if drawIntersects is false
                doIntersectFill : true, // disregarded if drawIntersects is false
                doIntersectStroke : false, // disregarded if drawIntersects is false

                drawLines : true, // if true makes the effect formerly known as: intersectsLines (needs fillStyle...0.1 & spacing:20)
                intersectLineWidth : 1,
                drawLineStyle : [255, 255, 255],
                clipLines : true // true = draw from edges of intersect circles not from centers ('dumbbell' effect)

                // centralised, slow-fading, creamy red circles. rich, sumptuous effect
//                "numFrequencies": 512,
//                "batchModulo": 1,
//                "startPosX": 600,
//                "spacing": 0,
//                "mapFreqToColor": false,
//                "brightColors": true,
//                "fillStyle": [230,207,207],
//                "strokeStyle": [107,30,30],
//                "canvasFillStyle": [210,170,170],
//                "canvasFillAlpha": 0.1,
//                "lineWidth": 5.2,
//                "linkAlphaToAmplitude": false,
//                "invertAlpha": false,
//                "ampMultiplier": 0.9,
//                "boostAmp": true,
//                "boostAmpDivider": 35,
//                "renderCircles": true,
//                "renderIntersects": false,
//                "numElements": 0,
//                "linkWidthToAmplitude": false,
//                "maxLineWidth": 20,
//                "drawIntersects": true,
//                "intersectRadius": 11.3,
//                "doIntersectFill": true,
//                "doIntersectStroke": false,
//                "drawLines": true,
//                "drawLineStyle": [255,255,255],
//                "intersectLineWidth": 1,
//                "clipLines": true
            }

            var lastCircle = null;
            var posX = null;
            //--

            var that = baseCode(defaultOptions);

            var __super = objectSuper(that);

            that.init = function(pVizType){

                return __super.init(pVizType);
            };

            /////////// OVERRIDEABLE FUNCTIONS FOR SUBCLASSES TO CHANGE CORE FUNCTIONALITY /////////////

            that.createFrequencyDataTypedArray = function(){

                this.soundData = new Uint8Array(this.analyserNode.frequencyBinCount);
            };

            that.getFrequencyData = function(){

                this.analyserNode.getByteFrequencyData(this.soundData);
            };

            that.preLoopAction = function(){

                posX = this.options.startPosX;
                lastCircle = null;

                // reset the canvas, with a reduced alpha to leave traces of the last draw
                __super.preLoopAction();
            }

            that.loop = function(pNumSamples){

                Utils.loopOverBins(pNumSamples, this.binSize, this.soundData, this.draw, this);
            };

            that.postLoopAction = function(){}

            //--- end OVERRIDEABLE FUNCTIONS FOR SUBCLASSES TO CHANGE CORE FUNCTIONALITY -------------


            that.draw = function(pFreqIndex, pAmplitude, pNumSamples, i){

//              if(window.console && console.log){
//                  console.log('### localAudioVisualiser_songDna_5_batch::draw:: pFreqIndex=',pFreqIndex,' pAmplitude=',pAmplitude);
//              }

                // normalise the amplitude within the possible range
                var ampNorm = Utils.normalize(pAmplitude, 0, 255);
                if(ampNorm === 0){
                  return false
                }

                //-------------------------------------------------------------------------------

                /////////////// SET ALPHA /////////////////
                var alpha = 1;

                if(this.options.linkAlphaToAmplitude){

                    // link alpha to amplitude: strongest signal = 1, weakest = 0.1
                    alpha = Utils.lerp(ampNorm, 0.1, 1);

                    if(this.options.invertAlpha){

                        // link alpha to amplitude, but invert: strongest signal = 0.1, weakest = 1
                        alpha = 1.1 - alpha;
                    }
                }

                /////////////// SET COLOR /////////////////

                var fillStyle = this.options.fillStyle
                this.canvCtx.fillStyle = 'rgba(' + fillStyle[0] + ','  + fillStyle[1] + ',' + fillStyle[2] + ',' + alpha + ')';

                var strokeStyle = this.options.strokeStyle
                this.canvCtx.strokeStyle = 'rgba(' + strokeStyle[0] + ','  + strokeStyle[1] + ',' + strokeStyle[2] + ',' + alpha + ')';

                var rgb = strokeStyle;

                if(this.options.mapFreqToColor){

                    // normalise the frequency within the full frequency range (0 - 511)
                    var freqNorm = Utils.normalize(pFreqIndex, 0, pNumSamples - 1);

                    // hue
                    var hue = Math.floor(Utils.lerp(freqNorm, 0, 360));

                    // saturation & brightnesss
                    var sat = Math.floor(Utils.lerp(ampNorm, 40, 100));// TODO make 2nd param an option?
                    var bright = Math.floor(Utils.lerp(ampNorm, 50, 100));

                    rgb = Utils.hsvToRGB([hue, sat, bright]);
                    var rgbBright = Utils.hsvToRGB([hue, 100, 100]);

                    this.canvCtx.fillStyle = 'rgba(' + rgbBright[0] + ','  + rgbBright[1] + ',' + rgbBright[2] + ',' + alpha + ')';

                    this.canvCtx.strokeStyle = 'rgba(' + rgbBright[0] + ','  + rgbBright[1] + ',' + rgbBright[2] + ',' + alpha + ')';;
                }


                var multiplier = this.options.ampMultiplier;

                // Use math.log to boost size - the larger the amplitude the bigger the boost
                // Values 1 - 255 will give results 0 - 2.4065
                if(this.options.boostAmp){

                    var log =  Math.log10(pAmplitude / this.options.boostAmpDivider);
                    multiplier = (log > 0 && log > this.options.ampMultiplier)? log : this.options.ampMultiplier
                }


                // CIRCLES
                if(this.options.renderCircles){

                    this.canvCtx.lineWidth = this.options.lineWidth;

                    if(this.options.linkWidthToAmplitude){

                        this.canvCtx.lineWidth = Math.floor(Utils.lerp(ampNorm, 0, this.options.maxLineWidth));
                    }

                    this.canvCtx.beginPath();
                    this.canvCtx.arc(posX, this.canvH / 2, pAmplitude * multiplier, 0, Math.PI * 2, false);
                    this.canvCtx.stroke();
                }
                //--


                // INTERSECTS
                if(this.options.renderIntersects){

                    if(lastCircle){

                        this.canvCtx.lineWidth = this.options.intersectLineWidth;

//                        multiplier = this.options.ampMultiplier;

                        var intersect = Utils.circleIntersection(posX, this.canvH / 2, pAmplitude * multiplier, lastCircle[0], lastCircle[1], lastCircle[2]);

                        if(intersect){

                            if(this.options.drawIntersects){

                                this.canvCtx.beginPath();
                                this.canvCtx.arc(intersect[0], intersect[1], this.options.intersectRadius, 0, Math.PI * 2, false);


                                // Intersect circles are drawn at max. sat & bright
                                if(this.options.doIntersectFill){

                                    this.canvCtx.fill();
                                }

                                if(this.options.doIntersectStroke){

                                    this.canvCtx.stroke();
                                }
                            }


                            if(intersect.length > 2){

                                if(this.options.drawIntersects){

                                    this.canvCtx.beginPath();
                                    this.canvCtx.arc(intersect[2], intersect[3], this.options.intersectRadius, 0, Math.PI * 2, false);

                                    if(this.options.doIntersectStroke){
                                        this.canvCtx.stroke();
                                    }

                                    if(this.options.doIntersectFill){
                                        this.canvCtx.fill();
                                    }
                                }

                                if(this.options.drawLines){

                                    if(!this.options.mapFreqToColor){

                                        this.canvCtx.strokeStyle = 'rgba(' + this.options.drawLineStyle[0] + ',' + this.options.drawLineStyle[1] + ',' + this.options.drawLineStyle[2] + ',' + alpha + ')';

                                    }else{

                                        // Line sat & bright is linked to amplitude
                                        this.canvCtx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
                                    }

                                    var lineLengthAdjust = (!this.options.clipLines) ? 0 : this.options.intersectRadius;

                                    // Draw line
                                    this.canvCtx.beginPath();
                                    this.canvCtx.moveTo(intersect[0], intersect[1] - lineLengthAdjust);
                                    this.canvCtx.lineTo(intersect[2], intersect[3] + lineLengthAdjust);
                                    this.canvCtx.stroke();
                                }

                            }

                        }
                    }

                    lastCircle = [posX, this.canvH / 2, pAmplitude * multiplier];
                }
                //--

                posX += this.options.spacing;

                return true;
            }

            that.optionChange = function(pOpt, pVal){

                __super.optionChange(pOpt, pVal);

                switch(pOpt){

                    case 'numElements':

                        this.binSize = this.options.numElements = pVal;

                        break
                }
            };

            return that;
        }

        return analyser;
    });