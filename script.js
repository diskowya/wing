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
    }
    draw() {
        
    }
}


borders = []
b = [100, 100, 200, 400]
borders.push(b)

var angle = 0;
function main(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dAngle = dt
    angle -= rightInput ? dAngle : 0;
    angle += leftInput ? dAngle : 0;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(canvasWidth/2 - 10*Math.sin(angle), canvasHeight/2 - 10*Math.cos(angle));
    ctx.lineTo(canvasWidth/2 - 50*Math.sin(angle), canvasHeight/2 - 50*Math.cos(angle));
    ctx.stroke()
}

lastTime = 0;
function loop(time) {
    const dt =  Math.min((time - lastTime), 16) / 1000;
    lastTime = time;
    main(dt);
    requestAnimationFrame(loop);
}
loop();