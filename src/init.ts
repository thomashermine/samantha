import 'dotenv/config'
import homeassistant from 'homeassistant';
import OpenAI from 'openai';
import {HOME_ASSISTANT_TOKEN, HOME_ASSISTANT_HOST, OPENAI_TOKEN} from './config'
import {log} from './_helpers/logs'


export async function init() {
  const ha = new homeassistant({
    host: HOME_ASSISTANT_HOST,
    port: 8123,
    token: HOME_ASSISTANT_TOKEN,
  });
  const haStatus = await ha.status();
  log('ha','debug',haStatus.message);
  const openai = new OpenAI({
    apiKey: OPENAI_TOKEN,
  });
  log('openai','debug','Initialized.');
  return {ha,openai};
}