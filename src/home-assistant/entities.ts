/**
 * Returns an array of entities that match a set of filters
 * @param {Array} states - An array of state objects.
 * @param {Array} filters - An array of filter objects, each containing a key and a value.
 * @param {string} returnProperty - (Optional) A property to return from each entity.
 * @param {boolean} returnState - (Optional) If true, the state of each entity will be returned in addition to the returnProperty.
 * @returns {Array} - An array of entities that match the filter criteria.
 */
export function getEntities(
  states,
  filters = [],
  returnProperty = null,
  returnState = false,
) {
  if (!Array.isArray(filters)) {
    throw new Error("Filters must be an array");
  }
  if (filters.filter((filter) => !filter.key || !filter.value).length > 0) {
    throw new Error("Filters must contain a key and a value");
  }
  let entities = addDomainToEntities(states);
  filters.forEach((filter) => {
    entities = entities.filter((entity) => {
      const keys = filter.key.split(".");
      let value = entity;
      for (const key of keys) {
        value = value[key];
      }
      return value === filter.value;
    });
  });
  if (returnProperty) {
    entities = entities.map((entity) => {
      const keys = returnProperty.split(".");
      let value = entity;
      for (const key of keys) {
        value = value[key];
      }
      return returnState ? `${value} (${entity.state})` : value;
    });
  }
  return entities;
}
/**
 * Adds a domain property to each entity in an array of state objects.
 * @param {Array} states - An array of state objects.
 * @returns {Array} - An array of state objects with a domain property added to each entity.
 */
export function addDomainToEntities(states) {
  return states.map((el) => {
    el.domain = el.entity_id.split(".")[0];
    return el;
  });
}

/**
 * Returns a summary of the state of each entity in an array of state objects.
 * @param {Array} states - An array of state objects.
 * @returns {Array} - An array of strings summarizing the state of each entity.
 */
export function summarizeEntities(states) {
  return states.map((el) => {
    const attributes = Object.keys(el.attributes).map((key) => {
      return `${key}: ${el.attributes[key]}`;
    });
    return `${el.attributes.friendly_name} — (id: ${el.entity_id}): ${
      el.state
    } (${attributes.join(", ")})`;
  });
}
