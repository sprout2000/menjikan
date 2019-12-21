import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Howl } from 'howler';
import moment from 'moment';

interface State {
  timeString: string;
  timeToCountDown: number;
  isRunning: boolean;
  isRinging: boolean;
}

class App extends Component {
  public state: State = {
    timeString: '3:00',
    timeToCountDown: 180000,
    isRunning: false,
    isRinging: false,
  };

  private timerId = 0;
  private sound = new Howl({
    src: './timer.mp3',
  });

  private updateTimer = (ms: number): void => {
    const time = moment(ms);
    const timeString = time.format('m:ss');
    this.setState({ timeString });
  };

  private countDown = (): void => {
    this.timerId = window.setInterval((): void => {
      if (this.state.timeToCountDown === 1000) {
        this.sound.play();

        this.setState({
          timeToCountDown: 0,
          isRunning: false,
          isRinging: true,
        });
        window.clearInterval(this.timerId);
        this.updateTimer(0);
        return;
      }

      const timeToCountDown = this.state.timeToCountDown - 1000;
      this.setState({ timeToCountDown });
      this.updateTimer(this.state.timeToCountDown);
    }, 1000);
  };

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target) {
      const val = e.target.value;
      this.updateTimer(Number(val));
      this.setState({ timeToCountDown: Number(val) });
    }
  };

  private handleOnClick = (): void => {
    if (this.state.timeToCountDown <= 0 && !this.state.isRinging) {
      return;
    }

    if (this.state.isRinging) {
      this.sound.stop();
      this.setState({ isRinging: false });
      return;
    }

    if (!this.state.isRunning) {
      this.setState({ isRunning: true });
      this.countDown();
    } else {
      this.setState({ isRunning: false });
      window.clearInterval(this.timerId);
    }
  };

  public render(): JSX.Element {
    return (
      <div>
        <div className="App">
          <div className="display-time">{this.state.timeString}</div>
          <input
            type="range"
            style={{
              width: '70%',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            max={300000}
            min={0}
            step={5000}
            value={this.state.timeToCountDown}
            onChange={(e): void => this.handleOnChange(e)}
          />
        </div>
        <div>
          <button onClick={this.handleOnClick}>Start</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', (): void => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
