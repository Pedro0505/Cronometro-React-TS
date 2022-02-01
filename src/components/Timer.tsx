import React, { useEffect, useState, useRef } from 'react';

function Timer() {
  const [time, setTime] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const keyInterval = useRef<number>(0);

  function configTimer():void {
    const arrayTime = inputValue.split(':');
    const minute:number = +arrayTime[0] * 60;
    const second:number = +arrayTime[1];
    const sum:number = minute + second;
    if (!Number.isNaN(sum)) setTime(sum);
  }

  function handleDisableBtn():void {
    const rgx = /\d[:]\d/gi;
    const rgxLetter = /[A-zÀ-ú]/gi;
    const arrayTime = inputValue.split(':');
    if (!rgx.test(inputValue)
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
    setIsDisabled(true);
    keyInterval.current = setInterval(() => {
      setTime((prevTime:number) => (prevTime <= 0 ? 0 : prevTime - 1));
    }, 1000);
  }

  function handleStop():void {
    setIsDisabled(false);
    clearInterval(keyInterval.current);
  }

  function handleTimeFormater():string {
    const minute:string = time < 600 ? `0${Math.floor(time / 60)}` : (
      `${Math.floor(time / 60)}`
    );
    const second:string = time % 60 < 10 ? `0${time % 60}` : `${time % 60}`;

    return `${minute}:${second}`;
  }

  useEffect(() => {
    if (time === 0) {
      handleStop();
    }
  }, [time]);

  useEffect(() => {
    handleDisableBtn();
  }, [inputValue]);

  return (
    <div>
      <h1>{ handleTimeFormater() }</h1>
      <input
        type="text"
        onChange={ ({ target: { value } }) => setInputValue(value) }
        placeholder="00:00"
      />
      <button
        type="button"
        onClick={ handleStart }
        disabled={ isDisabled }
      >
        Iniciar
      </button>
      <button
        type="button"
        onClick={ handleStop }
      >
        Parar
      </button>
    </div>
  );
}

export default Timer;
