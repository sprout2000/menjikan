export default class WebAudio {
  public context: AudioContext | null = null;
  public source: AudioBufferSourceNode | null = null;

  public init = (): void => {
    this.context = new AudioContext();
  };

  public loadSound = (
    url: string,
    callback: DecodeSuccessCallback
  ): ReturnType<typeof callback> => {
    const request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    request.onreadystatechange = (): ReturnType<typeof callback> => {
      if (request.readyState === 4) {
        if (request.status === 0 || request.status === 200) {
          if (this.context) {
            this.context.decodeAudioData(request.response, (buffer): void =>
              callback(buffer)
            );
          }
        }
      }
    };

    request.open('GET', url, true);
    request.send();
  };

  public playSilent = (): void => {
    if (this.context) {
      const buffer = this.context.createBuffer(1, 1, 22050);
      const silent = this.context.createBufferSource();
      silent.buffer = buffer;
      silent.connect(this.context.destination);
      silent.start(0);
    }
  };

  public playSound = (buffer: AudioBuffer): void => {
    if (this.context) {
      this.source = this.context.createBufferSource();
      this.source.buffer = buffer;
      this.source.connect(this.context.destination);
      this.source.loop = true;
      this.source.start(0);
    }
  };

  public stop = (): void => {
    if (this.source) this.source.stop(0);
  };
}
