const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cos = Math.cos;
const sin = Math.sin;
const PI = Math.PI;

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
        this.alpha = 0;
        this.radius = 10;
        this.dAlpha = 0;
        this.thrust = 1;
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
        if (this.vx < this.speed_limit) this.vy -= this.thrust*Math.cos(this.alpha) * dt;

        const collision = borders[0].check_collision(this.x, this.y, 10)
        if (collision) {
            [this.vx, this.vy] = this.perform_collision(collision[0], collision[1], this.vx, this.vy);
        }

        this.x += this.vx;
        this.y += this.vy;

    }
    perform_collision(l_x_norm, l_y_norm, vx, vy) {
        const v_b_x = l_x_norm*vx + l_y_norm*vy;
        const v_b_y = l_y_norm*vx - l_x_norm*vy;
        const vx_c = l_x_norm*v_b_x - l_y_norm*v_b_y;
        const vy_c = l_y_norm*v_b_x + l_x_norm*v_b_y;
        return [vx_c, vy_c];
    }
    draw() {
        const x = this.x;
        const y = this.y;
        const a = this.alpha;
        const s = 6;
        const c = 1.5;

        const s_sin_a = s*sin(a);
        const s_cos_a = s*cos(a);
        const s_c_sin_a = c*s_sin_a;
        const s_c_cos_a = c*s_cos_a;

        ctx.beginPath();
        ctx.arc(x + s_c_sin_a, y + s_c_cos_a, 0.8*s, PI - a, -a);
        ctx.lineTo(x + 2*s_cos_a + s_c_sin_a, y - 2*s_sin_a + s_c_cos_a);
        ctx.lineTo(x - 5*s_sin_a + s_c_sin_a, y - 5*s_cos_a + s_c_cos_a);
        ctx.lineTo(x - 2*s_cos_a + s_c_sin_a, y + 2*s_sin_a + s_c_cos_a);
        ctx.lineTo(x - 0.8*s_cos_a + s_c_sin_a, y + 0.8*s_sin_a + s_c_cos_a);
        ctx.fill();
    }
}

class Border {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.l_x = this.x2 - this.x1;
        this.l_y = this.y2 - this.y1;
        this.length = Math.sqrt(this.l_x*this.l_x + this.l_y*this.l_y);
        this.l_x_norm = this.l_x / this.length;
        this.l_y_norm = this.l_y / this.length;
    }
    check_collision(x, y, threshold) {
        const p_x = x - this.x1;
        const p_y = y - this.y1;
        var t = (p_x*this.l_x + p_y*this.l_y) / (this.l_x*this.l_x + this.l_y*this.l_y);
        t = Math.max(0, Math.min(1, t));
        const p_l_x = this.x1 + t*this.l_x; 
        const p_l_y = this.y1 + t*this.l_y; 
        const dx = x - p_l_x;
        const dy = y - p_l_y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist > threshold) return false;
        if (0 < t && t < 1) return [this.l_x_norm, this.l_y_norm];
        
        if (t == 0) {
            return [p_y/dist, -p_x/dist]
        }

        if (t == 1) {
            const p_x_2 = x - this.x2;
            const p_y_2 = y - this.y2;
            return [p_y_2/dist, -p_x_2/dist]
        }

    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
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