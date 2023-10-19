import 'dotenv/config';
import {init}  from './init';
import {log} from './_helpers/logs';


async function main() {

  // Init
  // ===================================================================================================================
  log('app','info','Starting up...');
  log('app','info','Here are your environment variables:');
  log('app','info',process.env);

  const {ha, openai } = await init();
  log('app','info','Initialized.');
}

main();