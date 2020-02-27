g.collider = g.c = {};
g.collider.borders = [];
g.collider.selectedEmitter = undefined;
g.collider.changed = true;
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
g.collider.statistic = {
    unstable: true,
    inputEnergy: 0,
    outputEnergy: 0,
    inputEmitters: [],
    outputEmitters: [],
    pseudo: [],
    inputElements: [],
    outputElements: []
};
g.collider.options = {
    maxEmitter: 5,
    usableElements: ['H', 'He']
};
g.collider.emitters = {
    drawable: [],
    emitter: [],
    pseudo: [],

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
        g.collider.statistic.inputEmitters = this.emitter;
        g.collider.statistic.outputEmitters = [];
        g.collider.statistic.pseudo = [];
        g.collider.statistic.inputElements = [];
        g.collider.statistic.outputElements = [];

        g.collider.statistic.unstable = false;
        g.collider.statistic.inputEnergy = 0;

        let allEmitter = [];
        this.pseudo = [];

        for (let i = 0; i < this.emitter.length; i++) {
            this.emitter[i].calcTrajectoryBoundary(g.collider.borders);
            allEmitter.push(this.emitter[i]);
        }

        for (let iterations = 0; iterations < 100; iterations++) {
            let lines = new Map();
            let potentials = [];
            let visited = [];

            for (let i = 0; i < allEmitter.length; i++) {
                visited[i] = [];
                lines.set(allEmitter[i], []);
                for (let j = 0; j < allEmitter.length; j++) {
                    visited[i][j] = false;
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
                g.collider.statistic.outputEmitters = allEmitter;
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

            potentialHit.a.endPos(potentialHit.pos.x, potentialHit.pos.y);
            potentialHit.b.endPos(potentialHit.pos.x, potentialHit.pos.y);

            let pseudo = new PseudoEmitter(potentialHit.pos.x, potentialHit.pos.y, potentialHit.a, potentialHit.b);
            if (pseudo.element === undefined) {
                g.collider.statistic.unstable = true;
            }
            allEmitter.push(pseudo);
            this.pseudo.push(pseudo);
            g.collider.statistic.pseudo.push(pseudo);
        }
    },
    addEmitter(x, y, element) {
        if (this.emitter.length >= g.collider.options.maxEmitter) return;
        let holder = new Holder(x + 13, y + 13);
        let emitter = new Emitter(x, y, this.emitter.length, holder, element);

        emitter.addDirIndicator(holder);
        holder.addEmitter(emitter);

        this.drawable.push(emitter);
        this.emitter.push(emitter);
        this.drawable.push(holder);
        return emitter;
    },
    removeEmitter(emitter) {
        let em = this.emitter.find((obj, i) => {
            return obj.id === emitter.id;
        });
        let hol = em.dirIndicator;

        this.drawable = this.drawable.filter((item) => {
            return item.id !== emitter.id;
        });
        this.drawable = this.drawable.filter((item) => {
            return item.id !== hol.id;
        });
        this.emitter = this.emitter.filter((item) => {
            return item.id !== emitter.id;
        });
    },
    reset() {
        this.drawable = [];
        this.emitter = [];
    },
    load(x, y, indicatorX, indicatorY, element) {
        let holder = new Holder(indicatorX, indicatorY);
        let emitter = new Emitter(x, y, this.emitter.length, holder, elements.find(element));

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
            game.collider.changed = true;
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
            if (type !== "create") {
                let oldSelected = this.currentObj.selected;
                g.collider.emitters.each((obj, i) => {
                    obj.selected = false;
                });
                this.currentObj.selected = !oldSelected;
            }
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
                    let element = document.getElementById('emitterSelect').value;
                    let newEmitter = g.collider.emitters.addEmitter(mouse.x, mouse.y, elements.find(element));
                    if (newEmitter !== undefined) {
                        dragging.start("create", newEmitter);
                    } else {
                        dragging.type = "move";
                        dragging.started = false;
                    }
                }
            }
            c = dragging.currentObj;
            if (dragging.type === "create") {
                dragging.currentObj.dirIndicator.x = mouse.x;
                dragging.currentObj.dirIndicator.y = mouse.y;
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

        g.c.emitters.calcTrajectory();
        g.c.emitters.draw(ctx);
        g.c.compileStatistics();

        if (!dragging.started) {
            c = g.collider.emitters.getClosest(mouse);
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

    game.collider.updateAllowedElements();
};
game.collider.changeEmitterType = (selector) => {
    if (game.collider.selectedEmitter !== undefined) {
        game.collider.selectedEmitter.element = elements.find(selector.value);
        game.collider.changed = true
    }
};
game.collider.removeSelectedEmitter = () => {
    if (game.collider.selectedEmitter !== undefined) {
        game.collider.emitters.removeEmitter(game.collider.selectedEmitter);
        game.collider.selectedEmitter = undefined;
        game.collider.changed = true
    }
};
game.collider.compileStatistics = () => {
    let statistic = g.collider.statistic;
    let restText = (g.collider.options.maxEmitter - statistic.inputEmitters.length) + " remaining";
    let inputText = "Input " + statistic.inputEmitters.length + " " + (statistic.unstable ? "!!!UNSTABLE!!!" : "") + " " + restText;
    let outputText = "Output " + statistic.outputEmitters.length;

    let accumulate = function (arr, callback) {
        let acc = {};
        arr.forEach((obj, i) => {
            if (obj.element === undefined) return;
            if (acc[obj.element.name] === undefined) {
                acc[obj.element.name] = 0;
            }
            acc[obj.element.name]++;
        });
        Object.entries(acc).forEach(callback);
    };

    accumulate(statistic.inputEmitters, ([key, value]) => {
        inputText += "<br>" + key + " :" + value;
        g.collider.statistic.inputElements.push({element: key, value: value});
    });

    let energy = 0;
    statistic.inputEmitters.forEach((obj, i) => {
        let percent = obj.length / obj.maxLength;
        energy += percent * 10;
    });
    statistic.pseudo.forEach((obj, i) => {
        energy /= obj.efficiency;
    });
    g.collider.statistic.inputEnergy = energy;
    inputText += "<br>Energy " + numbers.fix(energy, 0);

    accumulate(statistic.outputEmitters, ([key, value]) => {
        outputText += "<br>\t" + key + " :" + value;
        g.collider.statistic.outputElements.push({element: key, value: value});
    });


    g.c.selectedEmitter = g.c.emitters.emitter.find((obj, i) => (obj.selected));
    if (g.c.selectedEmitter !== undefined) {
        document.getElementById('emitterId').innerText = g.c.selectedEmitter.id;
        document.getElementById('emitterLength').innerText = (g.c.selectedEmitter.length / g.c.selectedEmitter.maxLength);
        document.getElementById('emitterSelect').value = g.c.selectedEmitter.element.symbol;
    }

    document.getElementById('colliderInput').innerHTML = inputText;
    document.getElementById('colliderOutput').innerHTML = outputText;
};
game.collider.updateAllowedElements = () => {
    let select = document.getElementById('emitterSelect');
    let length = select.options.length;
    for (let i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }

    let map = new Map();
    g.collider.options.usableElements.sort((a, b) => {
        if (!map.has(a)) map.set(a, elements.find(a).atomic_mass);
        if (!map.has(b)) map.set(b, elements.find(b).atomic_mass);
        return map.get(a) - map.get(b);
    }).forEach((element, i) => {
        let option = document.createElement('option');
        option.text = element;
        select.add(option, select[i]);
    });
};
game.collider.save = () => {
    let saveObj = {
        emitters: [],
        options: {}
    };
    g.collider.emitters.emitter.forEach((obj) => {
        saveObj.emitters.push({
            x: obj.x,
            y: obj.y,
            dirIndicator: {x: obj.dirIndicator.x, y: obj.dirIndicator.y},
            element: obj.element.symbol
        });
    });
    saveObj.options = g.collider.options;
    return saveObj;
};
game.collider.load = (saveObj) => {
    g.collider.emitters.reset();

    saveObj.emitters.forEach((obj) => {
        g.collider.emitters.load(obj.x, obj.y, obj.dirIndicator.x, obj.dirIndicator.y, obj.element);
    });
    g.collider.options = saveObj.options;

    game.collider.updateAllowedElements();
    game.collider.changed = true;
};
game.collider.update = (event) => {

};