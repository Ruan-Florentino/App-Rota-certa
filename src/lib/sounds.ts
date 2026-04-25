class SoundManager {
  private enabled = true;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  
  constructor() {
    // In a real app, initialize with sound paths
    // this.sounds.set('tap', new Audio('/sounds/tap.mp3'));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
  
  play(name: string, volume = 0.3) {
    if (!this.enabled) return;
    const audio = this.sounds.get(name);
    if (audio) {
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }
}

const soundManager = new SoundManager();
export { soundManager as sounds };
