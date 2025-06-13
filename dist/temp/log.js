class Log {
    constructor(minPos, maxPos, minVal, maxVal) {
        this.value = (psoition) => {
            // return Math.exp((psoition - this.minPos) * this.scale + this.minVal);
            return 2.718 ** ((psoition - this.minPos) * this.scale + this.minVal);
        };
        this.position = (value) => {
            // return this.minPos + (Math.log(value) - this.minVal) / this.scale;
            return this.minPos + (Math.log(value) - this.minVal) / this.scale;
        };
        this.minPos = minPos || 1;
        this.maxPos = maxPos || 100;
        this.minVal = Math.log(minVal || 200);
        this.maxVal = Math.log(maxVal || 15000);
        this.scale = (this.maxVal - this.minVal) / (this.maxPos - this.minPos);
    }
}
export default Log;
