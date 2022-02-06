import React, { useEffect, useState, useRef } from 'react';
import { ProgressBar } from 'react-bootstrap';
import AlarmOnIcon from '@material-ui/icons/AlarmAdd';
import AlarmOff from '@material-ui/icons/AlarmOff';
import song from '../static/alarm.mp3';

function Timer() {
  const [time, setTime] = useState<number>(0);
  const [now, setNow] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [stopBtnDisabled, setStopBtnDisabled] = useState<boolean>(true);
  const [endTime, setEndTime] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const keyInterval = useRef<number>(0);
  const newSong = new Audio(song);

  function configTimer():void {
    const arrayTime = inputValue.split(':');
    const minute:number = +arrayTime[0] * 60;
    const second:number = +arrayTime[1];
    const sum:number = minute + second;
    if (!Number.isNaN(sum)) setTime(sum);
    setNow(sum);
  }

  function handleDisableBtn():void {
    const rgxTime = /\d[:]\d/gi;
    const rgxLetter = /[A-zÀ-ú]/gi;
    const arrayRepet = inputValue.split('');
    const fillterDif = arrayRepet.filter((e) => e === ':');
    const arrayTime = inputValue.split(':');
    if (!rgxTime.test(inputValue)
    || fillterDif.length > 1
    || rgxLetter.test(inputValue)
    || inputValue.length < 5
    || +arrayTime[0] > 60
    || +arrayTime[1] > 60
    || arrayTime[1].length < 2) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }

  function handleStart():void {
    configTimer();
    setInputValue('');
    setStopBtnDisabled(false);
    setIsDisabled(true);
    setStartTime(true);
    keyInterval.current = setInterval(() => {
      setTime((prevTime:number) => (prevTime <= 0 ? 0 : prevTime - 1));
    }, 1000);
  }

  function handleStop():void {
    setStopBtnDisabled(true);
    setStartTime(false);
    setTime(0);
    clearInterval(keyInterval.current);
  }

  function handleTimeFormater():string {
    const minute:string = time < 600 ? `0${Math.floor(time / 60)}` : (
      `${Math.floor(time / 60)}`
    );
    const second:string = time % 60 < 10 ? `0${time % 60}` : `${time % 60}`;

    return `${minute}:${second}`;
  }

  function handleProgress():number {
    const percentage = 100 - ((+time * 100) / +now);
    let result = Number.isNaN(percentage) ? 0 : percentage;
    if (time === 0) {
      result = 0;
    }
    return result;
  }

  function handleEndTime() {
    if (startTime) {
      setEndTime(true);
      newSong.play();
      setInterval(() => {
        setEndTime(false);
        newSong.pause();
      }, 5000);
    }
  }

  useEffect(() => {
    if (time === 0) {
      handleStop();
      handleEndTime();
    }
  }, [time]);

  useEffect(() => {
    handleDisableBtn();
  }, [inputValue]);

  return (
    <div className="main">
      {
        endTime && (
          <div className="overlay">
            <img
              src="https://github.com/Pedro0505/Cronometro-React-TS/blob/main/src/image/relogio.png?raw=true"
              alt="Relogio"
            />
          </div>
        )
      }
      <h1 className="title">Timer</h1>
      <h1 className="time">{ handleTimeFormater() }</h1>
      <ProgressBar
        variant="warning"
        className="progress"
        now={ handleProgress() }
      />
      <div className="container-btn-input">
        <input
          className="input"
          type="text"
          value={ inputValue }
          onChange={ ({ target: { value } }) => setInputValue(value) }
          placeholder="00:00"
        />
        <button
          className="btn"
          type="button"
          onClick={ handleStart }
          disabled={ isDisabled }
        >
          Iniciar
          <AlarmOnIcon style={ { marginLeft: '5px' } } />
        </button>
        <button
          className="btn"
          type="button"
          disabled={ stopBtnDisabled }
          onClick={ handleStop }
        >
          Parar
          <AlarmOff style={ { marginLeft: '5px' } } />
        </button>
      </div>
    </div>
  );
}

export default Timer;
