import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { withStyles, styled } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Slider from '@material-ui/core/Slider';

import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import AlermIcon from '@material-ui/icons/AccessAlarmRounded';

import { Howl } from 'howler';
import moment from 'moment';

import './App.css';

interface State {
  timeString: string;
  timeToCountDown: number;
  isRunning: boolean;
  isRinging: boolean;
}

const Container = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const Display = styled('div')({
  fontSize: '15vh',
});

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 10,
    width: '80%',
    maxWidth: '600px',
    padding: '40px 0',
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -10,
    marginLeft: -10,
    '&:focus,&:hover,&$active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: 'rgb(0, 122, 255)',
    opacity: 0.5,
  },
  rail: {
    height: 10,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
    borderRadius: 4,
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);

const FabButton = styled(Fab)({
  marginTop: '40px',
});

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

  private handleOnChange = (
    e: React.ChangeEvent<{}>,
    val: number | number[]
  ): void => {
    if (e.target) {
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
      <Container>
        <div className="App">
          <Display>{this.state.timeString}</Display>
          <IOSSlider
            defaultValue={this.state.timeToCountDown}
            max={300000}
            min={0}
            step={5000}
            value={this.state.timeToCountDown}
            onChange={(e, val): void => this.handleOnChange(e, val)}
          />
        </div>
        <div>
          <FabButton color="secondary" onClick={this.handleOnClick}>
            {this.state.isRunning ? (
              <PauseIcon fontSize="large" />
            ) : this.state.isRinging ? (
              <AlermIcon fontSize="large" />
            ) : (
              <PlayIcon fontSize="large" />
            )}
          </FabButton>
        </div>
      </Container>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', (): void => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
