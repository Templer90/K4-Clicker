
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
    constructor(x, y, id, dirIndicator, element = "H") {
        super(x, y);
        this.dirIndicator = dirIndicator;
        this.radius = 10;
        this.id = id;
        this.length = 100;
        this.xEnd = -10;
        this.yEnd = -10;
        this.element = element;
        this.selected = false;
    }

    addDirIndicator(d) {
        this.dirIndicator = d;
    }

    getRay() {
        return {x1: this.x, y1: this.y, x2: this.xEnd, y2: this.yEnd};
    }

    calcTrajectory(other) {
        return g.collider.intersect(this.x, this.y, this.xEnd, this.yEnd, other.x, other.y, other.xEnd, other.yEnd);
    }

    calcTrajectoryBoundary(list) {
        this.angle = Math.atan2(this.dirIndicator.x - this.x, this.dirIndicator.y - this.y);

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

        if (this.isShorter()) {
            this.drawShorter(ctx);
        }
    }
    
    isShorter(){
        return (g.collider.length(this.x, this.y, this.xEnd, this.yEnd) < g.collider.length(this.x, this.y, this.dirIndicator.x, this.dirIndicator.y));
    }

    drawShorter(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.moveTo(this.xEnd, this.yEnd);
        ctx.lineTo(this.dirIndicator.x, this.dirIndicator.y);
        ctx.stroke();
    }

    whileDrag(ctx) {
    }
}

class PseudoEmitter extends Emitter {
    constructor(x, y, emitterA, emitterB) {
        super(x, y);
        this.id = "Pseudo("+emitterA.id+","+emitterB.id+")";
        this.emitterA = emitterA;
        this.emitterB = emitterB;
        
        this.element = "(" + this.emitterA.element + this.emitterB.element + ")";

        let angle1 = Math.atan2(this.emitterA.x - this.x, this.emitterA.y - this.y);
        let angle2 = Math.atan2(this.emitterB.x - this.x, this.emitterB.y - this.y);
        
        if(angle1>Math.PI)angle1=-(Math.PI-angle1);
        if(angle2>Math.PI)angle2=-(Math.PI-angle2);
        this.angle = Math.PI+angle1 + (angle2 - angle1) / 2;// diffAngle + ((diffAngle > Math.PI) ? +Math.PI : -Math.PI);
        
        this.radius = 6;
        this.length = 90;

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
}

class Holder extends Drawable {
    constructor(x, y) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.radius = 8;
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

        if (this.emitter.isShorter()) {
            this.emitter.drawShorter(ctx);
        }
    };

    whileDrag(ctx) {
        this.selectDraw(ctx);
    }
    

    addEmitter(emitter) {
        this.emitter = emitter;
    }
}