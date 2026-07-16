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
        this.x = canvasWidth/2;
        this.y = canvasHeight/2;
        this.vx = 0;
        this.vy = 0;
        this.dAlpha = 0;
        this.alpha = 0;
        this.thrust = 4;
        this.speed_limit = 10;
        this.rightInput = false;
        this.leftInput = false;
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") this.rightInput = true;
            if (e.key === "ArrowLeft") this.leftInput = true;
        });
        document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowRight") this.rightInput = false;
            if (e.key === "ArrowLeft") this.leftInput = false;
        });
        //document.addEventListener("keydown", (e) => {
        //    if (e["key"] == " ") {
        //        particles.push(new Particle(canvasWidth/2, canvasHeight/2, 10*Math.sin(this.alpha), 10*Math.cos(this.alpha)));
        //    }
        //})
    }
    step(dt) {
        dt = !isNaN(dt) ? dt : 0;

        if (this.leftInput && this.dAlpha < 15) this.dAlpha += 1;
        if (this.rightInput && this.dAlpha > -15) this.dAlpha -= 1;
        if (!this.leftInput && !this.rightInput) {
            this.dAlpha += this.dAlpha > 0 ? -1 : this.dAlpha < 0 ? 1 : 0;
        };
        this.alpha += 0.3*this.dAlpha*dt;
        
        if (this.vx < this.speed_limit) this.vx -= this.thrust*Math.sin(this.alpha) * dt;
        if (this.vx < this.speed_limit)this.vy -= this.thrust*Math.cos(this.alpha) * dt;
        this.x += this.vx;
        this.y += this.vy;

    }
    draw() {
        const x = this.x;
        const y = this.y;
        const alpha = this.alpha;
        const scale = 6;

        ctx.beginPath();
        ctx.arc(x, y, 0.8*scale, Math.PI - alpha, -alpha);
        ctx.lineTo(x + 2*scale*Math.cos(alpha) , y - 2*scale*Math.sin(alpha));
        ctx.lineTo(x - 5*scale*Math.sin(alpha), y - 5*scale*Math.cos(alpha));
        ctx.lineTo(x - 2*scale*Math.cos(alpha), y + 2*scale*Math.sin(alpha));
        ctx.lineTo(x - 0.8*scale*Math.cos(alpha), y + 0.8*scale*Math.sin(alpha));
        ctx.fill();
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

        var border = borders[0];
        const dx = border.x2 - border.x1
        const dy = border.y2 - border.y1
        var t = ((this.x - border.x1)*dx + (this.y - border.y1)*dy) / (dx*dx + dy*dy)
        console.log(t);
        t = Math.max(0, Math.min(1, t))
        var closest_x = border.x1 + t*dx;
        var closest_y = border.y1 + t*dy;

        ctx.beginPath();
        ctx.arc(closest_x, closest_y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
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

player = new Player()
function main(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.step(dt)
    player.draw()
    for (var b of borders) {
        b.draw()
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