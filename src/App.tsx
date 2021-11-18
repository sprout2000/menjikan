import { useState, useEffect } from 'react';

import { Howl } from 'howler';
import NoSleep from 'nosleep.js';

import { pink } from '@mui/material/colors';
import GlobalStyles from '@mui/material/GlobalStyles';

import Fab from '@mui/material/Fab';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import Timer from './timer.mp3';
import RamenIcon from './icon_128.png';

const theme = createTheme({
  palette: {
    primary: {
      main: pink[500],
    },
  },
});

const Container = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
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
  background: pink[500],
  '&:hover': {
    background: pink[700],
  },
});

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = styled(Slider)(() => ({
  color: '#3880ff',
  height: 10,
  width: '80%',
  maxWidth: '600px',
  padding: '40px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-track': {
    height: 10,
    opacity: 0.7,
    border: 'none',
    borderRadius: 4,
    backgroundColor: pink[500],
  },
  '& .MuiSlider-rail': {
    height: 10,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
    borderRadius: 4,
  },
}));

export const App = () => {
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

  const handleOnChange = (e: Event, val: number | number[]) => {
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
      <GlobalStyles
        styles={{
          body: { margin: 0, color: '#fff', backgroundColor: '#4a148c' },
        }}
      />
      <Container>
        <IconContainer>
          <img src={RamenIcon} alt="" />
        </IconContainer>
        <Display variant="h1">{toString(left)}</Display>
        <IOSSlider
          max={1000 * 60 * 6}
          min={0}
          step={5000}
          value={left}
          onChange={handleOnChange}
        />
        <div>
          <FabButton
            aria-label="start"
            color="secondary"
            onClick={handleOnClick}
          >
            {active ? (
              <PauseRoundedIcon fontSize="large" />
            ) : loud ? (
              <AlarmRoundedIcon fontSize="large" />
            ) : (
              <PlayArrowRoundedIcon fontSize="large" />
            )}
          </FabButton>
        </div>
      </Container>
    </ThemeProvider>
  );
};
