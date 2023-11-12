import 'dotenv/config';

import {log} from './_helpers/logs';
import {sleep} from './_helpers/sleep';

import {
  SUMMARY_DEVICES_ENTITIES,
  SUMMARY_DEVICE_ENTITY_PREFIX,
  UPDATE_INTERVAL,
} from './config';
import {init}  from './init';
import {updateDeviceSummary} from './summary.device'

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
    await Promise.all(SUMMARY_DEVICES_ENTITIES.map(device => updateDeviceSummary(openai, ha, states, device)));
    log('app','info',`Summary updated for ${SUMMARY_DEVICES_ENTITIES.length} devices.`);

    // Device Summaries, Summary
    // ===================================================================================================================
    const deviceSummaries = states.filter(state => state.entity_id.startsWith('sensor.'+SUMMARY_DEVICE_ENTITY_PREFIX));
    const deviceSummariesStates = deviceSummaries.map(state => state.attributes.content);
    console.log(deviceSummariesStates);



    // Sleep till next run
    // ===================================================================================================================
    // TODO: Implement publish/subscribe pattern to avoid polling
    log('app','info',`Sleeping for ${UPDATE_INTERVAL/1000} seconds...`);
    await sleep(UPDATE_INTERVAL);

  }
  //console.log(summary);

  //prompt.push(briefing);
  //prompt.push(

  // const blocks = [
  //   // All on lights 
  //   {
  //   iterators: ["light"],
  //   filters : [{key: 'domain', value: 'iterator'}],
  //   returnProperty : 'attributes.friendly_name',
  //   },
  //   // All on motions, door, windows
  //   {
  //     iterators: ["motion","door","window"],
  //     filters : [{key: 'attributes.device_class', value: 'iterator'}],
  //     returnProperty : 'attributes.friendly_name',
  //   },
  //   // All vacuum and locks, no matter the state
  //   {
  //     iterators: ["vacuum","lock","weather"],
  //     filters : [{key: 'domain', value: 'iterator'}],
  //     returnProperty : 'attributes.friendly_name',
  //   },
  //   // All temperature & humidity sensors
  //   {
  //     iterators: ["temperature",'humidity'],
  //     filters : [{key: 'domain', value: 'sensor'},{key: 'attributes.device_class', value: 'temperature'}],
  //     returnProperty : 'attributes.friendly_name',
  //   },
  // ]; 

  // for (const block of blocks) {
  //   for (const iterator of block.iterators) {
  //     const cleanedFilter = block.filters.map(filter => {
  //       return {key: filter.key.replace('iterator', iterator), value: filter.value.replace('iterator', iterator)}
  //     });
  //     const entities = getEntities(states, cleanedFilter, block.returnProperty, true);
  //     prompt.push(`${iterator} ${entities.join(',')}`);
  //   }
  // }
  //console.log(prompt.join('\n\n'));


}

main();