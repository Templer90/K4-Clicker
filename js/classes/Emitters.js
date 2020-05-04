class Drawable {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = this.y + Math.random() * this.x;
    }

    draw(ctx) {
    }

    selectDraw(ctx) {
    }
}

class Emitter extends Drawable {
    constructor(x, y, id, dirIndicator, element, energy = 1) {
        super(x, y);
        this.dirIndicator = dirIndicator;
        this.radius = 10;
        //this.id = id;
        this.maxLength = 100;
        this.energy = energy;
        this.length = 0;
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

        this.xEnd = this.x + Math.sin(this.angle) * this.maxLength;//* this.energy;
        this.yEnd = this.y + Math.cos(this.angle) * this.maxLength;//* this.energy;

        let max = this.length;
        for (let i = 0; i < list.length; i++) {
            let e = g.collider.intersect(this.x, this.y, this.xEnd, this.yEnd,
                list[i].x1, list[i].y1, list[i].x2, list[i].y2
            );

            if (e !== undefined) {
                let len = g.collider.length(this.xEnd, this.yEnd, e.x, e.y);
                if (len <= max) {
                    this.endPos(e.x, e.y);
                    max = len;
                }
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        if (this.selected) {
            ctx.fillStyle = "rgba(255,45,75,0.6)";
        } else {
            ctx.fillStyle = "rgba(0,255,255,0.1)";
        }
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.moveTo(this.x, this.y);
        let oldGradient = ctx.strokeStyle;
        let gradient = ctx.createLinearGradient(this.x, this.y, this.xEnd, this.yEnd);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1.0, "red");
        ctx.strokeStyle = gradient;
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();
        ctx.strokeStyle = oldGradient;

        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillText(this.element.symbol, this.x, this.y);
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

    isShorter() {
        return (this.length < g.collider.length(this.x, this.y, this.dirIndicator.x, this.dirIndicator.y));
    }

    drawShorter(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.moveTo(this.xEnd, this.yEnd);
        ctx.lineTo(this.dirIndicator.x, this.dirIndicator.y);
        ctx.stroke();
    }

    endPos(x, y) {
        this.xEnd = x;
        this.yEnd = y;
        this.length = g.collider.length(this.x, this.y, this.xEnd, this.yEnd);
    }

    whileDrag(ctx) {
    }
}

class SingleEmitter extends Emitter {
    constructor(x, y, emitter, element) {
        super(x, y);
        delete this.whileDrag;
        this.emitter = emitter;
        this.element = element;
        this.efficiency = 1;

        let angle1 = Math.atan2(this.emitter.emitterA.x - this.x, this.emitter.emitterA.y - this.y);
        let angle2 = Math.atan2(this.emitter.emitterB.x - this.x, this.emitter.emitterB.y - this.y);

        noise.seed(emitter.angle);
        this.angle = noise.simplex2(x / 10 + element.atomicMass, y / 10 + element.massNumber) * Math.PI * 2;

        this.radius = 2;
        this.maxLength = 400;
        this.length = this.maxLength;

        this.xEnd = this.x + Math.sin(this.angle) * this.length;
        this.yEnd = this.y + Math.cos(this.angle) * this.length;

        if (this.element instanceof Positron) {
            this.color = "rgb(218,181,133)";
        } else if (this.element instanceof Electron) {
            this.color = "rgba(128,128,255,1)";
        } else {
            this.color = "rgb(75,20,79)";
        }
    }

    draw(ctx) {
        ctx.moveTo(this.x, this.y);
        ctx.strokeStyle = null;
        ctx.strokeStyle = this.color;
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();  

        ctx.fillStyle = "rgba(0,0,0)";
        ctx.textAlign = "center";
        ctx.fillText(this.element.symbol, (this.xEnd - this.x) / 2 + this.x, (this.yEnd - this.y) / 2 + this.y);
        ctx.textAlign = "start";
    }

    calcTrajectoryBoundary(list) {
        this.xEnd = this.x + Math.sin(this.angle) * this.maxLength;//* this.energy;
        this.yEnd = this.y + Math.cos(this.angle) * this.maxLength;//* this.energy;

        let max = this.length;
        for (let i = 0; i < list.length; i++) {
            let intersect = g.collider.intersect(this.x, this.y, this.xEnd, this.yEnd,
                list[i].x1, list[i].y1, list[i].x2, list[i].y2
            );

            if (intersect !== undefined) {
                const len = g.collider.length(this.xEnd, this.yEnd, intersect.x, intersect.y);
                if (len <= max) {
                    this.endPos(intersect.x, intersect.y);
                    max = len;
                }
            }
        }
    }
}

class NeutronEmitter extends Emitter {
    constructor(x, y, emitter) {
        super(x, y);
        delete this.whileDrag;
        this.emitter = emitter;
        this.element = elements.find("n");
        this.efficiency = 1;

        let angle1 = Math.atan2(this.emitter.emitterA.x - this.x, this.emitter.emitterA.y - this.y);
        let angle2 = Math.atan2(this.emitter.emitterB.x - this.x, this.emitter.emitterB.y - this.y);

        noise.seed(emitter.angle);
        this.angle = noise.simplex2(x / 10, y / 10) * Math.PI * 2;

        this.radius = 2;
        this.maxLength = 400;
        this.length = this.maxLength;

        this.xEnd = this.x + Math.sin(this.angle) * this.length;
        this.yEnd = this.y + Math.cos(this.angle) * this.length;
    }

    draw(ctx) {
        ctx.moveTo(this.x, this.y);
        let oldGradient = ctx.strokeStyle;
        ctx.strokeStyle = "rgba(128,128,255,1)";
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();
        ctx.strokeStyle = oldGradient;

        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillText(this.element.symbol, this.x, this.y);
    }
}

class PseudoEmitter extends Emitter {
    /**
     *
     * @param x
     * @param y
     * @param emitterA Emitter
     * @param emitterB Emitter
     */
    constructor(x, y, emitterA, emitterB) {
        super(x, y);
        delete this.whileDrag;

        //this.id = "Pseudo("+emitterA.id+","+emitterB.id+")";
        this.emitterA = emitterA;
        this.emitterB = emitterB;

        //this is not working correctly
        let angle1 = Math.atan2(this.emitterA.x - this.x, this.emitterA.y - this.y);
        let angle2 = Math.atan2(this.emitterB.x - this.x, this.emitterB.y - this.y);
        let angle3 = Math.atan2(this.emitterA.y - this.emitterB.y, this.emitterA.x - this.emitterB.x);

        if (angle1 > Math.PI) angle1 = -(Math.PI - angle1);
        if (angle2 > Math.PI) angle2 = -(Math.PI - angle2);
        this.angle = Math.PI + angle1 + (angle2 - angle1) / 2;// diffAngle + ((diffAngle > Math.PI) ? +Math.PI : -Math.PI);

        this.radius = 6;
        this.maxLength = 90;
        this.length = this.maxLength;


        let len1 = g.collider.length(this.emitterA.x, this.emitterA.y, this.x, this.y);
        let len2 = g.collider.length(this.emitterB.x, this.emitterB.y, this.x, this.y);
        let eff = Math.abs(len1 - len2);
        this.efficiency = 1;
        if (eff - 10 > 0) {
            this.efficiency = 1 / (eff - 10);
        } else if (eff - 3 > 0) {
            this.efficiency = eff;
        }

        this.emitters = [this];
        
        if (emitterA.element === undefined || emitterB.element === undefined) {
            this.element = undefined;
        } else {
            const result = Isotope.fuseIsotopes(emitterA.element, emitterB.element, emitterA.energy, emitterB.energy);

            if (result.type === 'reflection') {
                this.element = emitterA.element;
                this.angle = angle2 + Math.PI;

                const other = new SingleEmitter(x, y, this, emitterB.element);
                other.angle = angle1 + Math.PI;
                this.emitters.push(other);
            } else if (result.type === 'fusion') {
                result.resultIsotopes.forEach((isotope, i) => {
                    if (i === 0) {
                        this.element = isotope;
                    }else{
                        this.emitters.push(new SingleEmitter(x, y, this, isotope));
                    }
                });
            } else {
                this.element = emitterA.element;
                this.emitters = [this];
            }

            //this.element = elements.combine(emitterA.element, emitterB.element);
            //if (((emitterA.element.symbol === "D") && (emitterB.element.symbol === "T")) || ((emitterA.element.symbol === "T") && (emitterB.element.symbol === "D"))) {
            //    this.element = elements.find("He");
            //    const em = new NeutronEmitter(x, y, this);
            //    this.emitters.push(em);
            //}
        }

        this.xEnd = this.x + Math.sin(this.angle) * this.length;
        this.yEnd = this.y + Math.cos(this.angle) * this.length;
    }

    //Get the emitters that will be used
    getEmitters() {
        return this.emitters;
    }

    draw(ctx) {
        const abs = g.collider.length(this.emitterA.x, this.emitterA.y, this.emitterB.x, this.emitterB.y) - 20;
        if (abs < (this.emitterA.length + this.emitterB.length) / 1.5) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,242,15,0.5)";
            ctx.lineWidth = 30 - abs;
            ctx.moveTo(this.emitterA.x, this.emitterA.y);
            ctx.lineTo(this.emitterB.x, this.emitterB.y);
            ctx.stroke();
            ctx.lineWidth = 1;
        }

        ctx.beginPath();


        if (this.element !== undefined) {
            ctx.fillStyle = "rgba(141,255,40,0.1)";
        } else {
            ctx.fillStyle = "rgba(255,20,57,0.22)";
        }
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.moveTo(this.x, this.y);


        ctx.beginPath();
        const oldGradient = ctx.strokeStyle;
        const gradient = ctx.createLinearGradient(this.x, this.y, this.xEnd, this.yEnd);
        gradient.addColorStop(0, "rgb(146,255,78)");
        gradient.addColorStop(1.0, "rgb(255,0,0)");
        ctx.strokeStyle = gradient;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.xEnd, this.yEnd);
        ctx.stroke();
        ctx.strokeStyle = oldGradient;

        ctx.fillStyle = "rgb(0,0,0)";
        if (this.element !== undefined) {
            ctx.textAlign = "center";
            ctx.fillText(this.element.symbol, (this.xEnd - this.x) / 2 + this.x, (this.yEnd - this.y) / 2 + this.y);
            ctx.textAlign = "start";
        } else {
            ctx.fillText("-i", this.x, this.y);
        }
    }

    calcTrajectoryBoundary(list) {}
}

class Holder extends Drawable {
    constructor(x, y) {
        super(x, y);
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