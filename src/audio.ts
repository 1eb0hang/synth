import NOTES from "./notes.js";

interface Envelope{
    attack:number;
    decay:number;
    sustain:number;
    release:number;
}

interface Osc{
    osc:OscillatorNode;
    gain:GainNode
}

interface Filter{
    node:BiquadFilterNode;
    envelope:Envelope;
}

class Audio{
    private ctx:AudioContext|undefined;
    private out:AudioDestinationNode|undefined;
    private readonly filter:Filter|undefined;
    private oscType:OscillatorType;
    private readonly envelope:Envelope;
    private readonly MAX_ENV_TIME:number;

    private readonly PLAYING:{[index:string]:
        {osc:OscillatorNode, gain:GainNode, playing:boolean}
    }; 

    constructor(ctx?:AudioContext){
        this.ctx = ctx;
        
        this.envelope = {
            attack:0.2,
            decay:1,
            sustain:0.2,
            release:0.2
        };

        this.oscType = "sine";
        this.PLAYING = {};
        this.MAX_ENV_TIME = 2;
        if(!ctx) return;
    }

    readonly isContextValid = ()=>{
        return !(this.ctx === undefined);
    }

    readonly setOscType = (type:OscillatorType)=>{
        this.oscType = type;
    }

    // readonly setFilterResonance()

    readonly setAttack = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.attack = value;
        console.log(value);
    }

    readonly setDecay = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.decay = value;
        console.log(value);
    }

    readonly setSustain = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.sustain = value;
        console.log(value);
    }

    readonly setRelease = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.release = value;
        console.log(value);
    }

    readonly setAudioContext = (ctx:AudioContext)=>{
        this.ctx = ctx;
        this.out = this.ctx.destination;
    }

    readonly play = (note:string):void=>{
        if(!this.ctx || ! this.out) throw new Error("Audio context not set");

        const osc = this.createOsc(this.oscType, NOTES[4][note]);
        const gain = this.createGain(osc, this.out, 0);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        
        this.PLAYING[note] = {osc:osc, gain:gain, playing:true};

        osc.start();
        this.setGainEnvelopeEnter(gain);
    }

    readonly stop = (note:string):void =>{
        this.PLAYING[note].playing = false;
        const {gain} = this.PLAYING[note];
        this.setGainEnvelopExit(gain);
        delete this.PLAYING[note];
    }

    private readonly createOsc = (type:OscillatorType, frequency:number, detune?:number):OscillatorNode=>{
        if (!this.ctx){
            throw new Error("Audio context not set");
        }
        const osc = this.ctx?.createOscillator();
        osc.type = type;
        osc.frequency.value = frequency;
        osc.detune.value = detune || 0;
        return osc;
    }

    private readonly createGain = (prevNode:AudioNode, nextNode:AudioNode, startingVolume?:number):GainNode=>{
        if(!this.ctx || !this.out) throw new Error("Audio context not set");
        
        const gain = this.ctx.createGain();
        gain.gain.value = startingVolume||0;
        prevNode.connect(gain);

        gain.connect(nextNode);

        return gain;
    }

    private readonly setGainEnvelopeEnter = (gain:GainNode)=>{
        if(!this.ctx) throw new Error("Audio context not set");
        
        const {currentTime} = this.ctx;
        gain.gain.cancelScheduledValues(currentTime);
        gain.gain.setValueAtTime(0, currentTime);

        const attackEnd = currentTime+(this.envelope.attack * this.MAX_ENV_TIME);
        const decayEnd = (this.envelope.decay * this.MAX_ENV_TIME);

        gain.gain.linearRampToValueAtTime(1,attackEnd);
        gain.gain.setTargetAtTime(this.envelope.sustain, attackEnd, decayEnd);
    }

    private readonly setGainEnvelopExit = (gain:GainNode)=>{
        if(!this.ctx) throw new Error("Audio context not set");

        const {currentTime} = this.ctx;
        const currentGainValue = gain.gain.value;

        gain.gain.cancelScheduledValues(currentTime);
        gain.gain.setValueAtTime(currentGainValue, currentTime);

        const releaseEnd = currentTime + (this.envelope.release*this.MAX_ENV_TIME);

        gain.gain.linearRampToValueAtTime(0, releaseEnd);
    }
}

export default Audio