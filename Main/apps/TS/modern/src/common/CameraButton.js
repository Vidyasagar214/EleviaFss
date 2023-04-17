//Implementation is using modified parts of https://github.com/exif-js/exif-js
// To detect Orientation from Camera EXIF information
/*
 The MIT License (MIT)

 Copyright (c) 2008 Jacob Seidelin

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Ext.define('TS.common.CameraButton', {
    extend: 'Ext.Button',
    xtype: 'camerabutton',

    template: [
        {
            tag: 'span',
            reference: 'badgeElement',
            hidden: true
        },
        {
            tag: 'span',
            className: Ext.baseCSSPrefix + 'button-icon',
            reference: 'iconElement'
        },
        {
            tag: 'span',
            reference: 'textElement',
            hidden: true
        },
        {
            tag: 'input',
            reference: 'fileElement',
            name: 'uploadPhotoInput',
            type: 'file',
            accept: 'image/*',
            capture: 'camera',
            style: 'opacity:0;position:absolute;left:0'
        }
    ],

    //We skipped all but Orientation tags
    TiffTags: {
        0x0112: 'Orientation'
    },

    /**
     * @private
     * removed the tap event and rolling our own logic
     */
    initialize: function () {
        var me = this,
            el = me.fileElement;

        me.callParent();

        el.on({
            scope: me,
            change: 'fileSelected'
        });
    },

    fileSelected: function (event, cmp) {
        this.fireEvent('change', cmp, event, this);
    },

    getFileData: function (evt, maxWidth, maxHeight, format) {
        var me = this,
            settings = TS.app.settings,
            imageFormat = format || 'image/jpeg',
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d"),
            reader = new FileReader(),
            img = new Image(),
            imageWidth,
            imageHeight;
        settings.myImage = null;
        reader.onloadend = function (evt) {
            img.src = evt.target.result;
        };

        img.onload = function (e) {
            var orientation = me.getOrientation(this);

            EXIF.getData(img, function () {
                settings.myImage = img;
            });

            imageWidth = e.target.width;
            imageHeight = e.target.height;

            if (imageWidth > imageHeight) {
                if (imageWidth > maxWidth) {
                    imageHeight *= maxWidth / imageWidth;
                    imageWidth = maxWidth;
                }
            } else {
                if (imageHeight > maxHeight) {
                    imageWidth *= maxHeight / imageHeight;
                    imageHeight = maxHeight;
                }
            }

            canvas.width = imageWidth;
            canvas.height = imageHeight;

            if (orientation) {
                switch (orientation) {
                    case 2:
                        // horizontal flip
                        ctx.translate(canvas.width, 0);
                        ctx.scale(-1, 1);
                        break;
                    case 3:
                        // 180° rotate left
                        ctx.translate(canvas.width, canvas.height);
                        ctx.rotate(Math.PI);
                        break;
                    case 4:
                        // vertical flip
                        ctx.translate(0, canvas.height);
                        ctx.scale(1, -1);
                        break;
                    case 5:
                        // vertical flip + 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.scale(1, -1);
                        break;
                    case 6:
                        // 90° rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(0, -canvas.height);
                        break;
                    case 7:
                        // horizontal flip + 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(canvas.width, -canvas.height);
                        ctx.scale(-1, 1);
                        break;
                    case 8:
                        // 90° rotate left
                        ctx.rotate(-0.5 * Math.PI);
                        ctx.translate(-canvas.width, 0);
                        break;
                }
            }

            ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

            me.fireEvent('data', canvas.toDataURL(imageFormat));
        };

        reader.readAsDataURL(evt.browserEvent.srcElement.files[0]);
    },

    checkExists: function (data, key) {
        if (key in data)
            return data[key];

        return null;
    },

    convertToDegrees: function (val) {
        var d0 = val[0].numerator,
            d1 = val[0].denominator,
            d = d0 / d1,

            m0 = val[1].numerator,
            m1 = val[1].denominator,
            m = m0 / m1,

            s0 = val[2].numerator,
            s1 = val[2].denominator,
            s = s0 / s1;

        return d + (m / 60.0) + (s / 3600.0);
    },

    getOrientation: function (img) {
        var arrayBuffer = this.base64ToArrayBuffer(img.src);
        var exif = this.findEXIFinJPEG(arrayBuffer);
        return exif.Orientation || false;
    },

    base64ToArrayBuffer: function (base64, contentType) {
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    },

    findEXIFinJPEG: function (file) {
        var dataView = new DataView(file);
        //<debug>
        console.log("Got file of length " + file.byteLength);
        //</debug>

        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            //<debug>
            console.log("Not a valid JPEG");
            //</debug>
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                //<debug>
                console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                //</debug>
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            //<debug>
            //console.log(marker);
            //</debug>

            if (marker == 225) {
                //<debug>
                //console.log("Found 0xFFE1 marker");
                //</debug>
                return this.readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

            } else {
                offset += 2 + dataView.getUint16(offset + 2);
            }
        }
    },

    getStringFromDB: function (buffer, start, length) {
        var outstr = "";
        for (var n = start; n < start + length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    },

    readEXIFData: function (file, start) {
        if (this.getStringFromDB(file, start, 4) != "Exif") {
            //<debug>
            console.log("Not valid EXIF data! " + this.getStringFromDB(file, start, 4));
            //</debug>
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            //<debug>
            console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            //</debug>
            return false;
        }

        if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
            //<debug>
            console.log("Not valid TIFF data! (no 0x002A)");
            //</debug>
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            //<debug>
            console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
            //</debug>
            return false;
        }

        tags = this.readTags(file, tiffOffset, tiffOffset + firstIFDOffset, this.TiffTags, bigEnd);

        return tags;
    },

    readTags: function (file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag) {
                //<debug>
                //console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
                //</debug>
            }
            tags[tag] = this.readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    },

    readTagValue: function (file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset + 2, !bigEnd),
            numValues = file.getUint32(entryOffset + 4, !bigEnd),
            valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return this.getStringFromDB(file, offset, numValues - 1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset + 4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                        denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                    }
                    return vals;
                }
        }
    }
});
