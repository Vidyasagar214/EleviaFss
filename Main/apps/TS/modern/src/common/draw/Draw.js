//Loosely based on https://github.com/szimek/signature_pad
//Released under the MIT License.
Ext.define('TS.common.draw.Draw', {
    extend: 'Ext.Component',

    reqires: [
        'TS.common.draw.Bezier',
        'TS.common.draw.Point'
    ],

    xtype: 'ts-draw',

    velocityFilterWeight: 0.7,
    lineMinWidth: 0.2,
    lineMaxWidth: 2.5,
    penColor: 'black',

    config: {
        background: 'rgba(0,0,0,0)',
        isClean: true
    },

    publishes: [
        'isClean'
    ],

    template: [
        {
            tag: 'canvas',
            reference: 'canvasElement'
        }
    ],

    initialize: function () {
        var me = this,
            canvasEl = me.canvasElement.dom;

        me.callParent();

        me.element.on({
            scope: me,
            touchstart: 'onTouchStart',
            touchmove: 'onTouchMove',
            touchend: 'onTouchEnd'
        });

        this.on({
            scope: this,
            resize: 'onResize'
        });

        me._canvas = canvasEl;
        me._ctx = canvasEl.getContext('2d');

        me.dotSize = function () {
            return (me.lineMinWidth + me.lineMaxWidth) / 2;
        };

        me.clear();
    },

    onResize: function () {
        var me = this,
            canvas = me._canvas,
            size = me.el.getBox(),
            oldSize = me.oldSize,
            data,
            image;

        // Grab data if there is something drawn
        // This is expensive operation
        if (!me._isEmpty) {
            data = canvas.toDataURL();
        }

        //size the canvas
        canvas.width = size.width;
        canvas.height = size.height;

        //Restore the image; preserve scale
        if (!me._isEmpty && oldSize) {
            image = new Image();

            me.reset();
            image.src = data;
            image.onload = function () {
                me._ctx.drawImage(image, 0, 0, oldSize.width, oldSize.height);
            };
            me._isEmpty = false;
        }

        me.oldSize = size;
    },

    onTouchStart: function (e) {
        //Ext.first('window-signature').setScrollable(false);
        if (e.event.targetTouches.length == 1) {
            var touch = e.event.changedTouches[0];
            this.strokeBegin(touch);
        }
    },

    onTouchMove: function (e) {
        // Prevent scrolling.
        //Ext.first('window-signature').setScrollable(false);
        e.event.preventDefault();

        var touch = e.event.targetTouches[0];
        this.strokeUpdate(touch);
    },

    onTouchEnd: function (e) {
        var wasCanvasTouched = e.event.target === this._canvas;
        if (wasCanvasTouched) {
            e.event.preventDefault();
            this.strokeEnd(e.event);
        }
        //Ext.first('window-signature').setScrollable(true);
        this.setIsClean(false);
    },

    getCanvasWidthScale: function () {
        return this._canvas.clientWidth / this._canvas.width;
    },

    getCanvasHeightScale: function () {
        return this._canvas.clientHeight / this._canvas.height;
    },

    clear: function () {
        var me = this,
            ctx = me._ctx,
            canvas = me._canvas;

        ctx.fillStyle = me.getBackground();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        me.reset();
    },

    //TODO implement rotation
    rotateCanvas: function () {

    },

    /**
     *
     * @param rotate {Boolean}
     * @param imageType
     * @param quality
     * @returns {*|string}
     */
    toDataURL: function (rotate, imageType, quality) {
        var canvas = this._canvas;

        //TODO rotate canvas
        if (rotate) {
            this.rotateCanvas();
        }
        return canvas.toDataURL.apply(canvas, Ext.Array.slice(arguments, 1));
    },

    fromDataURL: function (dataUrl) {
        var me = this,
            image = new Image(),
            ratio = window.devicePixelRatio || 1,
            width = me._canvas.width / ratio,
            height = me._canvas.height / ratio;

        me.reset();
        image.src = dataUrl;
        image.onload = function () {
            me._ctx.drawImage(image, 0, 0, width, height);
        };
        me._isEmpty = false;
    },

    strokeUpdate: function (event) {
        var point = this.createPoint(event);
        this.addPoint(point);
    },

    strokeBegin: function (event) {
        var me = this;

        me.reset();
        me.strokeUpdate(event);
        if (typeof me.onBegin === 'function') {
            me.onBegin(event);
        }
    },

    strokeDraw: function (point) {
        var me = this,
            ctx = me._ctx,
            dotSize = typeof(me.dotSize) === 'function' ? me.dotSize() : me.dotSize;

        ctx.beginPath();
        me.drawPoint(point.x, point.y, dotSize);
        ctx.closePath();
        ctx.fill();
    },

    strokeEnd: function (event) {
        var me = this,
            canDrawCurve = me.points.length > 2,
            point = me.points[0];

        if (!canDrawCurve && point) {
            me.strokeDraw(point);
        }
        if (typeof me.onEnd === 'function') {
            me.onEnd(event);
        }
    },

    isEmpty: function () {
        return this._isEmpty;
    },

    reset: function () {
        var me = this;

        me.points = [];
        me._lastVelocity = 0;
        me._lastWidth = (me.lineMinWidth + me.lineMaxWidth) / 2;
        me._isEmpty = true;
        me._ctx.fillStyle = me.penColor;

        me.setIsClean(true);
    },

    createPoint: function (event) {
        var rect = this._canvas.getBoundingClientRect();
        return new TS.common.draw.Point(
            (event.clientX - rect.left) / this.getCanvasWidthScale(),
            (event.clientY - rect.top) / this.getCanvasHeightScale()
        );
    },

    addPoint: function (point) {
        var points = this.points,
            c2, c3,
            curve, tmp;

        points.push(point);

        if (points.length > 2) {
            // To reduce the initial lag make it work with 3 points
            // by copying the first point to the beginning.
            if (points.length === 3) points.unshift(points[0]);

            tmp = this.calculateCurveControlPoints(points[0], points[1], points[2]);
            c2 = tmp.c2;
            tmp = this.calculateCurveControlPoints(points[1], points[2], points[3]);
            c3 = tmp.c1;
            curve = new TS.common.draw.Bezier(points[1], c2, c3, points[2]);
            this.addCurve(curve);

            // Remove the first element from the list,
            // so that we always have no more than 4 points in points array.
            points.shift();
        }
    },

    calculateCurveControlPoints: function (s1, s2, s3) {
        var draw = TS.common.draw,
            dx1 = s1.x - s2.x, dy1 = s1.y - s2.y,
            dx2 = s2.x - s3.x, dy2 = s2.y - s3.y,

            m1 = {x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0},
            m2 = {x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0},

            l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1),
            l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2),

            dxm = (m1.x - m2.x),
            dym = (m1.y - m2.y),

            k = l2 / (l1 + l2),
            cm = {x: m2.x + dxm * k, y: m2.y + dym * k},

            tx = s2.x - cm.x,
            ty = s2.y - cm.y;

        return {
            c1: new draw.Point(m1.x + tx, m1.y + ty),
            c2: new draw.Point(m2.x + tx, m2.y + ty)
        };
    },

    addCurve: function (curve) {
        var me = this,
            startPoint = curve.startPoint,
            endPoint = curve.endPoint,
            velocity, newWidth;

        velocity = endPoint.velocityFrom(startPoint);
        velocity = me.velocityFilterWeight * velocity
            + (1 - me.velocityFilterWeight) * me._lastVelocity;

        newWidth = me.strokeWidth(velocity);
        me.drawCurve(curve, me._lastWidth, newWidth);

        me._lastVelocity = velocity;
        me._lastWidth = newWidth;
    },

    drawPoint: function (x, y, size) {
        var ctx = this._ctx;

        ctx.moveTo(x, y);
        ctx.arc(x, y, size, 0, 2 * Math.PI, false);
        this._isEmpty = false;
    },

    drawCurve: function (curve, startWidth, endWidth) {
        var ctx = this._ctx,
            widthDelta = endWidth - startWidth,
            drawSteps, width, i, t, tt, ttt, u, uu, uuu, x, y;

        drawSteps = Math.floor(curve.length());
        ctx.beginPath();
        for (i = 0; i < drawSteps; i++) {
            // Calculate the Bezier (x, y) coordinate for this step.
            t = i / drawSteps;
            tt = t * t;
            ttt = tt * t;
            u = 1 - t;
            uu = u * u;
            uuu = uu * u;

            x = uuu * curve.startPoint.x;
            x += 3 * uu * t * curve.control1.x;
            x += 3 * u * tt * curve.control2.x;
            x += ttt * curve.endPoint.x;

            y = uuu * curve.startPoint.y;
            y += 3 * uu * t * curve.control1.y;
            y += 3 * u * tt * curve.control2.y;
            y += ttt * curve.endPoint.y;

            width = startWidth + ttt * widthDelta;
            this.drawPoint(x, y, width);
        }
        ctx.closePath();
        ctx.fill();
    },

    strokeWidth: function (velocity) {
        return Math.max(this.lineMaxWidth / (velocity + 1), this.lineMinWidth);
    }
});
