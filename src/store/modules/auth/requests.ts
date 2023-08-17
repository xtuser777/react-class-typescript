import axios from '../../../services/axios';
import * as types from './types';

export async function sendPost(
  url: string,
  data: types.LoginRequestPayload,
): Promise<types.LoginRequestResult> {
  let result: types.LoginRequestResult = {
    token: false,
    user: { id: 0, login: '', name: '', level: 0 },
  };
  const response = await axios.post(url, data);
  if (response.status == 200) result = { ...response.data };

  return result;
}
