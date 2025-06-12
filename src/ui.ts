import Synth from "./audio";

interface ControlList {
    [index:string]:HTMLInputElement
}

export const getSynthControls = ():ControlList =>{
    const inputList = document.querySelector<HTMLDivElement>(".controls")?.querySelectorAll("input");
    if (!inputList) throw new Error("Synth controls not initialized");

    const controlList:ControlList = {};
    // console.log(controlList)
    for(const idx in inputList){
        if(isNaN(Number(idx))) continue;
        controlList[idx] = inputList[idx] as HTMLInputElement;
        controlList[inputList[idx].name] = inputList[idx] as HTMLInputElement;
    }

    // console.log(controlList);
    return controlList;
}

const numToFilterType = (number:number)=>{
    return ["lowpass","highpass","bandpass","lowshelf","highshelf","peaking","notch","allpass"][number] as BiquadFilterType;
}

const numToOscType = (number:number)=>{
    return ["sine","triangle","square","sawtooth"][number] as OscillatorType;
}

export const setUpControlsEventLinsteners = (audio:Synth)=>{
    if(!audio.isContextValid()) throw new Error("Valid audio context not found");
    console.log("Audio context nisialized");

    const controlList = getSynthControls();
    
    controlList.osc1Type.addEventListener("input", (e)=>{audio.setOsc1Type(numToOscType(Number(controlList.osc1Type.value)))})
    controlList.osc1Mix.addEventListener("input", (e)=>{})
    // controlList.osc2Type.addEventListener("input", (e)=>{audio.setOsc1Type(numToOscType(Number(controlList.osc1Type.value)))})
    controlList.osc2Octave.addEventListener("input", (e)=>{})
    controlList.osc2Semis.addEventListener("input", (e)=>{})
    controlList.osc2Cents.addEventListener("input", (e)=>{})

    controlList.filType.addEventListener("input", (e)=>{audio.setFilterType(numToFilterType(Number(controlList.filType.value)))})
    controlList.filFreq.addEventListener("input", (e)=>{})
    controlList.filQ.addEventListener("input", (e)=>{})
    controlList.filGain.addEventListener("input", (e)=>{})
    controlList.filAttack.addEventListener("input", (e)=>{})
    controlList.filDecay.addEventListener("input", (e)=>{})
    controlList.filSustain.addEventListener("input", (e)=>{})
    controlList.filContour.addEventListener("input", (e)=>{})
    
    // controlList.lfoType.addEventListener("input", (e)=>{audio.setOsc1Type(numToOscType(Number(controlList.osc1Type.value)))})
    controlList.lfoRate.addEventListener("input", (e)=>{})
    controlList.oscModMix.addEventListener("input", (e)=>{})
    controlList.oscModPitch.addEventListener("input", (e)=>{})
    controlList.oscModSemi.addEventListener("input", (e)=>{})
    controlList.oscModCents.addEventListener("input", (e)=>{})
    controlList.filModFreq.addEventListener("input", (e)=>{})
    controlList.filModQ.addEventListener("input", (e)=>{})
    controlList.filModGain.addEventListener("input", (e)=>{})
    
    controlList.attack.addEventListener("input", (e)=>{audio.setAttack(Number(controlList.attack.value))})
    controlList.decay.addEventListener("input", (e)=>{audio.setDecay(Number(controlList.decay.value))})
    controlList.sustain.addEventListener("input", (e)=>{audio.setSustain(Number(controlList.sustain.value))})
    controlList.release.addEventListener("input", (e)=>{audio.setRelease(Number(controlList.release.value))})
    controlList.volume.addEventListener("input", (e)=>{console.log(e)})
}

export default ControlList;