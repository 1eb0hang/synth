import { NoteName } from "./notes";

let playing = false;

const KEYBOARD:{[index:string]:{note:string, octave:number}} = {
    //TODO: add midi support
        "q":{note:"C", octave:0}, 
        "2":{note:"Db", octave:0},
        "w":{note:"D", octave:0}, 
        "3":{note:"Eb", octave:0},
        "e":{note:"E", octave:0}, 
        "r":{note:"F", octave:0}, 
        "5":{note:"Gb", octave:0},
        "t":{note:"G", octave:0}, 
        "6":{note:"Ab", octave:0},
        "y":{note:"A", octave:0}, 
        "7":{note:"Bb", octave:0},
        "u":{note:"B", octave:0},
        "i":{note:"C", octave:1},
        "9":{note:"Db", octave:1},
        "o":{note:"D", octave:1},
        "-":{note:"Eb", octave:1},
        "p":{note:"E", octave:1},
        "[":{note:"F", octave:1},
        "=":{note:"Gb", octave:1},
        "]":{note:"G", octave:1},
        "z":{note:"C", octave:1}, 
        "s":{note:"Db", octave:1},
        "x":{note:"D", octave:1}, 
        "d":{note:"Eb", octave:1},
        "c":{note:"E", octave:1}, 
        "v":{note:"F", octave:1}, 
        "g":{note:"Gb", octave:1},
        "b":{note:"G", octave:1}, 
        "h":{note:"Ab", octave:1},
        "n":{note:"A", octave:1}, 
        "j":{note:"Bb", octave:1},
        "m":{note:"B", octave:1},
        ",":{note:"C", octave:2}, 
        "l":{note:"Db", octave:2},
        ".":{note:"D", octave:2}, 
        ";":{note:"Eb", octave:2},
        "/":{note:"E", octave:2}
}

export default KEYBOARD;