
class Drawable {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
    }

    selectDraw(ctx) {
    }
}

class Emitter extends Drawable {
    constructor(x, y, radius, angle, id, dir) {
        super(x, y);
        this.dir = dir;
        this.angle = angle;
        this.radius = radius;
        this.id = id;
        this.length = 100;
        this.xEnd = -10;
        this.yEnd = -10;
        this.connectedEmitter = undefined;
        this.selected = false;
    }

    addDir(d) {
        this.dir = d;
    }

    getRay() {
        return {x1: this.x, y1: this.y, x2: this.xEnd, y2: this.yEnd};
    }

    calcTrajectory(other) {
        let max = g.collider.length(this.x, this.y, this.xEnd, this.yEnd);
        let max2 = g.collider.length(other.x, other.y, other.xEnd, other.yEnd);
        return g.collider.intersect(this.x, this.y, this.xEnd, this.yEnd, other.x, other.y, other.xEnd, other.yEnd);
        //if (e !== undefined) {
        //    let len = g.collider.length(this.xEnd, this.yEnd, e.x, e.y);
        //    let len2 = g.collider.length(other.xEnd, other.yEnd, e.x, e.y);
        //   // if (((len < max) && (len2 < max2)) && Math.abs(len - len2) < 10) {
        //        //this.xEnd = e.x;
        //        //this.yEnd = e.y;
        //        //other.xEnd = e.x;
        //        //other.yEnd = e.y;
        //        //
        //        //other.connectedEmmiter = this;
        //        //this.connectedEmitter = other;
        //        return {x:e.x,y:e.y};
        //    //}
        //}
    }

    calcTrajectoryBoundary(list) {
        this.connectedEmitter = undefined;
        this.angle = Math.atan2(this.dir.x - this.x, this.dir.y - this.y);

        this.xEnd = this.x + Math.sin(this.angle) * this.length;
        this.yEnd = this.y + Math.cos(this.angle) * this.length;

        let max = this.length;
        for (let i = 0; i < list.length; i++) {
            let e = g.collider.intersect(this.x, this.y, this.xEnd, this.yEnd,
                list[i].x1, list[i].y1, list[i].x2, list[i].y2
            );

            if (e !== undefined) {
                let len = g.collider.length(this.xEnd, this.yEnd, e.x, e.y);
                if (len <= max) {
                    this.xEnd = e.x;
                    this.yEnd = e.y;
                    max = len;
                }
            }
        }
    }

    draw(ctx) {
        if (this.selected) {
            ctx.fillStyle = "rgba(255,45,75,0.6)";
        } else {
            ctx.fillStyle = "rgba(0,255,255,0.1)";
        }
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);


        ctx.moveTo(this.x, this.y);
        let oldgradient = ctx.strokeStyle;
        let gradient = ctx.createLinearGradient(this.x, this.y, this.xEnd, this.yEnd);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1.0, "red");
        ctx.strokeStyle = gradient;
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();
        ctx.strokeStyle = oldgradient;


        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillText(this.id + "", this.x, this.y);
    }

    selectDraw(ctx) {
        this.draw(ctx);
        ctx.strokeStyle = "red";
        ctx.fillStyle = "rgba(0,255,255,0.1)";
        ctx.fill();

        ctx.moveTo(this.xEnd, this.yEnd);
        ctx.beginPath();
        ctx.arc(this.xEnd, this.yEnd, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    whileDrag(ctx) {
    }
}

class PseudoEmitter extends Drawable {
    constructor(x, y, radius, emitterA, emitterB) {
        super(x, y);
        this.id = "Pseudo("+emitterA.id+","+emitterB.id+")";
        this.emitterA = emitterA;
        this.emitterB = emitterB;

        let angle1 = Math.atan2(this.emitterA.x - this.x, this.emitterA.y - this.y);
        let angle2 = Math.atan2(this.emitterB.x - this.x, this.emitterB.y - this.y);

        this.angle = Math.PI+angle1 + (angle2 - angle1) / 2;
        this.radius = radius;
        this.length = 100;

        this.xEnd = this.x + Math.sin(this.angle) * this.length;
        this.yEnd = this.y + Math.cos(this.angle) * this.length;

        this.whileDrag = null;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);


        ctx.moveTo(this.x, this.y);
        let oldgradient = ctx.strokeStyle;
        let gradient = ctx.createLinearGradient(this.x, this.y, this.xEnd, this.yEnd);
        gradient.addColorStop(0, "green");
        gradient.addColorStop(1.0, "red");
        ctx.strokeStyle = gradient;
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();
        ctx.strokeStyle = oldgradient;


        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillText("P", this.x, this.y);
    }

    calcTrajectory(other) {
        return g.collider.intersect(this.x, this.y, this.xEnd, this.yEnd, other.x, other.y, other.xEnd, other.yEnd);
    }
}

class Holder extends Drawable {
    constructor(x, y, radius) {
        super(x, y);
        this.emitter = null;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    addEmmiter(e) {
        this.emitter = e;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(141,255,40,0.1)";
        ctx.fill();
        ctx.stroke();
    };

    selectDraw(ctx) {
        this.draw(ctx);
    };

    whileDrag(ctx) {
    }
}