import {getEntities, addDomainToEntities, summarizeEntities} from '../_helpers/ha';

const mockStates = [
  { entity_id: 'binary_sensor.entry_door', attributes: { device_class: 'door'}, state: 'off' },
  { entity_id: 'binary_sensor.front_door', attributes: { device_class: 'door'}, state: 'on' },
  { entity_id: 'binary_sensor.living_window', attributes: { device_class: 'window'}, state: 'off' },
  { entity_id: 'light.living', state: 'off', attributes: {} },
  { entity_id: 'light.living', state: 'on', attributes: {}},
];  

describe('getEntities', () => {
  it('should return all entities if no filter is applied', () => {
    const result = getEntities(mockStates);
    expect(result).toEqual(mockStates);
  });

  it('should return an array of entities for a specific domain', () => {
    const result = getEntities(mockStates, [{key: 'domain', value: 'binary_sensor'}], 'entity_id');
    expect(result).toEqual([
      'binary_sensor.entry_door',
      'binary_sensor.front_door',
      'binary_sensor.living_window',
    ]);
  });
  it('should return an array of entities for a specific domain with their state', () => {
    const result = getEntities(mockStates, [{key: 'domain', value: 'binary_sensor'}], 'entity_id', true);
    expect(result).toEqual([
      'binary_sensor.entry_door (off)',
      'binary_sensor.front_door (on)',
      'binary_sensor.living_window (off)',
    ]);
  });

  it('should return an array of entities with a specific state', () => {
    const result = getEntities(mockStates, [{key: 'state', value: 'on'}], 'entity_id');
    expect(result).toEqual([
      'binary_sensor.front_door',
      'light.living',
    ]);
  });

  it('should return an array of entities with a specific device_class', () => {
    const result = getEntities(mockStates, [{key: 'attributes.device_class', value: 'door'}], 'entity_id');
    expect(result).toEqual([
      'binary_sensor.entry_door',
      'binary_sensor.front_door',
    ]);
  });

  it('should return an array of entities with a specific device_class and state', () => {
    const result = getEntities(mockStates, [ {key: 'attributes.device_class', value: 'door'}, {key: 'state', value: 'on'}], 'entity_id');
    expect(result).toEqual([
      'binary_sensor.front_door',
    ]);
  });
});

describe('addDomainToEntities', () => {
  it('should add domain property to each entity', () => {
    const states = [
      { entity_id: 'light.living_room', state: 'on', attributes: {} },
      { entity_id: 'switch.kitchen', state: 'off', attributes: {} },
    ];
    const expected = [
      { entity_id: 'light.living_room', state: 'on', attributes: {}, domain: 'light' },
      { entity_id: 'switch.kitchen', state: 'off', attributes: {}, domain: 'switch' },
    ];
    expect(addDomainToEntities(states)).toEqual(expected);
  });
});

describe('summarizeEntities', () => {
  it('should return an array of strings summarizing the state of each entity', () => {
    const states = [
      { entity_id: 'light.living_room', state: 'on', attributes: {} },
      { entity_id: 'switch.kitchen', state: 'off', attributes: {friendly_name: 'Kitchen Switch'} },
    ];
    const expected = [
      'light.living_room: on ()',
      'switch.kitchen: off (friendly_name: Kitchen Switch)',
    ];
    expect(summarizeEntities(states)).toEqual(expected);
  });
});