import Synth from "./audio.js";
import {createAudioStartForm, formEventListener} from "./form.js";
import KEYBOARD from "./keyboard.js";
import { NoteName } from "./notes.js";
import {setUpControlsEventLinsteners } from "./ui.js";

const audio = new Synth();

const Keydown = (e:KeyboardEvent, virtualKeyboard:NodeListOf<HTMLInputElement>)=>{
    // e.preventDefault()
    if (e.repeat) return;
    
    const key = e.key;
    if(key in KEYBOARD){
        // audio.setCurrentOctave();
        audio.play(KEYBOARD[key].note as NoteName, audio.getCurrentOctave()+KEYBOARD[key].octave);
        console.log("Playing ", key);
    }
}

const Keyup = (e:KeyboardEvent, virtualKeyboard:NodeListOf<HTMLInputElement>)=>{
    if (e.repeat) return;

    const key = e.key;
    if(key in KEYBOARD){
        audio.stop(KEYBOARD[key].note as NoteName, audio.getCurrentOctave()+KEYBOARD[key].octave);
        console.log("Stoping ", key);
    }
}


const main = ()=>{
    createAudioStartForm();
    formEventListener(():void=>{
        audio.setAudioContext(new AudioContext());
        setUpControlsEventLinsteners(audio);
    })

    const virtualKeyboard = document.querySelectorAll<HTMLInputElement>(".key");
    const buttons = document.querySelectorAll<HTMLInputElement>(".btnTranspose");
    const transpose = {
        up:buttons[0].value == "+1"?buttons[0]:buttons[1],
        down:buttons[0].value == "-1"?buttons[0]:buttons[1]
    }
    const octaveDisplay = document.querySelector<HTMLDivElement>(".currentOctave");
    if(!octaveDisplay) throw new Error("Octave disply not initialised");
    octaveDisplay.innerText = String(audio.getCurrentOctave());

    if (!virtualKeyboard) return;
    console.log("keboard initialised");

    transpose.up.addEventListener("click",()=>{
        audio.setCurrentOctave(audio.getCurrentOctave()+1);
        octaveDisplay.innerText = String(audio.getCurrentOctave());
    })
    transpose.down.addEventListener("click",()=>{
        audio.setCurrentOctave(audio.getCurrentOctave()-1);
        octaveDisplay.innerText = String(audio.getCurrentOctave());
    })

    document.addEventListener("keydown", (e:KeyboardEvent)=>{Keydown(e, virtualKeyboard);})
    document.addEventListener("keyup", (e:KeyboardEvent)=>{Keyup(e, virtualKeyboard);})
    
    for(const key in virtualKeyboard){
        if(!(virtualKeyboard[key] instanceof HTMLInputElement)) continue;
        
        const note = virtualKeyboard[key];
        note.addEventListener("mousedown", ()=>{
            // TODO: check if mousemove while mousedown
            audio.play(virtualKeyboard[key].name as NoteName);
            console.log("Playing ", key);
        })

        note.addEventListener("mouseup", ()=>{
            //TODO: check if mouse down happened on this key
            audio.stop(virtualKeyboard[key].name as NoteName);
        })

        // TODO: switch to solidjs

        // TODO: allow mouse drag while mouse down for adjecent key input
        // TODO: implement wavetype switcing
        // TODO: implement global filter
        // TODO: implement user configurable adsr envelope
        // TODO: implement keyboard input
        // TODO: implement unison poliphony

        // TODO: display current key/chord on display
    }
}

main()
