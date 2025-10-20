class V2{
    constructor(x=0, y=0){
        this.x = x
        this.y = y
    }

    dst(vec){
        return Math.sqrt(Math.abs(this.x-vec.x)**2 + Math.abs(this.y-vec.y)**2)
    }

    sum(vec){
        return new V2(this.x+vec.x, this.y+vec.y)
    }

    mul(abs){
        return new V2(this.x*abs, this.y*abs)
    }

    neg(){
        return new V2(-this.x, -this.y)
    }

    norm_dir(vec){
        let d = this.dst(vec)
        if(d == 0){
            return new V2()
        }
        return new V2((vec.x-this.x)/d, (vec.y-this.y)/d)
    }
}