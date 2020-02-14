g.collider = g.c = {};
g.collider.borders = [];
g.collider.intersect = function (x1, y1, x2, y2,
                                 x3, y3, x4, y4) {
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) {
        return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0 && u < 1) {
        const pt = {};
        pt.x = x1 + t * (x2 - x1);
        pt.y = y1 + t * (y2 - y1);
        return pt;
    }
};
g.collider.length = function (x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
};
g.collider.genHitDiff = function (p) {
    let a = g.collider.length(p.pos.x, p.pos.y, p.a.x, p.a.y);
    let b = g.collider.length(p.pos.x, p.pos.y, p.b.x, p.b.y);
    return Math.abs(a - b);
};
g.collider.circles = {
    drawable: [],
    emitter: [],
    pseudo: [],
    statistic: {
        unstable: false,
        inputEnergy: 0,
        outputEnergy: 0,
        inputs: [],
        outputs: []
    },
    each(callback) {  // iterator
        for (let i = 0; i < this.drawable.length; i++) {
            callback(this.drawable[i], i);
        }
    },
    draw(ctx) {
        this.each(c => {
            c.draw(ctx);
        });
        this.pseudo.forEach((p) => {
            p.draw(ctx)
        })
    },
    calcTrajectory() {
        //1) get all Intersections
        //2) pick intersection that is the closest to both    
        //3) remove them from list and add pseudo emitter
        //4) repeat
        this.statistic.inputs = this.emitter;
        this.statistic.outputs= [];

        let allEmitter = [];
        this.pseudo = [];

        for (let i = 0; i < this.emitter.length; i++) {
            this.emitter[i].calcTrajectoryBoundary(g.collider.borders);
            allEmitter.push(this.emitter[i]);
        }

        for (let iterations = 0; iterations < 100; iterations++) {
            let lines = new Map();
            let potentials = [];
            let visited=[];
            
            for (let i = 0; i < allEmitter.length; i++) {
                visited[i]=[];
                lines.set(allEmitter[i], []);
                for (let j = 0; j < allEmitter.length; j++) {
                    visited[i][j]=false;
                }
            }

            for (let i = 0; i < allEmitter.length; i++) {
                for (let j = 0; j < allEmitter.length; j++) {
                    if (i !== j) {
                        let a = allEmitter[i];
                        let b = allEmitter[j];
                        let pot = a.calcTrajectory(b);
                        if (pot !== undefined) {
                            let info = {a: a, b: b, pos: pot};
                           

                            if ((visited[i][j] === false) && (visited[j][i] === false)) {
                                visited[j][i] = true;
                                visited[i][j] = true;
                                potentials.push(info);
                                lines.get(info.a).push(info);
                                lines.get(info.b).push(info);
                            }
                        }
                    }
                }
            }

            if (potentials.length === 0) {
                this.statistic.outputs = allEmitter;
                break;
            }
            
            let smallestIndex = 0;
            for (let i = 0; i < potentials.length; i++) {
                let potentialHit = potentials[0];
                let la = lines.get(potentialHit.a).length;
                let lb = lines.get(potentialHit.b).length;

                if ((la === 1) && (lb === 1)) {
                    //We found a Ray with ONE intersection
                    smallestIndex = i;
                    break;
                } else {
                    //Is this the smallest intersection we found 
                    if (g.collider.genHitDiff(potentials[i]) < g.collider.genHitDiff(potentials[smallestIndex])) {
                        smallestIndex = i;
                    }
                }
            }

            let potentialHit = potentials[smallestIndex];
            allEmitter = allEmitter.filter((item) => {
                return (item !== potentialHit.a) && (item !== potentialHit.b);
            });

            potentialHit.a.xEnd = potentialHit.pos.x;
            potentialHit.a.yEnd = potentialHit.pos.y;
            potentialHit.b.xEnd = potentialHit.pos.x;
            potentialHit.b.yEnd = potentialHit.pos.y;

            let pseudo = new PseudoEmitter(potentialHit.pos.x, potentialHit.pos.y, potentialHit.a, potentialHit.b);
            allEmitter.push(pseudo);
            this.pseudo.push(pseudo);
        }
    },
    addEmitter(x, y, angle) {
        let holder = new Holder(x + 13, y + 13);
        let emitter = new Emitter(x, y, this.emitter.length, holder);

        emitter.addDirIndicator(holder);
        holder.addEmitter(emitter);

        this.drawable.push(emitter);
        this.emitter.push(emitter);
        this.drawable.push(holder);
        return emitter;
    },
    reset(){
        this.drawable=[];
        this.emitter=[];
    },
    load(x,y,indicatorX,indicatorY,element){
        let holder = new Holder(indicatorX, indicatorY);
        let emitter = new Emitter(x, y, this.emitter.length, holder, element);

        emitter.addDirIndicator(holder);
        holder.addEmitter(emitter);

        this.drawable.push(emitter);
        this.emitter.push(emitter);
        this.drawable.push(holder);
    },
    getClosest(pos) {
        let minDist, i, dist, x, y, foundCircle;
        minDist = Infinity;
        this.each(c => {
            x = pos.x - c.x;
            y = pos.y - c.y;
            dist = Math.sqrt(x * x + y * y);
            if (dist <= c.radius) {
                if (foundCircle === undefined || (foundCircle && c.radius < foundCircle.radius)) {
                    minDist = dist;
                    foundCircle = c;
                }
            }
        });
        return foundCircle;
    }
};
game.collider.changed = true;
game.collider.init = () => {
    let canvas = document.getElementById('canvas');
    canvas.style.border = "1px black solid";
    let ctx = canvas.getContext("2d");

    game.collider.borders = [
        {x1: 0, y1: 0, x2: 0, y2: ctx.canvas.height},
        {x1: 0, y1: ctx.canvas.height, x2: ctx.canvas.width, y2: ctx.canvas.height},
        {x1: ctx.canvas.width, y1: ctx.canvas.height, x2: ctx.canvas.width, y2: 0},
        {x1: ctx.canvas.width, y1: 0, x2: 0, y2: 0}
    ];

    function mainLoop(time) {
        // this is called 60 times a second if there is no delay
        if (game.collider.changed) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateDisplay(); // call  the function that is rendering the display
            game.collider.changed = false;
        }
        // get the next frame
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);

    let mouse = (function () {
        let bounds;
        let m = {x: 0, y: 0, button: false};

        function mouseEvent(event) {
            bounds = event.currentTarget.getBoundingClientRect();
            m.x = event.pageX - bounds.left + scrollX;
            m.y = event.pageY - bounds.top + scrollY;
            if (event.type === "mousedown") {
                m.button = true;
            } else if (event.type === "mouseup") {
                m.button = false;
            }
            game.collider.changed=true;
        }

        m.start = function (element) {
            ["mousemove", "mousedown", "mouseup"].forEach(eventType => element.addEventListener(eventType, mouseEvent));
        };
        return m;
    }());
    mouse.start(canvas);


    let dragging = {
        started: false,
        type: null,
        currentObj: null,  // what we are dragging
        startX: 0,
        startY: 0,
        start(type, obj) {
            this.startX = mouse.x;
            this.startY = mouse.y;
            this.started = true;
            this.type = type;
            this.currentObj = obj;
            this.currentObj.selected = !this.currentObj.selected;
        }

    };

    let cursor = "default";
    let overCircle = null;

    function updateDisplay() {
        let x, y, c;
        cursor = "default";
        if (mouse.x >= 0 && mouse.x < canvas.width && mouse.y >= 0 && mouse.y < canvas.height) {
            cursor = "crosshair";
        }
        if (mouse.button) {  // the button is down
            if (!dragging.started) {
                if (overCircle) {
                    dragging.start("move", overCircle);
                    overCircle = null;
                } else {
                    dragging.start("create", g.collider.circles.addEmitter(mouse.x, mouse.y, Math.PI / 4));
                }
            }
            c = dragging.currentObj;
            if (dragging.type === "create") {
                x = c.x - mouse.x;
                y = c.y - mouse.y;
            } else if (dragging.type === "move") {
                x = dragging.startX - mouse.x;
                y = dragging.startY - mouse.y;
                c.x -= x;
                c.y -= y;
                dragging.startX = mouse.x;
                dragging.startY = mouse.y;
                dragging.currentObj.whileDrag(ctx);
            }
            cursor = "none";
        } else {  // button must be up
            if (dragging.started) { // have we been dragging something.
                dragging.started = false; // drop it
            }
        }
        ctx.strokeStyle = "black";

        g.c.circles.calcTrajectory();
        g.c.circles.draw(ctx);
        g.c.compileStatistics();

        if (!dragging.started) {
            c = g.collider.circles.getClosest(mouse);
            if (c !== undefined) {
                cursor = "move";
                c.selectDraw(ctx);
                overCircle = c;
            } else {
                overCircle = null;
            }
        }
        canvas.style.cursor = cursor;
    }
};
game.collider.compileStatistics = () => {
    let statistic = g.collider.circles.statistic;
    let inputText = "Input " + statistic.inputs.length + " Hydrogen";
    let outputText = "Output " + statistic.outputs.length + " Outputs";
    let accumulate = function (arr, callback) {
        let acc = {};
        arr.forEach((obj, i) => {
            if (acc[obj.element] === undefined) {
                acc[obj.element] = 0;
            }
            acc[obj.element]++;
        });
        Object.entries(acc).forEach(callback);
    };
    
    accumulate(statistic.inputs, ([key, value]) => {
        inputText += "<br>" + key + " :" + value;
    });

    accumulate(statistic.outputs, ([key, value]) => {
        outputText += "<br>" + key + " :" + value;
    });

    document.getElementById('colliderInput').innerHTML = inputText;
    document.getElementById('colliderOutput').innerHTML = outputText;
};

game.collider.save = () => {
    let saveObj=[];
    g.collider.circles.emitter.forEach((obj)=>{
        saveObj.push({x:obj.x,y:obj.y, dirIndicator:{x:obj.dirIndicator.x,y:obj.dirIndicator.y}, element:obj.element });
    });
    
    return saveObj;
};

game.collider.load = (saveObj) => {
    g.collider.circles.reset();

    saveObj.forEach((obj) => {
        g.collider.circles.load(obj.x, obj.y, obj.dirIndicator.x, obj.dirIndicator.y, obj.element);
    });
    game.collider.changed=true;
};

game.collider.update = (event) => {

};