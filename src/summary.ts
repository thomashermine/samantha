import 'dotenv/config';
import {summarizeEntities} from './_helpers/ha';
import {getFirstChatResponse} from './_helpers/openai';
import {log} from './_helpers/logs';
import {SUMMARY_DEVICE_ENTITY_PREFIX} from './config';

/**
 * Get a prompt for summarizing the state of a device
 * @param {Array} states - List of states of all entities
 * @param {string} deviceName - Name of the device to summarize
 * @param {Object} paramOptions - Options for the prompt
 * @param {number} paramOptions.length - Maximum length of the prompt
 * @param {string} paramOptions.customPrompt - Custom prompt to add to the briefing
 * @returns {string} - Prompt for summarizing the state of the device
 */
export function getPromptForDeviceSummary(states, deviceName, paramOptions) {
    if(!states || states.length === 0) {
        throw new Error('States must be an array');
    }
    const deviceEntities = states.filter(el => el.entity_id.includes(deviceName));
    if(deviceEntities.length === 0) {
        log('app','warn',`No entity found for device ${deviceName}`);
        return null;
    }
    const summary = summarizeEntities(deviceEntities);
    const defaultOptions = {
        length: 200,
        customPrompt: '',    
    }
    const options = {
        ...defaultOptions,
        ...paramOptions,
    }

    let prompt = [];
    const briefing = `
    Following is an overview of the state of a device.
    Summarize it in less than ${options.length} characters.
    Do not start nor include the name of the device. Do not start by "summary" or "briefing" or "device".
    Only keep the most important information, do not give everything you have. ALWAYS keep it short. 
    Prioritize errors, last state changes, and then only the rest.
    Write a single sentence, as if your were  do not use bullets point, separator, line breaks.
    Ignore device containing "summary" or "briefing" or "device" in their name.
    ${options.customPrompt}
    `;
    prompt.push(briefing);
    prompt = [...prompt, ...summary];
    return prompt.join('\n');
}

/**
 * Get a summary of the state of a device
 * @param {Object} openai - OpenAI API instance
 * @param {Object} ha - Home Assistant instance
 * @param {Array} states - List of states of all entities
 * @param {string} deviceName - Name of the device to summarize
 * @param {Object} paramOptions - Options for the prompt
 * @param {number} paramOptions.length - Maximum length of the prompt
 * @param {string} paramOptions.customPrompt - Custom prompt to add to the briefing
 * @returns {Promise<string>} - Promise that resolves to a summary of the state of the device
 */
export async function getDeviceSummary(openai, ha, states, deviceName, paramOptions) {
    const prompt = getPromptForDeviceSummary(states, deviceName, paramOptions);
    if(!prompt) {
        return null;
    }
    const summary = getFirstChatResponse(openai, prompt);
    return summary;
}

/**
 * Update the summary of the state of a device
 * @param {Object} openai - OpenAI API instance
 * @param {Object} ha - Home Assistant instance
 * @param {Array} states - List of states of all entities
 * @param {string} deviceName - Name of the device to summarize
 * @param {Object} paramOptions - Options for the prompt
 * @param {number} paramOptions.length - Maximum length of the prompt
 * @param {string} paramOptions.customPrompt - Custom prompt to add to the briefing
 * @returns {Promise<Object>} - Promise that resolves to the updated summary entity
 */
export async function updateDeviceSummary(openai, ha, states, deviceName, paramOptions) {
    const summary = await getDeviceSummary(openai, ha, states, deviceName, paramOptions);
    if(!summary) {
        return null;
    }
    return ha.states.update('sensor', `${SUMMARY_DEVICE_ENTITY_PREFIX}${deviceName}`, {
        state: 1,
        attributes: {
          content: summary,
          last_updated: new Date().toISOString(),
        }
      });
}