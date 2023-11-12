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
    const deviceEntities = states
    .filter(el => el.entity_id.includes(deviceName))
    .filter(el => !el.entity_id.includes(SUMMARY_DEVICE_ENTITY_PREFIX)); // Ignoring ourselves
    if(deviceEntities.length === 0) {
        log('app','warn',`No entity found for device ${deviceName}`);
        return null;
    }
    const summary = summarizeEntities(deviceEntities);
    const defaultOptions = {
        length: 100,
        customPrompt: '',    
    }
    const options = {
        ...defaultOptions,
        ...paramOptions,
    }

    let prompt = [];
    const briefing = `
    BRIEFING : 
    Following is an overview of the state of a device. 
    You must filter out the noise and respond with a single sentence, no bullets points summary of maximum ${options.length} characters. 
    Keep the summary short no matter the amount of data you are given.
    Only keep errors, warnings, statuses, entities called "Dock Status" and other important information.
    Dont write "error" or "warning" if you dont see any.
    Do not introduce with "Summary" or "Résumé", just the content itself.
    Round float value to integer. Transform any duration in seconds to minutes.
    Ignore any "unknown" or "unavailable" state.
    ${options.customPrompt}
    CONTEXT :
    For relative date calculation, today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}.
    DATA : 
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
        log('app','warn',`No prompt found for device ${deviceName}`);
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
        log('app','warn',`No summary found for device ${deviceName}`);
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