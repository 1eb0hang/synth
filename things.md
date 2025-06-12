## Things in the synth

#### Oscillators
**Oscillator 1**
- type: sine, triangle, sawtooth, square
- mix: osc1 <=> ocs2 (range)

**Oscillator 2**
- type: sine, triangle, sawtooth, square, noise
- ocatave: -2 <=> +2 (range, step = 1)
- semis: -24 <=> +24 (range, step = 1)
- cents(detune): -100 <=> +100 (range, step = 1)

#### Filter
- type: lowpass, highpass, bandpass, notch, lowshelf, highshelf, peaking
- frequency: number (linear slider to logarimic number)
- resonance(Q): number
- gain: number
- envelope:
    - attack:number
    - decay:number
    - sustain:number
    - release:number

#### LFO
- type: sine, triangle, sawtooth, square
- rate: number

- osc amp mod: number
- osc octave mod: number
- osc semis mod: number
- osc detune mod: number

- filter frequency mod: number
- filter resonance mod: number

#### Amp Envelope
- attack
- decay
- sustain
- release

- volume

#### Extra
- wave analyser
