g.collider = g.c = {};
g.collider.borders = [];
g.collider.selectedEmitter = undefined;
g.collider.changed = true;
game.collider.saveButton = undefined;
g.collider.intersect = function (x1, y1, x2, y2,
                                 x3, y3, x4, y4) {
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) {
        return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0 && u < 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
};
g.collider.length = function (x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a * a + b * b);
};
g.collider.genHitDiff = function (p) {
    let a = g.collider.length(p.pos.x, p.pos.y, p.a.x, p.a.y);
    let b = g.collider.length(p.pos.x, p.pos.y, p.b.x, p.b.y);
    return Math.abs(a - b);
};

g.collider.newStatistic = () => {
    return {
        unstable: true,
        inputEnergy: 0,
        outputEnergy: 0,
        inputEmitters: [],
        outputEmitters: [],
        pseudo: [],
        inputElements: [],
        outputElements: []
    };
};

g.collider.currentCollider = g.collider.newStatistic();
g.collider.currentColliderID = 0;
g.collider.statistic = [];
g.collider.statistic[0] = g.collider.newStatistic();

g.collider.options = {
    maxEmitter: 5,
    usableElements: ['H', 'He'],
    autoElements: [], //TODO Is this really Implemented right?
    collider: 1, // Number of colliders that can be defined
    inputEfficiency: 1, //1 ist best = no energy lost on conversion
    outputEfficiency: 1,//1 ist best = no energy lost on conversion
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
        const statistic = g.collider.newStatistic();
        statistic.inputEmitters = this.emitter;
        statistic.outputEmitters = [];
        statistic.pseudo = [];
        statistic.inputElements = [];
        statistic.outputElements = [];

        statistic.unstable = false;
        statistic.inputEnergy = 0;

        let allEmitter = [];
        this.pseudo = [];

        for (let i = 0; i < this.emitter.length; i++) {
            this.emitter[i].calcTrajectoryBoundary(g.collider.borders);
            allEmitter.push(this.emitter[i]);
        }

        for (let iterations = 0; iterations < 100; iterations++) {
            const lines = new Map();
            const potentials = [];
            const visited = [];

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
                        const a = allEmitter[i];
                        const b = allEmitter[j];
                        const pot = a.calcTrajectory(b);
                        if (pot !== undefined) {
                            const info = {a: a, b: b, pos: pot};

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
                statistic.outputEmitters = allEmitter;
                break;
            }

            let smallestIndex = 0;
            for (let i = 0; i < potentials.length; i++) {
                const potentialHit = potentials[0];
                const la = lines.get(potentialHit.a).length;
                const lb = lines.get(potentialHit.b).length;

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

            const potentialHit = potentials[smallestIndex];
            allEmitter = allEmitter.filter((item) => {
                return (item !== potentialHit.a) && (item !== potentialHit.b);
            });

            potentialHit.a.endPos(potentialHit.pos.x, potentialHit.pos.y);
            potentialHit.b.endPos(potentialHit.pos.x, potentialHit.pos.y);

            const pseudo = new PseudoEmitter(potentialHit.pos.x, potentialHit.pos.y, potentialHit.a, potentialHit.b);
            if (pseudo.element === undefined) {
                statistic.unstable = true;
            }

            pseudo.getEmitters().forEach((obj) => {
                allEmitter.push(obj);
                this.pseudo.push(obj);
                statistic.pseudo.push(obj);
            });

            g.collider.currentCollider = statistic;
        }

        this.pseudo.forEach((pseudo) => {
            pseudo.calcTrajectoryBoundary(g.collider.borders);
        });
    },
    addEmitter(x, y, element, energy = 1) {
        if (this.emitter.length >= g.collider.options.maxEmitter) return;
        let holder = new Holder(x + 13, y + 13);
        let emitter = new Emitter(x, y, this.emitter.length, holder, element, energy);

        emitter.addDirIndicator(holder);
        holder.addEmitter(emitter);

        this.drawable.push(emitter);
        this.emitter.push(emitter);
        this.drawable.push(holder);
        return emitter;
    },
    removeEmitter(emitter) {
        let em = this.emitter.find((obj) => {
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
    load(x, y, indicatorX, indicatorY, element, energy) {
        let holder = new Holder(indicatorX, indicatorY);
        let emitter = new Emitter(x, y, this.emitter.length, holder, elements.findIsotope(element), energy);

        emitter.addDirIndicator(holder);
        holder.addEmitter(emitter);

        this.drawable.push(emitter);
        this.emitter.push(emitter);
        this.drawable.push(holder);
    },
    getClosest(pos) {
        let minDist, dist, x, y, foundCircle;
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
game.collider.markDirty = (text = 'Save?') => {
    game.collider.saveButton.classList.replace('btn-outline-primary', 'btn-outline-secondary');
    game.collider.saveButton.textContent = text;
};
game.collider.unMarkDirty = (text = 'Save') => {
    game.collider.saveButton.classList.replace('btn-outline-secondary', 'btn-outline-primary');
    game.collider.saveButton.textContent = text;
};

// These do not reliably work
game.collider.sliderInit = () => {
    const sliderPrefab = {
        htmlElement: document.getElementById('EmitterEnergySlider'),
        label: document.getElementById('EmitterEnergySliderLabel')
    };

    sliderPrefab.getEnergy = function () {
        return sliderPrefab.htmlElement.value;
    };

    sliderPrefab.setEnergy = function (value) {
        sliderPrefab.htmlElement.value = Number(value);
        sliderPrefab.calcLabelString();
    };

    sliderPrefab.calcLabelString = function () {
        const value = parseFloat(sliderPrefab.htmlElement.value);
        const normalized = value / sliderPrefab.htmlElement.max;
        const mev = (sliderPrefab.htmlElement.max * normalized).toFixed(1).padStart(4, '0');
        const percent = (normalized * 100).toFixed(1).padStart(5, '0');

        sliderPrefab.label.innerHTML = mev + ' MeV<br>' + percent + '%';
    };

    sliderPrefab.getNormalizedEnergy = function () {
        sliderPrefab.calcLabelString();
        return sliderPrefab.htmlElement.value / sliderPrefab.htmlElement.max;
    };

    sliderPrefab.setNormalizedEnergy = function (value) {
        sliderPrefab.htmlElement.value = value * sliderPrefab.htmlElement.max;
        sliderPrefab.calcLabelString();
    };

    sliderPrefab.disable = function () {
        sliderPrefab.htmlElement.setAttribute('disabled', 'disabled');
        sliderPrefab.htmlElement.classList.add('disabled');
    };

    sliderPrefab.enable = function () {
        sliderPrefab.htmlElement.removeAttribute('disabled');
        sliderPrefab.htmlElement.classList.remove('disabled');
    };

    sliderPrefab.setNormalizedEnergy(0.0);
    
    game.collider.EmitterEnergySlider = sliderPrefab;
};
game.collider.init = () => {
    game.collider.sliderInit();

    game.collider.saveButton = document.getElementById('use-collider');
    const canvas = document.getElementById('canvas');
    canvas.style.border = "1px black solid";
    const ctx = canvas.getContext("2d");

    game.collider.borders = [
        {x1: 0, y1: 0, x2: 0, y2: ctx.canvas.height},
        {x1: 0, y1: ctx.canvas.height, x2: ctx.canvas.width, y2: ctx.canvas.height},
        {x1: ctx.canvas.width, y1: ctx.canvas.height, x2: ctx.canvas.width, y2: 0},
        {x1: ctx.canvas.width, y1: 0, x2: 0, y2: 0}
    ];

    function mainLoop() {
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
                game.collider.markDirty();
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
                g.collider.emitters.each((obj) => {
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
                    let elementName = document.getElementById('emitterSelect').value;
                    let energy = game.collider.EmitterEnergySlider.getEnergy();
                    let newEmitter = g.collider.emitters.addEmitter(mouse.x, mouse.y, elements.findIsotope(elementName), energy);
                    if (newEmitter !== undefined) {
                        dragging.start("create", newEmitter);
                    } else {
                        dragging.type = "move";
                        dragging.started = false;
                    }
                }
            }
            c = dragging.currentObj;
            if (c !== undefined && c !== null) {
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
        game.collider.selectedEmitter.element = elements.findIsotope(selector.value);
        game.collider.changed = true
    }
};
game.collider.changeEmitterEnergy = (selector) => {
    if (game.collider.selectedEmitter !== undefined) {
        game.collider.selectedEmitter.energy =  game.collider.EmitterEnergySlider.getEnergy();
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
    const statistic = g.collider.currentCollider;
    statistic.inputElements = [];
    statistic.outputElements = [];

    const restText = (g.collider.options.maxEmitter - statistic.inputEmitters.length) + " remaining";
    let inputText = "Input " + statistic.inputEmitters.length + " " + (statistic.unstable ? "!!!UNSTABLE!!!" : "") + " " + restText;
    let outputText = "Output " + statistic.outputEmitters.length;

    let accumulate = function (arr, callback) {
        let acc = {};
        arr.forEach((obj) => {
            if (obj.element === undefined) return;
            if (acc[obj.element.name] === undefined) {
                acc[obj.element.name] = 0;
            }
            acc[obj.element.name]++;
        });
        Object.entries(acc).forEach(callback);
    };

    //accumulate inputs
    accumulate(statistic.inputEmitters, ([key, value]) => {
        if (g.collider.options.autoElements.includes(elements.findIsotope(key).symbol)) {
            inputText += "<br>(" + key + ": " + value + ")";
        } else {
            inputText += "<br>" + key + ": " + value;
            statistic.inputElements.push({element: key, value: value});
        }
    });
    let inputEnergy = 0;
    statistic.inputEmitters.forEach((obj) => {
        //let percent = obj.length / obj.maxLength;
        //energy += percent * 10;

        inputEnergy += obj.energy * 1000;
    });
    //statistic.pseudo.forEach((obj) => {
    //    inputEnergy /= obj.efficiency;
    //});
    statistic.inputEnergy = inputEnergy * (1.0 / g.collider.options.inputEfficiency);
    inputText += "<br>Energy " + numbers.fix(statistic.inputEnergy < 1 ? 1 : statistic.inputEnergy, 0);

    //accumulate outputs
    accumulate(statistic.outputEmitters, ([key, value]) => {
        outputText += "<br>\t" + key + " :" + value;
        statistic.outputElements.push({element: key, value: value});
    });
    let outputEnergy = 0;
    statistic.outputEmitters.forEach((obj) => {
        outputEnergy += obj.element.energy * 1000;

        if (obj instanceof Positron) {
            outputEnergy += 1.022 * 1000;
        }
    });
    statistic.outputEnergy = outputEnergy * g.collider.options.outputEfficiency;
    outputText += "<br>Energy " + numbers.fix(statistic.outputEnergy < 1 ? 1 : statistic.outputEnergy, 0);


    //Remove Not not savable Elements
    const isValid = (e) => {
        const f = elements.findIsotope(e.element);
        return (f !== undefined) && !(f instanceof Invalid);
    };
    statistic.outputElements = statistic.outputElements.filter(isValid);
    statistic.inputElements = statistic.inputElements.filter(isValid);

    // TODO Implement efficiency display
    
    g.c.selectedEmitter = g.c.emitters.emitter.find((obj) => (obj.selected));
    if (g.c.selectedEmitter !== undefined) {
        document.getElementById('emitterId').innerText = g.c.selectedEmitter.id;
        document.getElementById('emitterLength').innerText = (g.c.selectedEmitter.length / g.c.selectedEmitter.maxLength);
        document.getElementById('emitterSelect').value = g.c.selectedEmitter.element.symbol;
        game.collider.EmitterEnergySlider.enable();
        game.collider.EmitterEnergySlider.setEnergy(g.c.selectedEmitter.energy);
    } else {
        game.collider.EmitterEnergySlider.disable();
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
        if (!map.has(a)) map.set(a, elements.findIsotope(a).atomicMass);
        if (!map.has(b)) map.set(b, elements.findIsotope(b).atomicMass);
        return map.get(a) - map.get(b);
    }).forEach((element, i) => {
        let option = document.createElement('option');
        option.text = element;
        select.add(option, select[i]);
    });
};
game.collider.save = () => {
    let saveObj = {
        collider: [],
        options: {}
    };
    g.collider.statistic.forEach((collider, i) => {
        saveObj.collider[i] = [];
        collider.inputEmitters.forEach((emitter) => {
            saveObj.collider[i].push({
                x: emitter.x,
                y: emitter.y,
                dirIndicator: {x: emitter.dirIndicator.x, y: emitter.dirIndicator.y},
                element: emitter.element.symbol,
                energy:emitter.energy
            });
        });
    });

    saveObj.options = g.collider.options;
    return saveObj;
};
game.collider.load = (saveObj) => {
    saveObj.collider.forEach((collider, i) => {
        g.collider.emitters.reset();
        g.collider.statistic[i] = g.collider.newStatistic();
        g.collider.currentCollider = g.collider.newStatistic();
        g.collider.currentColliderID = i;
        collider.forEach((emitter) => {
            g.collider.emitters.load(emitter.x, emitter.y, emitter.dirIndicator.x, emitter.dirIndicator.y, emitter.element, emitter.energy);
            g.collider.emitters.calcTrajectory();
            g.collider.compileStatistics();
            g.collider.statistic[i] = g.collider.currentCollider;
        });
    });

    g.collider.currentColliderID = 0;
    g.collider.emitters.reset();
    g.collider.currentCollider = g.collider.statistic[g.collider.currentColliderID];
    g.collider.currentCollider.inputEmitters.forEach((obj) => {
        g.collider.emitters.load(obj.x, obj.y, obj.dirIndicator.x, obj.dirIndicator.y, obj.element, obj.energy);
    });

    g.collider.options = saveObj.options;

    game.collider.updateAllowedElements();
    game.collider.changed = true;
};
game.collider.changeCollider = (selector) => {
    g.collider.currentColliderID = Number.parseInt(selector.value);

    g.collider.emitters.reset();
    g.collider.currentCollider = g.collider.statistic[g.collider.currentColliderID];
    g.collider.currentCollider.inputEmitters.forEach((obj) => {
        g.collider.emitters.load(obj.x, obj.y, obj.dirIndicator.x, obj.dirIndicator.y, obj.element, obj.energy);
    });
    game.collider.changed = true;
};
game.collider.useCollider = () => {
    const selector = document.getElementById('colliderSelector');
    g.collider.currentColliderID = Number.parseInt(selector.value);
    g.collider.statistic[g.collider.currentColliderID] = g.collider.currentCollider;
    game.collider.compileStatistics();
    game.builds.update();

    game.collider.unMarkDirty();
};
game.collider.update = () => {
    const select = document.getElementById('colliderSelector');
    select.innerHTML = '';

    const option = document.createElement('option');
    option.value = 0;
    option.innerHTML = 'Main';
    option.selected = 'selected';
    select.add(option);

    for (let i = 1; i < g.collider.options.collider; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = 'Collider #' + i;

        select.add(option);

        if (g.collider.statistic[i] === undefined) {
            g.collider.statistic.push(g.collider.newStatistic());
        }
    }
};