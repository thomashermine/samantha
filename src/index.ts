import 'dotenv/config';

import {log} from './_helpers/logs';
import {sleep} from './_helpers/sleep';

import {
  SUMMARY_DEVICES_ENTITIES,
  UPDATE_INTERVAL,
} from './config';
import {init}  from './init';
import {updateDeviceSummary} from './summary'

async function main() {

  // Init
  // ===================================================================================================================
  log('app','info','Starting up...');
  const {ha, openai } = await init();
  log('app','info','Initialized.');


  // Jobs
  // ===================================================================================================================
  const states = await ha.states.list();

  while(true) {

    // Device Summaries
    // ===================================================================================================================
    log('app','info',`Updating summary for ${SUMMARY_DEVICES_ENTITIES.length} devices...`);
    await Promise.allSettled(SUMMARY_DEVICES_ENTITIES.map(device => updateDeviceSummary(openai, ha, states, device)));
    log('app','info',`Summary updated for ${SUMMARY_DEVICES_ENTITIES.length} devices.`);

    // Sleep till next run
    // ===================================================================================================================
    // TODO: Implement publish/subscribe pattern to avoid polling
    log('app','info',`Sleeping for ${UPDATE_INTERVAL/1000} seconds...`);
    await sleep(UPDATE_INTERVAL);

  }
}

main();