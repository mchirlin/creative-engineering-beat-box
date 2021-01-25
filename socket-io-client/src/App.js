import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Sampler } from "tone";
import { Piano } from "react-nexusui";

//import A1 from "./samples/A1.mp3";
import VA4 from "./samples/violin/A4.mp3";
import VA5 from "./samples/violin/A5.mp3";
import VA6 from "./samples/violin/A6.mp3";

import PC2 from "./samples/piano/C2.mp3";
import PA2 from "./samples/piano/A2.mp3";
import PE3 from "./samples/piano/E3.mp3";
import PC4 from "./samples/piano/C4.mp3";
import PA4 from "./samples/piano/A4.mp3";
import PA5 from "./samples/piano/A5.mp3";
import PA6 from "./samples/piano/A6.mp3";

import BA1 from "./samples/bassoon/A1.mp3";
import BA2 from "./samples/bassoon/A2.mp3";
import BA3 from "./samples/bassoon/A3.mp3";

import GAD1 from "./samples/guitar-acoustic/D1.mp3";
import GAD2 from "./samples/guitar-acoustic/D2.mp3";
import GAD3 from "./samples/guitar-acoustic/D3.mp3";
import GAD4 from "./samples/guitar-acoustic/D4.mp3";

import GEA2 from "./samples/guitar-electric/A2.mp3";
import GEC3 from "./samples/guitar-electric/C3.mp3";
import GEC4 from "./samples/guitar-electric/C4.mp3";
import GEC5 from "./samples/guitar-electric/C5.mp3";
import GEC6 from "./samples/guitar-electric/C6.mp3";

import FC3 from "./samples/flute/C3.mp3";
import FC4 from "./samples/flute/C4.mp3";
import FC5 from "./samples/flute/C5.mp3";

import SD2 from "./samples/saxophone/D2.mp3";
import SD3 from "./samples/saxophone/D3.mp3";
import SD4 from "./samples/saxophone/D4.mp3";

import TF2 from "./samples/trumpet/F2.mp3";
import TF3 from "./samples/trumpet/F3.mp3";
import TF4 from "./samples/trumpet/F4.mp3";

import DHIHAT from "./samples/drum/hihat.wav";
import DKICK from "./samples/drum/kick.wav";
import DSNARE from "./samples/drum/snare.wav";
import DTOM1 from "./samples/drum/tom1.wav";
import DTOM2 from "./samples/drum/tom2.wav";
import DTOM3  from "./samples/drum/tom3.wav";

const ENDPOINT = "http://192.168.1.193:4001";
const PLAY_NOTE_EVENT = 'PlayNote';

function App() {
  const [instrument, setInstrument] = useState("piano");
  const [note, setNote] = useState("A");
  const [octave, setOctave] = useState("0");
  const socketRef = useRef();
  const pianoSamplerRef = useRef();
  const violinSamplerRef = useRef();
  const bassoonSamplerRef = useRef();
  const guitarAcousticSamplerRef = useRef();
  const guitarElectricSamplerRef = useRef();
  const fluteSamplerRef = useRef();
  const saxophoneSamplerRef = useRef();
  const trumpetSamplerRef = useRef();
  const drumSamplerRef = useRef();
  
  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  const handleInstrumentSelection = (event) => {
    setInstrument(event.target.value);
  }
  
  const handleNoteSelection = (event) => {
    setNote(event.target.value);
  }
  
  const handleOctaveSelection = (event) => {
    setOctave(event.target.value);
  }
  
  const handleRemotePlay = () => {
    socketRef.current.emit(PLAY_NOTE_EVENT, {instrument: instrument, note: note + octave});
  }
  
  const handleDirectPlay = () => {
    if(instrument === 'piano') pianoSamplerRef.current.triggerAttackRelease(note + octave, "1.7");
    else if(instrument === 'violin') violinSamplerRef.current.triggerAttackRelease(note + octave, "1.7");
    else if(instrument === 'bassoon') bassoonSamplerRef.current.triggerAttackRelease(note + octave, "1.7");
  }
  
  const handlePianoPress = (event) => {
    console.log(event);
    if (event.state) {
      var note = calculateNote(event.note);
      var octave = calculateOctave(event.note);
      socketRef.current.emit(PLAY_NOTE_EVENT, {instrument: instrument, note: note + octave});
      setNote(note);
      setOctave(octave);
    }
  }
  
  const calculateNote = (key) => {
    return keys[key % 12];
  }
  
  const calculateOctave = (key) => {
    return Math.floor(key / 12).toFixed(0);
  }
    
  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);
      
    pianoSamplerRef.current = new Sampler(
      { "C2": PC2, "A2": PA2, "A4": PA4, "E3": PE3, "C4": PC4, "A5": PA5, "A6": PA6 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
    
    violinSamplerRef.current = new Sampler(
      { "A4": VA4, "A5": VA5, "A6": VA6 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
    
    bassoonSamplerRef.current = new Sampler(
      { "A1": BA1, "A2": BA2, "A3": BA3 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
      
    guitarAcousticSamplerRef.current = new Sampler(
      { "D1": GAD1, "D2": GAD2, "D3": GAD3, "D4": GAD4 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();

    guitarElectricSamplerRef.current = new Sampler(
      { "A2": GEA2, "C3": GEC3, "C4": GEC4, "C5": GEC5, "C6": GEC6 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
    
    fluteSamplerRef.current = new Sampler(
      { "C3": FC3, "C4": FC4, "C5": FC5 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
    
    saxophoneSamplerRef.current = new Sampler(
      { "D2": SD2, "D3": SD3, "D4": SD4 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
    
    trumpetSamplerRef.current = new Sampler(
      { "F2": TF2, "F3": TF3, "F4": TF4 },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
    
    drumSamplerRef.current = new Sampler(
      { "C0": DHIHAT, "D0": DKICK, "E0": DSNARE, "F0": DTOM1, "G0": DTOM2, "A0": DTOM3, "B0": DHIHAT,
        "C1": DHIHAT, "D1": DKICK, "E1": DSNARE, "F1": DTOM1, "G1": DTOM2, "A1": DTOM3, "B1": DHIHAT,
        "C2": DHIHAT, "D2": DKICK, "E2": DSNARE, "F2": DTOM1, "G2": DTOM2, "A2": DTOM3, "B2": DHIHAT,
        "C3": DHIHAT, "D3": DKICK, "E3": DSNARE, "F3": DTOM1, "G3": DTOM2, "A3": DTOM3, "B3": DHIHAT,
        "C4": DHIHAT, "D4": DKICK, "E4": DSNARE, "F4": DTOM1, "G4": DTOM2, "A4": DTOM3, "B4": DHIHAT,
        "C5": DHIHAT, "D5": DKICK, "E5": DSNARE, "F5": DTOM1, "G5": DTOM2, "A5": DTOM3, "B5": DHIHAT,
        "C6": DHIHAT, "D6": DKICK, "E6": DSNARE, "F6": DTOM1, "G6": DTOM2, "A6": DTOM3, "B6": DHIHAT,
        "C7": DHIHAT, "D7": DKICK, "E7": DSNARE, "F7": DTOM1, "G7": DTOM2, "A7": DTOM3, "B7": DHIHAT
      },
      {
        onload: () => {
          this.setState({ isLoaded: true });
        }
      }
    ).toMaster();
        
    socketRef.current.on(PLAY_NOTE_EVENT, data => {
      if(data.instrument === 'piano') pianoSamplerRef.current.triggerAttackRelease(data.note, "1.3");
      else if(data.instrument === 'violin') violinSamplerRef.current.triggerAttackRelease(data.note, "1.7");
      else if(data.instrument === 'bassoon') bassoonSamplerRef.current.triggerAttackRelease(data.note, "1.7");
      else if(data.instrument === 'guitarAcoustic') guitarAcousticSamplerRef.current.triggerAttackRelease(data.note, "1.7");
      else if(data.instrument === 'guitarElectric') guitarElectricSamplerRef.current.triggerAttackRelease(data.note, "1.7");
      else if(data.instrument === 'flute') fluteSamplerRef.current.triggerAttackRelease(data.note, "1.7");
      else if(data.instrument === 'saxophone') saxophoneSamplerRef.current.triggerAttackRelease(data.note, "1.7");
      else if(data.instrument === 'trumpet') trumpetSamplerRef.current.triggerAttackRelease(data.note, "1.7");
      else if (data.instrument === 'drum') drumSamplerRef.current.triggerAttackRelease(data.note, ".4");
    });
    
    return () => {
      socketRef.current.disconnect();
    }
  }, []);

  return (
    <div>
      <select value={instrument} onChange={handleInstrumentSelection}>
        <option value="piano">Piano</option>
        <option value="violin">Violin</option>
        <option value="bassoon">Bassoon</option>
        <option value="guitarAcoustic">Guitar (Acoustic)</option>
        <option value="guitarElectric">Guitar (Electric)</option>
        <option value="flute">Flue</option>
        <option value="saxophone">Saxophone</option>
        <option value="trumpet">Trumpet</option>
        <option value="drum">Drum</option>
      </select>
      <select value={note} onChange={handleNoteSelection}>
        <option value="C">C</option>
        <option value="C#">C#</option>
        <option value="D">D</option>
        <option value="D#">D#</option>
        <option value="E">E</option>
        <option value="F">F</option>
        <option value="F#">F#</option>
        <option value="G">G</option>
        <option value="G#">G#</option>
        <option value="A">A</option>
        <option value="A#">A#</option>
        <option value="B">B</option>
      </select>
      <select value={octave} onChange={handleOctaveSelection}>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
      <div>
        <button onClick={handleRemotePlay}>Remote Play</button>
      </div>
      <div>
        <button onClick={handleDirectPlay}>Play Directly</button>
      </div>
<Piano size={[750,125]} mode="button" lowNote={24} highNote={60} onChange={handlePianoPress}/>
    </div>
  );
}

export default App;
