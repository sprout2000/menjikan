import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import NoSleep from 'nosleep.js';

import {
  styled,
  createMuiTheme,
  withStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import pink from '@material-ui/core/colors/pink';

import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Slider from '@material-ui/core/Slider';

import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import AlermIcon from '@material-ui/icons/AccessAlarmRounded';

import Timer from './timer.mp3';
import RamenIcon from './icon_128.png';

import 'typeface-roboto-mono';

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
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
    },
  },
});

const Container = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const IconContainer = styled('div')({
  userSelect: 'none',
});

const Display = styled(Typography)({
  userSelect: 'none',
  fontWeight: 'normal',
  fontFamily: "'Roboto Mono', mono-space",
});

const FabButton = styled(Fab)({
  marginTop: '1em',
});

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const iOSFocusShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)';

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
      boxShadow: iOSFocusShadow,
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: pink[500],
    opacity: 0.7,
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

export const App: React.FC = () => {
  const [left, setLeft] = useState(180000);
  const [active, setActive] = useState(false);
  const [loud, setLoud] = useState(false);

  const noSleep = new NoSleep();
  const sound = new Howl({ src: Timer });

  const tick = () => setLeft((left) => left - 1000);

  const toString = (duration: number) => {
    const hour = Math.floor(duration / 3600000);
    const minute = Math.floor((duration - 3600000 * hour) / 60000);
    const mm = ('00' + minute).slice(-2);
    const ms = ('00000' + (duration % 60000)).slice(-5);

    return `${mm}:${ms.slice(0, 2)}`;
  };

  const handleOnChange = (
    e: React.ChangeEvent<unknown>,
    val: number | number[]
  ) => {
    if (e.target) setLeft(Number(val));
  };

  const handleOnClick = () => {
    if (!loud && left <= 0) return;

    if (!active && !loud) {
      setActive(true);
      noSleep.enable();
    } else {
      setActive(false);
      noSleep.disable();
      console.log('Wake Lock disabled.');
    }

    if (loud) {
      setLoud(false);
      sound.stop();
    }
  };

  useEffect(() => {
    if (active && left > 0) {
      const timerId = setInterval(() => tick(), 1000);

      return () => clearInterval(timerId);
    }
  });

  useEffect(() => {
    if (active && left <= 0) {
      setLoud(true);
      setActive(false);
    }
  }, [active, left]);

  useEffect(() => {
    if (loud) sound.play();
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <IconContainer>
          <img src={RamenIcon} alt="" />
        </IconContainer>
        <div>
          <Display variant="h1">{toString(left)}</Display>
          <IOSSlider
            max={1000 * 60 * 6}
            min={0}
            step={5000}
            value={left}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <FabButton
            aria-label="start"
            color="secondary"
            onClick={handleOnClick}
          >
            {active ? (
              <PauseIcon fontSize="large" />
            ) : loud ? (
              <AlermIcon fontSize="large" />
            ) : (
              <PlayIcon fontSize="large" />
            )}
          </FabButton>
        </div>
      </Container>
    </ThemeProvider>
  );
};
