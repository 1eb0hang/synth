# Synth

This is a basic synth created with the web audio api\
Please note that upon entering you must allow the website to 
initialize the web audio api

## Features

### Oscillators
This synth has two oscillators with standard waveforms(sine, triangle, sawtooth, square) that can be detune to create a supersaw. You can also mix the two with the mix knob;

## Filter
The filter is a basic biquad filter, with the following filter types:
- low pass (Let low frequencies through)
- high pass (let high frequencies through)
- band pass (let frequencues of specific band through)
- lowshelf (boost or attenuate frequncies below a certain frequncy)
- lowshelf (boost or attenuate frequncies above a certain frequncy)
- peak (boost or attenuate frequncies within a certain frequncy)
- notch (let frequncies outside a certain range through)

## Envelope
There is a standard amplitude envelope for attack, decay, sustain and release