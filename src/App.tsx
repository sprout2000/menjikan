import React, { Component } from 'react';
import moment from 'moment';
import { Fab, Page, Range } from 'react-onsenui';

import WebAudio from './webAudio';

import 'font-awesome/css/font-awesome.min.css';
import 'onsenui/css/onsenui-core.min.css';
import 'onsenui/css/onsen-css-components.min.css';
import './App.css';

interface State {
  timeString: string;
  timeToCountDown: number;
  isRunning: boolean;
  isRinging: boolean;
}

interface App {
  state: State;
  webAudio: WebAudio;
  timerId: number;
}

class App extends Component {
  public constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      timeString: '3:00',
      timeToCountDown: 180000,
      isRunning: false,
      isRinging: false,
    };
    this.webAudio = new WebAudio();
    this.timerId = 0;
  }

  private updateTimer = (ms: number): void => {
    const time = moment(ms);
    const timeString = time.format('m:ss');
    this.setState({ timeString });
  };

  private countDown = (): void => {
    this.timerId = window.setInterval((): void => {
      if (this.state.timeToCountDown === 1000) {
        this.webAudio.loadSound('./timer.mp3', (buffer: AudioBuffer): void =>
          this.webAudio.playSound(buffer)
        );

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

  public handleOnChange = (e: Event): void => {
    if (e.target) {
      // @ts-ignore
      const val = e.target.value;
      this.updateTimer(Number(val));
      this.setState({ timeToCountDown: Number(val) });
    }
  };

  public handleOnClick = (): void => {
    this.webAudio.init();

    if (this.state.timeToCountDown <= 0 && !this.state.isRinging) {
      return;
    }

    if (this.state.isRinging) {
      this.webAudio.stop();
      this.setState({ isRinging: false });
      return;
    }

    if (!this.state.isRunning) {
      this.webAudio.playSilent();
      this.setState({ isRunning: true });
      this.countDown();
    } else {
      this.setState({ isRunning: false });
      window.clearInterval(this.timerId);
    }
  };

  public renderFixed = (): JSX.Element => {
    let iconName: string;
    if (this.state.isRunning) {
      iconName = 'fa fa-pause';
    } else if (!this.state.isRunning && this.state.isRinging) {
      iconName = 'fa fa-volume-up';
    } else {
      iconName = 'fa fa-play';
    }

    return (
      <Fab ripple position="bottom center" onClick={this.handleOnClick}>
        <i className={iconName} style={{ color: '#FFF' }} />
      </Fab>
    );
  };

  public render(): JSX.Element {
    return (
      <Page renderFixed={this.renderFixed}>
        <div className="App">
          <div className="display-time">{this.state.timeString}</div>
          <Range
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
            onChange={this.handleOnChange}
          />
        </div>
      </Page>
    );
  }
}

export default App;
