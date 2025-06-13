import Synth from "./audio.js";
import {createAudioStartForm, formEventListener} from "./form.js";
import KEYBOARD from "./keyboard.js";
import { NoteName } from "./notes.js";
import {setUpControlsEventLinsteners } from "./ui.js";

const audio = new Synth();

const Keydown = (key:string)=>{
    if(key in KEYBOARD){
        // playing = true;
    }
}

const Keyup = (key:string)=>{
    // playing = false;
}


const main = ()=>{
    createAudioStartForm();
    formEventListener(():void=>{
        audio.setAudioContext(new AudioContext());
        setUpControlsEventLinsteners(audio);
    })

    const virtualKeyboard = document.querySelectorAll<HTMLInputElement>(".key");
    const buttons = document.querySelectorAll<HTMLInputElement>(".btnTranspose");
    console.log(buttons);
    const transpose = {
        up:buttons[0].value == "+1"?buttons[0]:buttons[1],
        down:buttons[0].value == "-1"?buttons[0]:buttons[1]
    }

    if (!virtualKeyboard) return;
    console.log("keboard initialised");

    transpose.up.addEventListener("click",()=>{audio.setCurrentOctave(audio.getCurrentOctave()+1)})
    transpose.down.addEventListener("click",()=>{audio.setCurrentOctave(audio.getCurrentOctave()-1)})

    // document.addEventListener("keydown", (e:KeyboardEvent)=>{Keydown(e.key);})
    // document.addEventListener("keyup", (e:KeyboardEvent)=>{Keyup(e.key);})

    for(const key in virtualKeyboard){
        if(!(virtualKeyboard[key] instanceof HTMLInputElement)) continue;
         
        const self = virtualKeyboard[key];
        self.addEventListener("mousedown", ()=>{
            // TODO: check if mousemove while mousedown
            audio.play(virtualKeyboard[key].name as NoteName);
        })

        self.addEventListener("mouseup", ()=>{
            //TODO: check if mouse down happened on this key
            audio.stop(virtualKeyboard[key].name);
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
