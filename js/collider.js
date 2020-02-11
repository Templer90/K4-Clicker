g.collider = g.c = {};
g.collider.borders=[];
g.collider.createHolder = function (x, y, radius) {
    return {
        selected: false,
        emmiter: null,
        x, y,
        radius,
        addEmmiter: function (e) {
            this.emmiter = e;
        },
        draw: function (ctx) {
            ctx.fillStyle = "rgba(141,255,40,0.1)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        },
        selectDraw: function (ctx) {
            this.draw(ctx);
            this.emmiter.selectDraw(ctx);
        },
        whileDrag: function (ctx) {
            this.emmiter.selectDraw(ctx);
        }
    };
};
g.collider.createEmmiter = function (x, y, radius, angle) {
    return {
        dir: undefined,
        x, y,
        angle,
        radius,
        
        length:1000,
        xEnd:-10,
        yEnd:-10,
        connectedEmmiter:null,
        addDir: function (d) {
            this.dir = d;
        },
        getRay: function(){
            return {x1: this.x, y1: this.y, x2: this.xEnd, y2: this.yEnd};
        },
        calcTrajectory: function (other) {
            let max = g.collider.length(this.x, this.y,this.xEnd, this.yEnd);
            let e = g.collider.intersect(this.x, this.y, this.xEnd, this.yEnd, other.x, other.y, other.xEnd, other.yEnd);
            if (e !== undefined) {
                let len = g.collider.length(this.xEnd, this.yEnd, e.x, e.y);
                if (len <= max) {
                    this.xEnd = e.x;
                    this.yEnd = e.y;
                    other.xEnd = e.x;
                    other.yEnd = e.y;

                    
                    other.connectedEmmiter = this;
                    this.connectedEmmiter = other;
                }
            }
        },
        calcTrajectoryBoundary: function (list) {
            this.connectedEmmiter=null;
            if (this.dir !== undefined) {
                this.angle = Math.atan2(this.dir.x - this.x, this.dir.y - this.y);
            }
            this.xEnd = this.x + Math.sin(this.angle) * this.length;
            this.yEnd = this.y + Math.cos(this.angle) * this.length;

            let max = Infinity;
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
                        this.connectedEmmiter=this;
                    }
                }
            }
        },
        draw: function (ctx) {
            if (this.selected) {
                ctx.fillStyle = "rgba(255,45,75,0.6)";
            } else {
                ctx.fillStyle = "rgba(0,255,255,0.1)";
            }
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.xEnd, this.yEnd);
            
            ctx.stroke();
        },
        selectDraw: function (ctx) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "rgba(0,255,255,0.1)";
            this.draw(ctx);
            ctx.fill();

            ctx.moveTo(this.xEnd, this.yEnd);
            ctx.beginPath();
            ctx.arc(this.xEnd, this.yEnd, this.radius, 0, Math.PI * 2);
            ctx.stroke();

        },
        whileDrag: function (ctx) {

        }
    };
};
g.collider.intersect = function (x1, y1, x2, y2,
                                 x3, y3, x4, y4) {
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) {
        return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
        const pt = {};
        pt.x = x1 + t * (x2 - x1);
        pt.y = y1 + t * (y2 - y1);
        return pt;
    }
};
g.collider.length = function (x1, y1, x2, y2) {
    let a=x1-x2;
    let b=y1-y2;
    return Math.sqrt(a*a+b*b);
};
g.collider.circles = {
    drawables : [],
    emmmiter : [],
    each(callback){  // iterator
        for(let i = 0; i < this.drawables.length; i++){
            callback(this.drawables[i],i);
        }
    },
    draw(ctx){
        this.each(c => {
            c.draw(ctx);
        })
    },
    calcTrajectory() {
        for (let i = 0; i < this.emmmiter.length; i++) {
            this.emmmiter[i].calcTrajectoryBoundary(g.collider.borders);
        }
        let k=0;
        for (k = 0; k < 10; k++) {
            for (let i = 0; i < this.emmmiter.length; i++) {
                for (let j = 0; j < this.emmmiter.length; j++) {
                    if (i !== j) {
                        this.emmmiter[i].calcTrajectory(this.emmmiter[j]);
                    }
                }
            }

            let repeat = false;
            for (let i = 0; i < this.emmmiter.length; i++) {
                if ((this.emmmiter[i].connectedEmmiter !== null) &&(this.emmmiter[i].connectedEmmiter.connectedEmmiter!==null)) {
                    if (this.emmmiter[i].connectedEmmiter.connectedEmmiter !== this.emmmiter[i]) {
                        this.emmmiter[i].calcTrajectoryBoundary(g.collider.borders);
                        repeat = true;
                    }
                }
            }
            if (repeat === false) break;
        }
        console.log(k);
    },
    addEmmitter(x, y, radius, angle) {
        let emmiter = g.collider.createEmmiter(x, y, radius, angle);
        let holder = g.collider.createHolder(x + 13, y + 13, 8);

        emmiter.addDir(holder);
        holder.addEmmiter(emmiter);

        this.drawables.push(emmiter);
        this.emmmiter.push(emmiter);
        this.drawables.push(holder);
        return emmiter;
    },
    getClosest(pos){
        let minDist, i, dist, x, y, foundCircle;
        minDist = Infinity;
        this.each(c =>{
            x = pos.x - c.x;
            y = pos.y - c.y;
            dist = Math.sqrt(x * x + y * y);
            if(dist <= c.radius){
                if(foundCircle === undefined || (foundCircle && c.radius < foundCircle.radius)){
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

    function mainLoop(time){  // this is called 60 times a second if there is no delay
        ctx.clearRect(0,0,canvas.width,canvas.height);
        updateDisplay(); // call  the function that is rendering the display
        // get the next frame
        requestAnimationFrame(mainLoop);
    }
    // request the first frame. It will not start untill all the code below has been run
    requestAnimationFrame(mainLoop);


    let mouse = (function(){
        let bounds;
        let m = {x:0,y:0,button:false};
        function mouseEvent(event){
            bounds = event.currentTarget.getBoundingClientRect();
            m.x = event.pageX - bounds.left + scrollX;
            m.y = event.pageY - bounds.top + scrollY;
            if(event.type === "mousedown"){
                m.button = true;
            }else if(event.type === "mouseup"){
                m.button = false;
            }
        }
        m.start = function(element){
            ["mousemove","mousedown","mouseup"].forEach(eventType => element.addEventListener(eventType, mouseEvent));
        };
        return m;
    }());
    mouse.start(canvas);
    
    
    let dragging = {
        started : false,
        type : null,
        currentObj : null,  // what we are dragging
        startX : 0,
        startY : 0,
        start(type, obj){
            this.startX = mouse.x;
            this.startY = mouse.y;
            this.started = true;
            this.type = type;
            this.currentObj = obj;
            this.currentObj.selected=!this.currentObj.selected;
        }

    };
    
    let cursor = "default";
    let overCircle = null;
    function updateDisplay(){
        let x,y, c;
        cursor = "default";
        if(mouse.x >= 0 && mouse.x < canvas.width && mouse.y >= 0 && mouse.y < canvas.height){
            cursor = "crosshair";
        }
        if(mouse.button){  // the button is down
            if(!dragging.started){
                if(overCircle){
                    dragging.start("move",overCircle);
                    overCircle = null;
                }else{
                    dragging.start("create",g.collider.circles.addEmmitter(mouse.x, mouse.y, 10,Math.PI/4));
                }
            }
            c = dragging.currentObj;
            if(dragging.type === "create"){
                x = c.x - mouse.x;
                y = c.y - mouse.y;
            }else if(dragging.type === "move"){
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
            if(dragging.started){ // have we been dragging something.
                dragging.started = false; // drop it
            }
        }
        ctx.strokeStyle = "black";

        g.collider.circles.calcTrajectory();
        g.collider.circles.draw(ctx);

        if(!dragging.started){
            c = g.collider.circles.getClosest(mouse);
            if(c !== undefined){
                cursor = "move";
                c.selectDraw(ctx);
                overCircle = c;
            }else{
                overCircle = null;
            }
        }
        canvas.style.cursor = cursor;
    }
};
game.collider.update = (event) => {

};