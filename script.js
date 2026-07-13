const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var canvasWidth, canvasHeight; 
function resizeCanvas() {
    const canv = document.getElementById("canvas");
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}
addEventListener("resize", (event) => resizeCanvas());
resizeCanvas();

class Player {
    constructor() {
        this.alpha = 0;
        this.size
        this.rightInput = false;
        this.leftInput = false;
        document.addEventListener("keydown", (e) => {
            if (e["key"] == "ArrowRight") this.rightInput = true;
            if (e["key"] == "ArrowLeft") this.leftInput = true;
        })
        document.addEventListener("keyup", (e) => {
            if (e["key"] == "ArrowRight") this.rightInput = false;
            if (e["key"] == "ArrowLeft") this.leftInput = false;
        })
        document.addEventListener("keydown", (e) => {
            if (e["key"] == " ") {
                particles.push(new Particle(canvasWidth/2, canvasHeight/2, 10*Math.sin(this.alpha), 10*Math.cos(this.alpha)));
            }
        })
    }
    step(dt) {
        this.dAlpha = dt
        this.alpha -= this.rightInput ? this.dAlpha : 0;
        this.alpha += this.leftInput ? this.dAlpha : 0;
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(canvasWidth/2 - 10*Math.sin(this.alpha), canvasHeight/2 - 10*Math.cos(this.alpha));
        ctx.lineTo(canvasWidth/2 - 50*Math.sin(this.alpha), canvasHeight/2 - 50*Math.cos(this.alpha));
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = 2;
    }
    step(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        var cl = this.getClosestPointOnBorder(borders[0])
        ctx.beginPath();
        ctx.arc(cl[0], cl[1], this.size, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
    }
    getClosestPointOnBorder(border) {
        const dx = border.x2 - border.x1
        const dy = border.y2 - border.y1
        var t = ((this.x - border.x1)*dx + (this.y - border.y1)*dy) / (dx*dx + dy*dy)
        t = Math.max(0, Math.min(1, t))
        return [border.x1 + t*dx, border.y1 + t*dy]
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    }
}

class Border {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}


borders = [new Border(canvasWidth/2 -100, canvasHeight/2 +100, canvasWidth/2 +100, canvasHeight/2 + 50)]
particles = []

player = new Player()
function main(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.step(dt)
    player.draw()
    for (var b of borders) {
        b.draw()
    }
    for (var p of particles) {
        p.step(dt) 
        p.draw()
    }
}

lastTime = 0;
function loop(time) {
    const dt =  Math.min((time - lastTime), 16) / 1000;
    lastTime = time;
    main(dt);
    requestAnimationFrame(loop);
}
loop();