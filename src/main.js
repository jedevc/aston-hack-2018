window.onload = function() {
  var instrument = new Instrument('square');

  let mouseDown = false;
  document.addEventListener('mousedown', (event) => {
    mouseDown = true;
  })
  document.addEventListener('mouseup', (event) => {
    mouseDown = false;
  })

  document.addEventListener('mousemove', (event) => {
    if (mouseDown) {
      instrument.play(event.clientY);
    }
  })
}

class Instrument {
  constructor(waveType) {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = waveType;

    this.volume = this.ctx.createGain();
    this.volume.gain.setValueAtTime(0, this.ctx.currentTime);

    this.oscillator.connect(this.volume);
    this.volume.connect(this.ctx.destination);

    this.oscillator.start();

    this.playing = null;
  }

  play(freq) {
    // this smooths out the sounds
    const delay = 0.05;
    this.oscillator.frequency.linearRampToValueAtTime(freq, this.ctx.currentTime + delay);
    this.volume.gain.setValueAtTime(0.2, this.ctx.currentTime + delay);

    if (this.playing) {
      clearTimeout(this.playing);
    }

    this.playing = setTimeout(() => {
      this.volume.gain.setValueAtTime(0, this.ctx.currentTime);
      this.playing = null;
    }, 100);
  }
}
