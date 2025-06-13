import NOTES from "./notes.js";
import Log from "./temp/log.js";

interface Envelope{
    attack:number;
    decay:number;
    sustain:number;
    release?:number;
}

interface Osc{
    osc:OscillatorNode;
    gain:GainNode
}

interface Filter{
    node:BiquadFilterNode;
    envelope:Envelope;
    contour:number
}

interface Settings{

    volume:number
}

type PlayingList = {
    [index:string]:{
        osc:OscillatorNode, 
        gain:GainNode, 
        playing:boolean
    }
}

class Synth{
    // TODO: audio context not set error
    private ctx:AudioContext|undefined;
    private out:AudioDestinationNode|undefined;

    private osc1Type:OscillatorType;
    // private osc2Type:OscillatorType;
    // private osc2Octave:number;
    
    private filter:Filter|undefined;
    private readonly envelope:Envelope;

    private globalVolume:GainNode|undefined
    private readonly MAX_ENV_TIME:number;

    private readonly PLAYING:PlayingList; 

    constructor(ctx?:AudioContext){
        this.ctx = ctx;
        this.filter = undefined;

        this.envelope = {
            attack:0.2,
            decay:1,
            sustain:0.2,
            release:0.2
        };

        this.osc1Type = "square";
        this.PLAYING = {};
        this.MAX_ENV_TIME = 2;
    }

    readonly isContextValid = ()=>{
        return !(this.ctx === undefined);
    }

    readonly setAudioContext = (ctx:AudioContext)=>{
        this.ctx = ctx;
        this.out = this.ctx.destination;
        this.filter = {
            node:this.ctx.createBiquadFilter(),
            envelope:{
                attack:0,
                decay:0,
                sustain:1,
                release:0
            },
            contour:0
        };
        this.filter.node.type = "lowpass";
        this.globalVolume = this.createGain(this.filter.node, this.out, 1);
    }

    readonly play = (note:string):void=>{
        if(!this.ctx || ! this.out || !this.filter) throw new Error("Audio context not set");

        // TODO:Update ui and internal values to be insync before playing
        const osc = this.createOsc(this.osc1Type, NOTES[4][note]);
        const gain = this.createGain(osc, this.filter.node, 0);
        // const gain = this.createGain(osc, this.out, 0);
        
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

        const release = this.envelope.release || 0
        const releaseEnd = currentTime + (release*this.MAX_ENV_TIME);

        gain.gain.linearRampToValueAtTime(0, releaseEnd);
    }

    // OSCILLATORS
    readonly setOsc1Type = (type:OscillatorType)=>{
        this.osc1Type = type;
        console.log("New Osc type: ", type);
    }

    // ENVELOPE
    readonly setAttack = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.attack = value;
        console.log("New Attack Vlue: ",value);
    }

    readonly setDecay = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.decay = value;
        console.log("New Decay Vlue: ",value);
    }

    readonly setSustain = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.sustain = value;
        console.log("New Sustain Vlue: ",value);
    }

    readonly setRelease = (value:number)=>{
        if(value>1) value = 1;
        if(value<0) value = 0;

        this.envelope.release = value;
        console.log("New Release Vlue: ",value);
    }

    // FILTERS
    readonly setFilterType =(type:BiquadFilterType)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.node.type = type;
        console.log("New Filter Type: ",type)
    }

    readonly setFilterFreq =(freq:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        // const newValue = this.LOG_BASE**freq;
        // const newValue = Math.log10(freq)/Math.log10(1.003);
        this.filter.node.frequency.value = freq;
        console.log("New Filter Freq Vlue: ",freq);
    }

    readonly setFilterQ =(value:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.node.Q.value = value;
        console.log("New Filter Q Vlue: ",value);
    }

    readonly setFilterGain =(value:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.node.gain.value = value;
        console.log("New Filter Gain Vlue: ",value);
    }

    readonly setFilterAttack =(value:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.envelope.attack = value;
        console.log("New Filter Attack Vlue: ",value);
    }

    readonly setFilterDecay =(value:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.envelope.decay = value;
        console.log("New Filter Decay Vlue: ",value);
    }

    readonly setFilterSustain =(value:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.envelope.sustain = value;
        console.log("New Filter Sustain Vlue: ",value);
    }

    readonly setFilterContour =(value:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.contour = value;
        console.log("New Filter Contour Vlue: ",value);
    }

    readonly setVolume=(value:number)=>{
        if(!this.globalVolume) throw new Error("Audio context not set");

        this.globalVolume.gain.value = value;
        console.log("New volume: ",value);
    }
}

export default Synth