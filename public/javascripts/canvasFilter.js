    app.canvas = function () {
        var canvas = document.getElementById("canvas"),
            ctx = canvas.getContext("2d"),
            /*            canvasWidth = Number(getStyle(canvas, 'width').slice(0, -2)),
            canvasHeight = Number(getStyle(canvas, 'height').slice(0, -2)),*/
            canvasWidth = canvas.width,
            canvasHeight = canvas.height,
            len = canvasWidth * canvasHeight * 4,
            canvasData, binaryData, tempCanvasData, tempBinaryData;


        function start(obj) {
            drawImage(obj);
        }

        function toDataURL() {
            return canvas.toDataURL("image/png");
        }

        function copyImageData(bData) {
            tempCanvasData = ctx.createImageData(canvasWidth, canvasHeight);
            return tempCanvasData.data.set(bData);
        }

        function drawImage(img) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            binaryData = canvasData.data;
        }

        function callFilter(e) {
            var e = e || window.event,
                target = e.target || e.srcElement;
            app.canvasResult[target.dataset.name](binaryData, canvasData);
        }

        function resetImage() {
            drawImage(img);
        }

        function grayColor(bData, canvasData) {
            gfilter.colorGrayProcess(bData, len);
            ctx.putImageData(canvasData, 0, 0);
        }

        function invertColor(bData, canvasData) {
            // Processing all the pixels 
            gfilter.colorInvertProcess(bData, len);
            // Copying back canvas data to canvas 
            ctx.putImageData(canvasData, 0, 0);
        }

        function adjustColor(bData, canvasData) {
            gfilter.colorAdjustProcess(bData, len);
            ctx.putImageData(canvasData, 0, 0);
        }

        function blurImage(bData, canvasData) {
            // Processing all the pixels 
            gfilter.blurProcess(ctx, canvasData);
            // Copying back canvas data to canvas 
            ctx.putImageData(canvasData, 0, 0);
        }
        //浮雕
        function reliefImage(bData, canvasData) {

            // Processing all the pixels 
            gfilter.reliefProcess(ctx, canvasData);
            // Copying back canvas data to canvas 
            ctx.putImageData(canvasData, 0, 0);
        }

        function kediaoImage(bData, canvasData) {

            // Processing all the pixels 
            gfilter.diaokeProcess(ctx, canvasData);
            // Copying back canvas data to canvas 
            ctx.putImageData(canvasData, 0, 0);
        }

        function mirrorImage(bData, canvasData) {

            // Processing all the pixels 
            gfilter.mirrorProcess(ctx, canvasData);
            // Copying back canvas data to canvas 
            ctx.putImageData(canvasData, 0, 0);
        }

        function resizeCanvas() {

            $("#canvas").attr("width", $(window).width() * 0.5);
            $("#canvas").attr("height", $(window).height() * 0.65);
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
//            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        };

        var gfilter = {
            type: "canvas",
            name: "filters",
            /**/
            colorGrayProcess: function (bData, l) {
                for (var i = 0; i < l; i += 4) {
                    var r = bData[i],
                        g = bData[i + 1],
                        b = bData[i + 2];

                    bData[i] = bData[i + 1] = bData[i + 2] = (r + g + b) / 3;
                }
            },
            /** 
             * invert color value of pixel, new pixel = RGB(255-r, 255-g, 255 - b)
             */
            colorInvertProcess: function (bData, l) {
                for (var i = 0; i < l; i += 4) {
                    var r = bData[i];
                    var g = bData[i + 1];
                    var b = bData[i + 2];

                    bData[i] = 255 - r;
                    bData[i + 1] = 255 - g;
                    bData[i + 2] = 255 - b;
                }
            },

            /** 
             * adjust color values and make it more darker and gray...
             */
            colorAdjustProcess: function (binaryData, l) {
                for (var i = 0; i < l; i += 4) {
                    var r = binaryData[i];
                    var g = binaryData[i + 1];
                    var b = binaryData[i + 2];
                    binaryData[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
                    binaryData[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
                    binaryData[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);
                }
            },

            /** 
             * deep clone image data of canvas
             *
             */
            copyImageData: function (context, src) {
                var dst = context.createImageData(src.width, src.height);
                dst.data.set(src.data);
                return dst;
            },

            /** 
     *  blur effect filter(模糊效果)

     */
            blurProcess: function (context, canvasData) {
                console.log("Canvas Filter - blur process");
                var tempCanvasData = this.copyImageData(context, canvasData);
                var sumred = 0.0,
                    sumgreen = 0.0,
                    sumblue = 0.0;
                for (var x = 0; x < tempCanvasData.width; x++) {
                    for (var y = 0; y < tempCanvasData.height; y++) {
                        // Index of the pixel in the array 
                        var idx = (x + y * tempCanvasData.width) * 4;
                        for (var subCol = -2; subCol <= 2; subCol++) {
                            var colOff = subCol + x;
                            if (colOff < 0 || colOff >= tempCanvasData.width) {
                                colOff = 0;
                            }
                            for (var subRow = -2; subRow <= 2; subRow++) {
                                var rowOff = subRow + y;
                                if (rowOff < 0 || rowOff >= tempCanvasData.height) {
                                    rowOff = 0;
                                }
                                var idx2 = (colOff + rowOff * tempCanvasData.width) * 4;
                                var r = tempCanvasData.data[idx2 + 0];
                                var g = tempCanvasData.data[idx2 + 1];
                                var b = tempCanvasData.data[idx2 + 2];
                                sumred += r;
                                sumgreen += g;
                                sumblue += b;
                            }
                        }
                        // calculate new RGB value 
                        var nr = (sumred / 25.0);
                        var ng = (sumgreen / 25.0);
                        var nb = (sumblue / 25.0);
                        // clear previous for next pixel point 
                        sumred = 0.0;
                        sumgreen = 0.0;
                        sumblue = 0.0;
                        // assign new pixel value 
                        canvasData.data[idx + 0] = nr; // Red channel 
                        canvasData.data[idx + 1] = ng; // Green channel 
                        canvasData.data[idx + 2] = nb; // Blue channel 
                        canvasData.data[idx + 3] = 255; // Alpha channel 
                    }
                }
            },

            /** 
             * 浮雕效果
             */
            reliefProcess: function (context, canvasData) {
                console.log("Canvas Filter - relief process");
                var tempCanvasData = this.copyImageData(context, canvasData);
                for (var x = 1; x < tempCanvasData.width - 1; x++) {
                    for (var y = 1; y < tempCanvasData.height - 1; y++) {
                        // Index of the pixel in the array 
                        var idx = (x + y * tempCanvasData.width) * 4;
                        var bidx = ((x - 1) + y * tempCanvasData.width) * 4;
                        var aidx = ((x + 1) + y * tempCanvasData.width) * 4;
                        // calculate new RGB value 
                        var nr = tempCanvasData.data[aidx + 0] - tempCanvasData.data[bidx + 0] + 128;
                        var ng = tempCanvasData.data[aidx + 1] - tempCanvasData.data[bidx + 1] + 128;
                        var nb = tempCanvasData.data[aidx + 2] - tempCanvasData.data[bidx + 2] + 128;
                        nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
                        ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
                        nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);
                        // assign new pixel value 
                        canvasData.data[idx + 0] = nr; // Red channel 
                        canvasData.data[idx + 1] = ng; // Green channel 
                        canvasData.data[idx + 2] = nb; // Blue channel 
                        canvasData.data[idx + 3] = 255; // Alpha channel 
                    }
                }
            },

            /** 
     * 雕刻效果

     */
            diaokeProcess: function (context, canvasData) {
                //            console.log("Canvas Filter - process");
                var tempCanvasData = this.copyImageData(context, canvasData);
                for (var x = 1; x < tempCanvasData.width - 1; x++) {
                    for (var y = 1; y < tempCanvasData.height - 1; y++) {
                        // Index of the pixel in the array 
                        var idx = (x + y * tempCanvasData.width) * 4;
                        var bidx = ((x - 1) + y * tempCanvasData.width) * 4;
                        var aidx = ((x + 1) + y * tempCanvasData.width) * 4;
                        // calculate new RGB value 
                        var nr = tempCanvasData.data[bidx + 0] - tempCanvasData.data[aidx + 0] + 128;
                        var ng = tempCanvasData.data[bidx + 1] - tempCanvasData.data[aidx + 1] + 128;
                        var nb = tempCanvasData.data[bidx + 2] - tempCanvasData.data[aidx + 2] + 128;
                        nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
                        ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
                        nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);
                        // assign new pixel value 
                        canvasData.data[idx + 0] = nr; // Red channel 
                        canvasData.data[idx + 1] = ng; // Green channel 
                        canvasData.data[idx + 2] = nb; // Blue channel 
                        canvasData.data[idx + 3] = 255; // Alpha channel 
                    }
                }
            },

            /** 
     * mirror reflect

     */
            mirrorProcess: function (context, canvasData) {
                console.log("Canvas Filter - process");
                var tempCanvasData = this.copyImageData(context, canvasData);
                for (var x = 0; x < tempCanvasData.width; x++) // column 
                {
                    for (var y = 0; y < tempCanvasData.height; y++) // row 
                    {
                        // Index of the pixel in the array 
                        var idx = (x + y * tempCanvasData.width) * 4;
                        var midx = (((tempCanvasData.width - 1) - x) + y * tempCanvasData.width) * 4;
                        // assign new pixel value 
                        canvasData.data[midx + 0] = tempCanvasData.data[idx + 0]; // Red channel 
                        canvasData.data[midx + 1] = tempCanvasData.data[idx + 1];; // Green channel 
                        canvasData.data[midx + 2] = tempCanvasData.data[idx + 2];; // Blue channel 
                        canvasData.data[midx + 3] = 255; // Alpha channel 
                    }
                }
            }
        };
        return {
            start: start,
            drawImage: drawImage,
            toDataURL: toDataURL,
            resizeCanvas: resizeCanvas,
            callFilter: callFilter,
            grayColor: grayColor,
            invertColor: invertColor,
            adjustColor: adjustColor,
            blurImage: blurImage,
            reliefImage: reliefImage,
            kediaoImage: kediaoImage,
            mirrorImage: mirrorImage,
            resetImage: resetImage
        }
    }