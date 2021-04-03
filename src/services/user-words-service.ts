// import { serverUrlLocal, serverUrl } from '../utils/constants';
import { difficulty, serverUrlLocal } from '../utils/constants';

export default class UserWordsService {
  checkErr = (status: number) => {
    if (status === 417) {
      throw new Error('слово уже добавлено в словарь');
    }
    if (status === 404) {
      throw new Error('выбранное слово отсутсвует в вашем списке слов');
    }
    if (status === 401) {
      throw new Error('пожалуйста авторизуйтесь');
    }
    if (status === 400) {
      throw new Error('некорректный запрос');
    }
  };

  addWord = async (
    params: {
      userId: string;
      wordId: string;
      token: string;
    },
    body?: {
      difficulty?: string;
      optional?: {
        learning: boolean;
        learned: boolean;
        correctCount: number;
        inCorrectCount: number;
      };
    },
    unCheckErr?: boolean
  ) => {
    const initialBody = {
      difficulty: body?.difficulty || difficulty.easy,
      optional: {
        learning: body?.optional?.learning || false,
        learned: body?.optional?.learned || false,
        correctCount: body?.optional?.correctCount || 0,
        inCorrectCount: body?.optional?.inCorrectCount || 0,
      },
    };
    const body2 = {
      difficulty: body?.difficulty || difficulty.easy,
    };
    const res = await fetch(
      `${serverUrlLocal}users/${params.userId}/words/${params.wordId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body2),
      }
    );
    if (!unCheckErr) {
      this.checkErr(res.status);
      const data = await res.json();
      return data;
    }
    return null;
  };

  getWord = async (params: {
    userId: string;
    wordId: string;
    token: string;
  }) => {
    const res = await fetch(
      `${serverUrlLocal}users/${params.userId}/words/${params.wordId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    this.checkErr(res.status);
    const data = await res.json();
    return data;
  };

  updateWord = async (
    params: {
      userId: string;
      wordId: string;
      token: string;
    },
    body: {
      difficulty?: string;
      optional?: {
        learning: boolean;
        learned: boolean;
        correctCount: number;
        inCorrectCount: number;
      };
    }
  ) => {
    await this.addWord(params, body, true);

    const res = await fetch(
      `${serverUrlLocal}users/${params.userId}/words/${params.wordId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    this.checkErr(res.status);
    const data = await res.json();
    return data;
  };

  updateLearnWord = async (
    params: {
      userId: string;
      wordId: string;
      token: string;
    },
    gameResult: {
      isCorrect: boolean;
    }
  ) => {
    await this.addWord(params, undefined, true);

    const res = await fetch(
      `${serverUrlLocal}users/${params.userId}/learn/${params.wordId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optional: gameResult }),
      }
    );
    this.checkErr(res.status);
    const data = await res.json();
    return data;
  };

  removeWord = async (params: {
    userId: string;
    wordId: string;
    token: string;
  }) => {
    const res = await fetch(
      `${serverUrlLocal}users/${params.userId}/words/${params.wordId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    this.checkErr(res.status);

    return null;
  };

  getWordsList = async (params: { userId: string; token: string }) => {
    const res = await fetch(`${serverUrlLocal}users/${params.userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.checkErr(res.status);

    const data = await res.json();

    return data;
  };
}