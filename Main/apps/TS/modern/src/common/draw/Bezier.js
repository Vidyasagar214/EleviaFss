Ext.define('TS.common.draw.Bezier', {

    constructor: function (startPoint, control1, control2, endPoint) {
        this.startPoint = startPoint;
        this.control1 = control1;
        this.control2 = control2;
        this.endPoint = endPoint;
    },

    point: function (t, start, c1, c2, end) {
        return start * (1.0 - t) * (1.0 - t) * (1.0 - t)
            + 3.0 * c1 * (1.0 - t) * (1.0 - t) * t
            + 3.0 * c2 * (1.0 - t) * t * t
            + end * t * t * t;
    },

    length: function () {
        var me = this,
            steps = 10,
            length = 0,
            i, t, cx, cy, px, py, xdiff, ydiff;

        for (i = 0; i <= steps; i++) {
            t = i / steps;
            cx = me.point(t, me.startPoint.x, me.control1.x, me.control2.x, me.endPoint.x);
            cy = me.point(t, me.startPoint.y, me.control1.y, me.control2.y, me.endPoint.y);
            if (i > 0) {
                xdiff = cx - px;
                ydiff = cy - py;
                length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            }
            px = cx;
            py = cy;
        }
        return length;
    }
});
