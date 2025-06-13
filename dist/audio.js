import NOTES from "./notes.js";
class Synth {
    constructor(ctx) {
        this.CURRENT_OCTAVE = 4;
        this.isContextValid = () => {
            return !(this.ctx === undefined);
        };
        this.setAudioContext = (ctx) => {
            this.ctx = ctx;
            this.out = this.ctx.destination;
            this.filter = {
                node: this.ctx.createBiquadFilter(),
                envelope: {
                    attack: 0,
                    decay: 0,
                    sustain: 1,
                    release: 0
                },
                contour: 0
            };
            this.filter.node.type = "lowpass";
            this.globalVolume = this.createGain([this.filter.node], this.out, 1);
        };
        this.update = (controls) => {
            this.osc1Type = controls.osc1Type.value;
        };
        this.play = (note, octave) => {
            if (!this.ctx || !this.out || !this.filter)
                throw new Error("Audio context not set");
            // TODO:Update ui and internal values to be insync before playing
            let currentOctave = octave || this.CURRENT_OCTAVE;
            if (currentOctave > 7)
                currentOctave = 7;
            if (currentOctave < 1)
                currentOctave = 1;
            const osc1 = this.createOsc(this.osc1Type, NOTES[currentOctave][note]);
            const osc2 = this.createOsc(this.osc2Type, NOTES[currentOctave][note], this.osc2Cents);
            // const nextNote = 
            // osc2.detune.value = NOTES[this.CURRENT_OCTAVE][note]-
            const directionNote = this.osc2Cents > 0 ? this.getNextNote(note) :
                this.osc2Cents < 0 ? this.getPrevNote(note) :
                    note;
            const directionOctave = directionNote == "C" && this.osc2Cents > 0 ? 1 :
                directionNote == "B" && this.osc2Cents < 0 ? -1 : 0;
            osc2.detune.value = (NOTES[this.CURRENT_OCTAVE + directionOctave][directionNote] - NOTES[this.CURRENT_OCTAVE][note]) * this.osc2Cents;
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
            this.PLAYING[`${note}${currentOctave}`] = { osc: [osc1, osc2], gain: [gain1, gain2], playing: true };
            osc1.start();
            osc2.start();
            this.setGainEnvelopeEnter(gain1, 1 - this.oscMix);
            this.setGainEnvelopeEnter(gain2, this.oscMix);
        };
        this.stop = (note, octave) => {
            let currentOctave = octave || this.CURRENT_OCTAVE;
            if (currentOctave > 7)
                currentOctave = 7;
            if (currentOctave < 1)
                currentOctave = 1;
            const key = `${note}${currentOctave}`;
            this.PLAYING[key].playing = false;
            const { gain } = this.PLAYING[key];
            this.setGainEnvelopExit(gain[0]);
            this.setGainEnvelopExit(gain[1]);
            delete this.PLAYING[key];
        };
        this.createOsc = (type, frequency, detune) => {
            var _a;
            if (!this.ctx) {
                throw new Error("Audio context not set");
            }
            const osc = (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.createOscillator();
            osc.type = type;
            osc.frequency.value = frequency;
            osc.detune.value = detune || 0;
            return osc;
        };
        this.createGain = (prevNodes, nextNode, startingVolume) => {
            if (!this.ctx || !this.out)
                throw new Error("Audio context not set");
            const gain = this.ctx.createGain();
            gain.gain.value = startingVolume || 0;
            for (const node in prevNodes) {
                prevNodes[node].connect(gain);
            }
            gain.connect(nextNode);
            return gain;
        };
        this.setGainEnvelopeEnter = (gain, scale = 1) => {
            if (!this.ctx)
                throw new Error("Audio context not set");
            const { currentTime } = this.ctx;
            gain.gain.cancelScheduledValues(currentTime);
            gain.gain.setValueAtTime(0, currentTime);
            const attackEnd = currentTime + (this.envelope.attack * this.MAX_ENV_TIME);
            const decayEnd = (this.envelope.decay * this.MAX_ENV_TIME);
            gain.gain.linearRampToValueAtTime(1 * scale, attackEnd);
            gain.gain.setTargetAtTime(this.envelope.sustain * scale, attackEnd, decayEnd);
        };
        this.setGainEnvelopExit = (gain) => {
            if (!this.ctx)
                throw new Error("Audio context not set");
            const { currentTime } = this.ctx;
            const currentGainValue = gain.gain.value;
            gain.gain.cancelScheduledValues(currentTime);
            gain.gain.setValueAtTime(currentGainValue, currentTime);
            const release = this.envelope.release || 0;
            const releaseEnd = currentTime + (release * this.MAX_ENV_TIME);
            gain.gain.linearRampToValueAtTime(0, releaseEnd);
        };
        this.getNextNote = (note) => {
            let res;
            switch (note) {
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
        };
        this.getPrevNote = (note) => {
            let res = "C";
            switch (note) {
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
        };
        // KEYBOARD
        this.getCurrentOctave = () => {
            return this.CURRENT_OCTAVE;
        };
        this.setCurrentOctave = (octave) => {
            const value = octave > 7 ? 7 :
                octave < 1 ? 1 : octave;
            this.CURRENT_OCTAVE = value;
            console.log("New Current Octave: ", value);
        };
        // OSCILLATORS
        this.setOscMix = (mix) => {
            this.oscMix = mix;
            console.log("New Osc type: ", mix);
        };
        this.setOsc1Type = (type) => {
            this.osc1Type = this.numToOscType(type);
            console.log("New Osc type: ", type);
        };
        this.setOsc2Type = (type) => {
            this.osc2Type = this.numToOscType(type);
            console.log("New Osc type: ", type);
        };
        this.setOsc2Octave = (value) => {
            // this.osc2Octave = value;
            // console.log("New Osc type: ", value);
        };
        this.setOsc2Semi = (semi) => {
            // this.osc2Semi = semi;
            // console.log("New Osc type: ", semi);
        };
        this.setOsc2Cents = (cents) => {
            this.osc2Cents = cents;
            console.log("New Osc type: ", cents);
        };
        // ENVELOPE
        this.setAttack = (value) => {
            if (value > 1)
                value = 1;
            if (value < 0)
                value = 0;
            this.envelope.attack = value;
            console.log("New Attack Vlue: ", value);
        };
        this.setDecay = (value) => {
            if (value > 1)
                value = 1;
            if (value < 0)
                value = 0;
            this.envelope.decay = value;
            console.log("New Decay Vlue: ", value);
        };
        this.setSustain = (value) => {
            if (value > 1)
                value = 1;
            if (value < 0)
                value = 0;
            this.envelope.sustain = value;
            console.log("New Sustain Vlue: ", value);
        };
        this.setRelease = (value) => {
            if (value > 1)
                value = 1;
            if (value < 0)
                value = 0;
            this.envelope.release = value;
            console.log("New Release Vlue: ", value);
        };
        // FILTERS
        this.setFilterType = (type) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            this.filter.node.type = this.numToFilterType(type);
            console.log("New Filter Type: ", type);
        };
        this.setFilterFreq = (freq) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            // const newValue = this.LOG_BASE**freq;
            // const newValue = Math.log10(freq)/Math.log10(1.003);
            this.filter.node.frequency.value = freq;
            console.log("New Filter Freq Vlue: ", freq);
        };
        this.setFilterQ = (value) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            this.filter.node.Q.value = value;
            console.log("New Filter Q Vlue: ", value);
        };
        this.setFilterGain = (value) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            this.filter.node.gain.value = value;
            console.log("New Filter Gain Vlue: ", value);
        };
        this.setFilterAttack = (value) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            this.filter.envelope.attack = value;
            console.log("New Filter Attack Vlue: ", value);
        };
        this.setFilterDecay = (value) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            this.filter.envelope.decay = value;
            console.log("New Filter Decay Vlue: ", value);
        };
        this.setFilterSustain = (value) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            this.filter.envelope.sustain = value;
            console.log("New Filter Sustain Vlue: ", value);
        };
        this.setFilterContour = (value) => {
            if (!this.filter)
                throw new Error("Audio context not set");
            this.filter.contour = value;
            console.log("New Filter Contour Vlue: ", value);
        };
        this.setVolume = (value) => {
            if (!this.globalVolume)
                throw new Error("Audio context not set");
            this.globalVolume.gain.value = value;
            console.log("New volume: ", value);
        };
        this.numToFilterType = (number) => {
            return ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"][number];
        };
        this.numToOscType = (number) => {
            return ["sine", "triangle", "square", "sawtooth"][number];
        };
        this.ctx = ctx;
        this.filter = undefined;
        this.envelope = {
            attack: 0.2,
            decay: 1,
            sustain: 0.2,
            release: 0.2
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
}
export default Synth;
