import Synth from "./audio.js";
import Log from "./temp/log.js";

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

const updateValueWithUI=(uiComponent:HTMLInputElement, uiValue:number|string, audioSet:(value:number)=>void)=>{
    const newVal = Number(uiValue);
    audioSet(newVal);
    uiComponent.value = `${newVal}`;
}

export const setUpControlsEventLinsteners = (audio:Synth)=>{
    if(!audio.isContextValid()) throw new Error("Valid audio context not found");
    console.log("Audio context nisialized");

    const controlList = getSynthControls();
    audio.update(controlList);
    
    controlList.osc1Type.addEventListener("input", (e)=>{updateValueWithUI(controlList.osc1Type, controlList.osc1Type.value,audio.setOsc1Type)})
    // controlList.osc1Type.addEventListener("input", (e)=>{audio.setOsc1Type(Number(controlList.osc1Type.value))})
    controlList.oscMix.addEventListener("input", (e)=>{audio.setOscMix(Number(controlList.oscMix.value))})
    // controlList.osc2Type.addEventListener("input", (e)=>{audio.setOsc1Type(numToOscType(Number(controlList.osc1Type.value)))})
    controlList.osc2Octave.addEventListener("input", (e)=>{})
    controlList.osc2Semis.addEventListener("input", (e)=>{})
    controlList.osc2Cents.addEventListener("input", (e)=>{})

    controlList.filType.addEventListener("input", (e)=>{audio.setFilterType(Number(controlList.filType.value))})
    controlList.filFreq.addEventListener("input", (e)=>{
        const value = new Log().value(Number(controlList.filFreq.value));
        audio.setFilterFreq(value);
    });
    controlList.filQ.addEventListener("input", (e)=>{audio.setFilterQ(Number(controlList.filQ.value))})
    controlList.filGain.addEventListener("input", (e)=>{audio.setFilterGain(Number(controlList.filGain.value))})
    controlList.filAttack.addEventListener("input", (e)=>{audio.setFilterAttack(Number(controlList.filAttack.value))})
    controlList.filDecay.addEventListener("input", (e)=>{audio.setFilterDecay(Number(controlList.filDecay.value))})
    controlList.filSustain.addEventListener("input", (e)=>{audio.setFilterSustain(Number(controlList.filSustain.value))})
    controlList.filContour.addEventListener("input", (e)=>{audio.setFilterContour(Number(controlList.filContour.value))})
    
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
    controlList.volume.addEventListener("input", (e)=>{audio.setVolume(Number(controlList.volume.value))})
}

export default ControlList;