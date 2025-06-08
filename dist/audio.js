import notes from "./notes.js";
class Audio {
    constructor(ctx) {
        this.setAudioContext = (ctx) => {
            this.ctx = ctx;
            this.out = this.ctx.destination;
        };
        this.play = (note) => {
            if (!this.ctx || !this.out)
                throw new Error("Audio context not set");
            const osc = this.createOsc("triangle", notes[note]);
            const gain = this.createGain(osc, this.out, 0);
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.PLAYING[note] = { osc: osc, gain: gain, playing: true };
            osc.start();
            this.setGainEnvelopeEnter(gain);
        };
        this.stop = (note) => {
            this.PLAYING[note].playing = false;
            const { gain } = this.PLAYING[note];
            this.setGainEnvelopExit(gain);
            delete this.PLAYING[note];
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
        this.createGain = (prevNode, nextNode, startingVolume) => {
            if (!this.ctx || !this.out)
                throw new Error("Audio context not set");
            const gain = this.ctx.createGain();
            gain.gain.value = startingVolume || 0;
            prevNode.connect(gain);
            gain.connect(nextNode);
            return gain;
        };
        this.setGainEnvelopeEnter = (gain) => {
            if (!this.ctx)
                throw new Error("Audio context not set");
            const { currentTime } = this.ctx;
            gain.gain.cancelScheduledValues(currentTime);
            gain.gain.setValueAtTime(0, currentTime);
            const attackEnd = currentTime + (this.envelope.attack * this.MAX_ENV_TIME);
            const decayEnd = (this.envelope.decay * this.MAX_ENV_TIME);
            gain.gain.linearRampToValueAtTime(1, attackEnd);
            gain.gain.setTargetAtTime(this.envelope.sustain, attackEnd, decayEnd);
        };
        this.setGainEnvelopExit = (gain) => {
            if (!this.ctx)
                throw new Error("Audio context not set");
            const { currentTime } = this.ctx;
            const currentGainValue = gain.gain.value;
            gain.gain.cancelScheduledValues(currentTime);
            gain.gain.setValueAtTime(currentGainValue, currentTime);
            const releaseEnd = currentTime + (this.envelope.release * this.MAX_ENV_TIME);
            gain.gain.linearRampToValueAtTime(0, releaseEnd);
        };
        this.ctx = ctx;
        this.envelope = {
            attack: 0.2,
            decay: 1,
            sustain: 0.2,
            release: 0.2
        };
        this.PLAYING = {};
        this.MAX_ENV_TIME = 2;
        if (!ctx)
            return;
    }
}
export default Audio;
