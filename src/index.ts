import Audio from "./audio.js";
import {createAudioStartForm, formEventListener} from "./form.js";

const audio = new Audio();

const main = ()=>{
    createAudioStartForm()
    formEventListener(():void=>{audio.setAudioContext(new AudioContext())})

    const keyboard = document.querySelectorAll<HTMLInputElement>(".key");

    if (!keyboard) return;
    console.log("keboard initialised");

    for(const key in keyboard){
        if(!(keyboard[key] instanceof HTMLInputElement)) continue;
        const self = keyboard[key];
        self.addEventListener("mousedown", ()=>{
            // TODO: check if mousemove while mousedown
            audio.play(keyboard[key].name);
        })

        self.addEventListener("mouseup", ()=>{
            //TODO: check if mouse down happened on this key
            audio.stop(keyboard[key].name);
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