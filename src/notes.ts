type Keyboard = {[index:number]: Octave }
// type Octave = {[index:Notes]:number}
type Octave = {[index:string]:number}
export type NoteName = "C"|"Db"|"D"|"Eb"|"E"|"F"|"Gb"|"G"|"Ab"|"A"|"Bb"|"B";

const NOTES:Keyboard = {
    1:{
        C:32.703 as const ,
        Db:34.648 as const ,
        D:36.708 as const ,
        Eb:38.891 as const ,
        E:41.203 as const ,
        F:43.654 as const ,
        Gb:46.249 as const ,
        G:48.999 as const ,
        Ab:51.913 as const ,
        A:55 as const ,
        Bb:58.270 as const ,
        B:61.735 as const 
    },
    2:{
        C:65.406 as const ,
        Db:69.296 as const ,
        D:73.416 as const ,
        Eb:77.782 as const ,
        E:82.407 as const ,
        F:87.307 as const ,
        Gb:92.499 as const ,
        G:97.999 as const ,
        Ab:103.83 as const ,
        A:110.00 as const ,
        Bb:116.54 as const ,
        B:123.47 as const 
    },
    3:{
        C:130.81 as const ,
        Db:138.59 as const ,
        D:146.83 as const ,
        Eb:155.56 as const ,
        E:164.81 as const ,
        F:174.61 as const ,
        Gb:185 as const ,
        G:196 as const ,
        Ab:207.65 as const ,
        A:220 as const ,
        Bb:233.08 as const ,
        B:246.94 as const
    },
    4:{
        C:261.63 as const ,
        Db:277.18 as const ,
        D:293.67 as const ,
        Eb:311.13 as const ,
        E:329.63 as const ,
        F:349.23 as const ,
        Gb:369.99 as const ,
        G:392 as const ,
        Ab:415.3 as const ,
        A:440 as const ,
        Bb:466.16 as const ,
        B:493.88 as const
    },
    5:{
        C:523.25 as const ,
        Db:554.37 as const ,
        D:587.33 as const ,
        Eb:622.25 as const ,
        E:659.26 as const ,
        F:698.46 as const ,
        Gb:739.99 as const ,
        G:783.99 as const ,
        Ab:830.61 as const ,
        A:880 as const ,
        Bb:932.33 as const ,
        B:987.77 as const
    },
    6:{
        C:1046.5 as const,
        Db:1108.7 as const,
        D:1174.7 as const,
        Eb:1244.5 as const,
        E:1318.5 as const,
        F:1396.9 as const,
        Gb:1480 as const,
        G:1568 as const,
        Ab:1661.2 as const,
        A:1760 as const,
        Bb:1864.7 as const,
        B:1975.5 as const
    },
    7:{
        C:2093 as const,
        Db:2217.5 as const,
        D:2349.3 as const,
        Eb:2489 as const,
        E:2637 as const,
        F:2793 as const,
        Gb:2960 as const,
        G:3136 as const,
        Ab:3322.4 as const,
        A:3520 as const,
        Bb:3729.3 as const,
        B:3951.1 as const
    }as const
} as const;


export default NOTES;