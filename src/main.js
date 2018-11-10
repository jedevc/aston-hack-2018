const {Instrument} = require('./instrument');
const handlers = require('./handlers');

const notes = require('./notes');

window.onload = function() {
  const audio = new (window.AudioContext || window.webkitAudioContext)();
  let instrument = new Instrument(audio, majorPentatonicScale);
  handlers.attachMouseHandlers(instrument, document.getElementById('slider'));
  handlers.attachJoyconHandlers(instrument);

  let button = document.getElementById('state_label');
  let button_state = false;
  let state_button = document.getElementById('state_button');
  state_button.addEventListener('click', (event) => {
    button_state = !(button_state);
    if (button_state == true) {
      button.innerHTML = 'Mouse';
    } else if (button_state == false) {
      button.innerHTML = 'JoyCons';
    }
    handlers.toggleInputs();
  })

  let canvas = document.getElementById('slider');
  let ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';

  let length = 0;
  let dlength = 4;

  let frequency = Infinity;

  let interval = setInterval(() => {
    ctx.fillRect(0, 0, 600, 600);

    ctx.beginPath();
    ctx.moveTo(0, 300);
    for (let x = 0; x < 600; x++) {
      let y = 300 + length * Math.sin(x * x * 200 / frequency);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    length += dlength;
    if (length >= 100 || length <= -100) {
      dlength = -dlength;
    }
  }, 2)

  instrument.onplay = (freq) => {
    frequency = freq;
  }

  instrument.onpause = (freq) => {
    frequency = Infinity;
  }
}

function majorPentatonicScale(pitch) {
  const base = 49;
  const majorScale = [base, base + 2, base + 4, base + 7, base + 9];

  const note = majorScale[Math.floor(pitch * majorScale.length)];
  return notes.noteToFrequency(note);
}

function continuous(pitch) {
  const min = 49;
  const max = 49 + 12;
  const between = min + pitch * (max - min);
  return notes.noteToFrequency(between);
}
