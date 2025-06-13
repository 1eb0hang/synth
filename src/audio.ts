import NOTES, { NoteName } from "./notes.js";
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
        osc:OscillatorNode[], 
        gain:GainNode[],
        playing:boolean
    }
}

class Synth{
    // TODO: audio context not set error
    private ctx:AudioContext|undefined;
    private out:AudioDestinationNode|undefined;

    private CURRENT_OCTAVE = 4;

    private oscMix:number;
    private osc1Type:OscillatorType;
    private osc2Type:OscillatorType;
    private osc2Octave:number;
    private osc2Semi:number;
    private osc2Cents:number;
    
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

        this.oscMix = 0;
        this.osc1Type = "square";
        this.osc2Type = "square";
        this.osc2Octave = 0;
        this.osc2Semi = 0;
        this.osc2Cents = 0;
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
        this.globalVolume = this.createGain([this.filter.node], this.out, 1);
    }

    readonly update=(controls:{[index:string]:HTMLInputElement})=>{
        this.osc1Type = controls.osc1Type.value as OscillatorType;
    }

    readonly play = (note:NoteName, octave?:number):void=>{
        if(!this.ctx || ! this.out || !this.filter) throw new Error("Audio context not set");

        // TODO:Update ui and internal values to be insync before playing
        let currentOct = octave||this.CURRENT_OCTAVE;
        if(currentOct>7)currentOct = 7;
        if(currentOct<1)currentOct = 1;
        const osc1 = this.createOsc(this.osc1Type, NOTES[currentOct][note]);
        const osc2 = this.createOsc(this.osc2Type, NOTES[currentOct][note], this.osc2Cents);
        // const nextNote = 
        // osc2.detune.value = NOTES[this.CURRENT_OCTAVE][note]-

        const directionNote = this.osc2Cents>0?this.getNextNote(note):
                                this.osc2Cents<0?this.getPrevNote(note): 
                                note;
        const directionOctave = directionNote=="C"&&this.osc2Cents>0?1:
                                directionNote=="B"&&this.osc2Cents<0?-1:0;

        osc2.detune.value = (NOTES[this.CURRENT_OCTAVE+directionOctave][directionNote]-NOTES[this.CURRENT_OCTAVE][note])*this.osc2Cents;
        
        // if(this.osc2Cents>0){
        //     osc2.detune.value = (NOTES[this.CURRENT_OCTAVE][this.getNextNote(note)]-NOTES[this.CURRENT_OCTAVE][note])*this.osc2Cents
        // }else if(this.osc2Cents<0){
        //     osc2.detune.value = (NOTES[this.CURRENT_OCTAVE][this.getPrevNote(note)]-NOTES[this.CURRENT_OCTAVE][note])*this.osc2Cents
        // }
        const gain1 = this.createGain([osc1], this.filter.node, 0);
        const gain2 = this.createGain([osc2], this.filter.node, 0);
        // const gain = this.createGain(osc, this.out, 0);
        
        gain1.gain.setValueAtTime(0, this.ctx.currentTime);
        gain2.gain.setValueAtTime(0, this.ctx.currentTime);

        this.PLAYING[note] = {osc:[osc1, osc2], gain:[gain1, gain2], playing:true};

        osc1.start();
        osc2.start();
        this.setGainEnvelopeEnter(gain1, 1-this.oscMix);
        this.setGainEnvelopeEnter(gain2, this.oscMix);
    }

    readonly stop = (note:string):void =>{
        this.PLAYING[note].playing = false;
        const {gain} = this.PLAYING[note];
        
        this.setGainEnvelopExit(gain[0]);
        this.setGainEnvelopExit(gain[1]);
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

    private readonly createGain = (prevNodes:AudioNode[], nextNode:AudioNode, startingVolume?:number):GainNode=>{
        if(!this.ctx || !this.out) throw new Error("Audio context not set");
        
        const gain = this.ctx.createGain();
        gain.gain.value = startingVolume||0;
        
        for (const node in prevNodes){
            prevNodes[node].connect(gain);
        }

        gain.connect(nextNode);

        return gain;
    }

    private readonly setGainEnvelopeEnter = (gain:GainNode, scale = 1)=>{
        if(!this.ctx) throw new Error("Audio context not set");
        
        const {currentTime} = this.ctx;
        gain.gain.cancelScheduledValues(currentTime);
        gain.gain.setValueAtTime(0, currentTime);

        const attackEnd = currentTime+(this.envelope.attack * this.MAX_ENV_TIME);
        const decayEnd = (this.envelope.decay * this.MAX_ENV_TIME);

        gain.gain.linearRampToValueAtTime(1*scale,attackEnd);
        gain.gain.setTargetAtTime(this.envelope.sustain*scale, attackEnd, decayEnd);
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

    private readonly getNextNote = (note:NoteName):NoteName=>{
        let res:NoteName;
        switch(note){
            case "C":
                res = "Db";
                break;

            case "Db":
                res = "D";
                break;

            case "D":
                res = "Eb";
                break;

            case "Eb":
                res = "E";
                break;

            case "E":
                res = "F";
                break;

            case "F":
                res = "Gb";
                break;

            case "Gb":
                res = "G";
                break;

            case "G":
                res = "Ab";
                break;

            case "Ab":
                res = "A";
                break;

            case "A":
                res = "Bb";
                break;

            case "Bb":
                res = "B";
                break;

            default:
                res = "C";
                break;  
        }
        return res;
    }

    private readonly getPrevNote = (note:NoteName):NoteName=>{
        let res:NoteName = "C"
        switch(note){
            case "C":
                res = "B";
                break;
            
            case "Db":
                res = "C";
                break; 

            case "D":
                res = "Db";
                break;

            case "Eb":
                res = "D";
                break;

            case "E":
                res = "Eb";
                break;

            case "F":
                res = "E";
                break;

            case "Gb":
                res = "F";
                break;

            case "G":
                res = "Gb";
                break;

            case "Ab":
                res = "G";
                break;

            case "A":
                res = "Ab";
                break;

            case "Bb":
                res = "A";
                break;

            default:
                res = "Bb";
                break; 
        }
        return res;
    }

    // KEYBOARD
    readonly getCurrentOctave = ()=>{
        return this.CURRENT_OCTAVE;
    }

    readonly setCurrentOctave = (octave:number)=>{
        const value = octave>7?7:
                      octave<1?1:octave;
        this.CURRENT_OCTAVE = value;
        console.log("New Current Octave: ",value);
    }

    // OSCILLATORS
    readonly setOscMix = (mix:number)=>{
        this.oscMix = mix;
        console.log("New Osc type: ", mix);
    }

    readonly setOsc1Type = (type:number)=>{
        this.osc1Type = this.numToOscType(type);
        console.log("New Osc type: ", type);
    }

    readonly setOsc2Type = (type:number)=>{
        this.osc2Type = this.numToOscType(type);
        console.log("New Osc type: ", type);
    }

    readonly setOsc2Octave = (value:number)=>{
        // this.osc2Octave = value;
        // console.log("New Osc type: ", value);
    }

    readonly setOsc2Semi = (semi:number)=>{
        // this.osc2Semi = semi;
        // console.log("New Osc type: ", semi);
    }

    readonly setOsc2Cents = (cents:number)=>{
        this.osc2Cents = cents;
        console.log("New Osc type: ", cents);
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
    readonly setFilterType =(type:number)=>{
        if(!this.filter) throw new Error("Audio context not set");
        this.filter.node.type = this.numToFilterType(type);
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

    private readonly numToFilterType = (number:number)=>{
        return ["lowpass","highpass","bandpass","lowshelf","highshelf","peaking","notch","allpass"][number] as BiquadFilterType;
    }
    
    private readonly numToOscType = (number:number)=>{
        return ["sine","triangle","square","sawtooth"][number] as OscillatorType;
    }
}

export default Synth