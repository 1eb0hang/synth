

class Log{
    private minPos:number;
    private maxPos:number;
    private minVal:number;
    private maxVal:number;
    private scale:number;
    constructor(
        minPos?:number,
        maxPos?:number,
        minVal?:number,
        maxVal?:number
    ){
        this.minPos = minPos || 1;
        this.maxPos = maxPos || 100;
        this.minVal = Math.log(minVal || 200);
        this.maxVal = Math.log(maxVal || 15000);

        this.scale = (this.maxVal - this.minVal) / (this.maxPos - this.minPos);
    }

    readonly value = (psoition:number)=>{
        // return Math.exp((psoition - this.minPos) * this.scale + this.minVal);
        return 2.718**((psoition - this.minPos) * this.scale + this.minVal);
    }

    readonly position = (value:number)=>{
        // return this.minPos + (Math.log(value) - this.minVal) / this.scale;
        return this.minPos + (Math.log(value) - this.minVal) / this.scale;
    }
}

export default Log;