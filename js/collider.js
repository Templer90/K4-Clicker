g.collider = g.c = {};
g.collider.borders = [];
g.collider.createHolder = function (x, y, radius) {
    return new Holder(x, y, radius);
};
g.collider.createEmitter = function (x, y, radius, angle, id, dir) {
    return new Emitter(x, y, radius, angle, id, dir);
};
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
g.collider.circles = {
    drawables: [],
    emitter: [],
    pseudo: [],
    each(callback) {  // iterator
        for (let i = 0; i < this.drawables.length; i++) {
            callback(this.drawables[i], i);
        }
    },
    draw(ctx) {
        this.each(c => {
            c.draw(ctx);
        });
        for (let i = 0; i < this.pseudo.length; i++) {
            this.pseudo[i].draw(ctx);
        }
    },
    calcTrajectory() {
        //1) get all Inersections
        //2) pick intersection that is the closeset to both    
        //3) remove them from list and add pseudo emmiter
        //4) repeat

        let idFunc = function (a, b) {
            return "[" + a.id + "," + b.id + "]";
        };


        let allEmitter = [];
        let subEmitter = [];
        this.pseudo = [];

        for (let i = 0; i < this.emitter.length; i++) {
            this.emitter[i].calcTrajectoryBoundary(g.collider.borders);
            allEmitter.push(this.emitter[i]);
        }

        for (let iterations = 0; iterations < 100; iterations++) {
            let lines = new Map();
            let potentials = [];
            let arr=[];
            for (let i = 0; i < allEmitter.length; i++) {
                arr[i]=[];
                lines.set(allEmitter[i], []);
                for (let j = 0; j < allEmitter.length; j++) {
                    arr[i][j]=false;
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
                           

                            if ((arr[i][j] === false) && (arr[j][i] === false)) {
                                arr[j][i] = true;
                                arr[i][j] = true;
                                potentials.push(info);
                                lines.get(info.a).push(info);
                                lines.get(info.b).push(info);
                            }
                        }
                    }
                }
            }

            if (potentials.length === 0) {
                break;
            }

        
            for (let i = 0; i < potentials.length; i++) {
                let p = potentials[i];
                let la=lines.get(p.a).length;
                let lb=lines.get(p.b).length;
                if ((la === 1) && (lb === 1)) {
                    allEmitter = allEmitter.filter((item) => {
                        return (item !== p.a) && (item !== p.b);
                    });

                    p.a.xEnd = p.pos.x;
                    p.a.yEnd = p.pos.y;
                    p.b.xEnd = p.pos.x;
                    p.b.yEnd = p.pos.y;
                    let pseudo = new PseudoEmitter(p.pos.x, p.pos.y, 7, p.a, p.b);
                    
                    allEmitter.push(pseudo);
                    this.pseudo.push(pseudo);
                    break;
                }
            }
        }


    },
    addEmmitter(x, y, radius, angle) {
        let holder = g.collider.createHolder(x + 13, y + 13, 8);
        let emitter = g.collider.createEmitter(x, y, radius, angle, this.emitter.length, holder);

        emitter.addDir(holder);
        holder.addEmmiter(emitter);

        this.drawables.push(emitter);
        this.emitter.push(emitter);
        this.drawables.push(holder);
        return emitter;
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

    function mainLoop(time) {  // this is called 60 times a second if there is no delay
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateDisplay(); // call  the function that is rendering the display
        // get the next frame
        requestAnimationFrame(mainLoop);
    }

    // request the first frame. It will not start untill all the code below has been run
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
                    dragging.start("create", g.collider.circles.addEmmitter(mouse.x, mouse.y, 10, Math.PI / 4));
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

        g.collider.circles.calcTrajectory();
        g.collider.circles.draw(ctx);

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
game.collider.update = (event) => {

};