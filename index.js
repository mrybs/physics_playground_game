const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const status = document.getElementById('status')


let physical_objects = []
let ticking = true


function windowToCanvas(cnvs, x, y) {
    let bbox = cnvs.getBoundingClientRect();
    return { x: x - bbox.left * (cnvs.width / bbox.width),
        y: y - bbox.top * (cnvs.height / bbox.height)
    };
}


function render(){
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height

    ctx.beginPath()
    for(let y = document.settings.gridSize; y <= canvas.height; y += document.settings.gridSize){
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        /*for(let i = 0; i <= canvas.width; i++){
            let pos = new V2(i, y)
            /*physical_objects.forEach(opo => {
                let dir_accel = pos.norm_dir(opo.pos)
                let abs_accel = 0
                if(pos.dst(opo.pos) != 0) abs_accel = G*opo.mass/(pos.dst(opo.pos))**2
                pos = pos.sum(dir_accel.mul(abs_accel))
            })
            let pixel = ctx.createImageData(1, 1)
            pixel[0] = 255
            pixel[1] = 255
            pixel[2] = 255
            pixel[3] = 255
            ctx.putImageData(pixel, pos.x, pos.y)
        }*/
    }
    for(let x = document.settings.gridSize; x <= canvas.width; x += document.settings.gridSize){
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
    }
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = document.settings.theme.background
    ctx.fill()
    ctx.strokeStyle = document.settings.theme.foreground
    ctx.stroke()
    ctx.closePath()
    physical_objects.forEach(po => {
        ctx.beginPath()
        ctx.fillStyle = '#ffffed5f'
        ctx.ellipse(po.pos.x, po.pos.y, po.radius, po.radius, 0, 0, Math.PI*2)
        ctx.fill()
    })
}

function tick(){
    if(!ticking) return render()
    let physical_objects_new = []
    physical_objects.forEach(_spo => {
        let spo = new PhysicalObject(_spo.pos, _spo.vel, _spo.mass, _spo.radius)
        physical_objects.forEach(opo => {
            /*let dir_accel = spo.pos.norm_dir(opo.pos)
            let abs_accel = 0
            if(spo.pos.dst(opo.pos) != 0) abs_accel = G*opo.mass/(spo.pos.dst(opo.pos))**2
            spo.vel = spo.vel.sum(dir_accel.mul(abs_accel))
            
            if(spo.pos.sum(spo.vel).dst(opo.pos) < spo.radius+opo.radius){
                let dir_naccel = dir_accel.neg()
                let abs_naccel = 0
                if(spo.pos.dst(opo.pos) != 0) abs_naccel = G*opo.mass/(spo.pos.dst(opo.pos))**1.8
                spo.vel = spo.vel.sum(dir_naccel.mul(abs_naccel))
            }*/
            if(spo.pos.sum(spo.vel).dst(opo.pos) >= spo.radius+opo.radius){
                let dir_accel = spo.pos.norm_dir(opo.pos)
                let abs_accel = 0
                if(spo.pos.dst(opo.pos) != 0) abs_accel = G*opo.mass/(spo.pos.dst(opo.pos))**2
                spo.vel = spo.vel.sum(dir_accel.mul(abs_accel))
            }/*else{
                let dir_naccel = spo.pos.norm_dir(opo.pos).neg()
                let abs_naccel = 0
                if(spo.pos.dst(opo.pos) != 0) abs_naccel = (G+10e-11)*opo.mass/(spo.pos.dst(opo.pos))**2
                spo.vel = spo.vel.sum(dir_naccel.mul(abs_naccel))
            }*/
        })
        spo.pos = spo.pos.sum(spo.vel)
        physical_objects_new.push(spo)
    })
    physical_objects = physical_objects_new
    render()
}

window.addEventListener('resize', render);
window.addEventListener('click', function (event) {
    let {x, y} = windowToCanvas(canvas, event.x, event.y)
    console.log(x, y)
    physical_objects.push(new PhysicalObject(new V2(x, y), new V2(), 1e12, 15))
    render()
})
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault(); 
        ticking = !ticking
        if(ticking){
            status.innerText = ''
        }else{
            status.innerText = 'на паузе'
        }
        console.log('ticking', ticking)
    }
});

render()

setInterval(tick, 4)