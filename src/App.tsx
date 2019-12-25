import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Slider from '@material-ui/core/Slider';

import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import AlermIcon from '@material-ui/icons/AccessAlarmRounded';
import 'typeface-roboto-mono';

import { Howl } from 'howler';
import moment from 'moment';

const useStyles = makeStyles(() =>
  createStyles({
    '@global': {
      html: {
        margin: 0,
        padding: 0,
        height: '100%',
      },
      body: {
        margin: 0,
        padding: 0,
        height: '100%',
        color: '#fff',
        backgroundColor: '#4a148c',
        textAlign: 'center',
      },
      '#root': {
        margin: 0,
        padding: 0,
        height: '100%',
      },
    },
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    display: {
      fontSize: '15vh',
      fontFamily: "'Roboto Mono', mono-space",
    },
    fab: {
      marginTop: '40px',
    },
  })
);

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
    backgroundColor: '#f50055',
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

const App = (): JSX.Element => {
  const classes = useStyles();

  const [time, setTime] = useState('3:00');
  const [left, setLeft] = useState(180000);
  const [active, setActive] = useState(false);
  const [loud, setLoud] = useState(false);

  const tick = (): void => {
    setLeft((left) => left - 1000);
  };

  const sound = new Howl({
    src: './timer.mp3',
  });

  const updateTimer = (ms: number): void => {
    const time = moment(ms);
    const timeString = time.format('m:ss');
    setTime(timeString);
  };

  const handleOnChange = (
    e: React.ChangeEvent<{}>,
    val: number | number[]
  ): void => {
    if (e.target) {
      updateTimer(Number(val));
      setLeft(Number(val));
    }
  };

  const handleOnClick = (): void => {
    if (!loud && left <= 0) return;

    if (!active && !loud) {
      setActive(true);
    } else {
      setActive(false);
    }

    if (loud) {
      setLoud(false);
      sound.stop();
    }
  };

  useEffect(() => {
    if (active && left >= 0) {
      const timerId = setInterval(() => tick(), 1000);
      updateTimer(left);

      return (): void => {
        clearInterval(timerId);
      };
    }
  });

  useEffect(() => {
    if (left <= 0 && active) {
      setLoud(true);
      setActive(false);
    }
  }, [active, left]);

  useEffect(() => {
    if (loud) sound.play();
  });

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.display}>{time}</div>
        <IOSSlider
          defaultValue={left}
          max={300000}
          min={0}
          step={5000}
          value={left}
          onChange={(e, val): void => handleOnChange(e, val)}
        />
      </div>
      <div>
        <Fab
          className={classes.fab}
          aria-label="start"
          color="secondary"
          onClick={handleOnClick}>
          {active ? (
            <PauseIcon fontSize="large" />
          ) : loud ? (
            <AlermIcon fontSize="large" />
          ) : (
            <PlayIcon fontSize="large" />
          )}
        </Fab>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', (): void => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
