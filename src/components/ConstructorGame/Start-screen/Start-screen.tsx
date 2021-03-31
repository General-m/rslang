import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  constructorGameStart,
  setLearnCount,
  setRoundCount,
  setRoundEnd,
  setShuffledWordList,
} from '../../../actions/constructor-game-actions';
import { shuffle } from '../../../utils/shuffle';
import ControlledSelect from '../../ControlledSelect/ControlledSelect';
import styles from './Start-screen.module.css';
import { ReactComponent as Play } from '../../../assets/images/video-player-mini.svg';
import { RootStateType } from '../../../reducer/root-reducer';
import { ReactComponent as CatSleeping } from '../../../assets/images/cat-sleeping.svg';

export const StartScreen: React.FC = () => {
  const dispatch = useDispatch();

  const currentWordList = useSelector(
    (state: RootStateType) => state.wordState.currentWordList
  );

  const startGameHandler = () => {
    dispatch(setShuffledWordList(shuffle(currentWordList)));
    dispatch(constructorGameStart(true));
    dispatch(setLearnCount(0));
    dispatch(setRoundCount(0));
    dispatch(setRoundEnd(false));
  };

  return (
    <div className={styles['my-game']}>
      <h2 className={styles.title}>конструктор слов</h2>
      <p className={styles.text}>
        Составление оригинального слова по переводу.
      </p>
      <button
        type="button"
        className={styles['play-button']}
        onClick={startGameHandler}
      >
        <Play className={styles.play} />
      </button>

      <ControlledSelect />

      <CatSleeping
        width="210px"
        height="142px"
        className={styles.cat_sleeping}
      />
    </div>
  );
};