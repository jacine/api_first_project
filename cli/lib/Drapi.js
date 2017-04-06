const fetch = require('node-fetch');

/**
 * Value object for a bearer token.
 */
class BearerToken {
  constructor(access_token, refresh_token, expires_in) {
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
    this.expiresIn = expires_in;
  }

  static create(data) {
    return new BearerToken(data.access_token, data.refresh_token, data.expires_in);
  }
}

/**
 * Value object for a entity view display configuration.
 */
class EntityViewDisplay {
  constructor(entity_type, bundle, mode, content) {
    this.entityType = entity_type;
    this.bundle = bundle;
    this.mode = mode;
    this.content = content;
    this.getComponents = this.getComponents.bind(this);
  }

  getComponents() {
    return this.content;
  }
}

/**
 * Value object for a view display component (formatter).
 */
class EntityViewDisplayComponent {
  constructor(type, weight, settings, region) {
    this.type = type;
    this.weight = weight || 0;
    this.settings = settings || {};
    this.region = region || 'content';
  }
}

/**
 * Value object for a entity form display configuration.
 */
class EntityFormDisplay {
  constructor(entity_type, bundle, mode, content) {
    this.entityType = entity_type;
    this.bundle = bundle;
    this.mode = mode;
    this.content = content;
    this.getComponents = this.getComponents.bind(this);
  }

  getComponents() {
    return this.content;
  }
}

/**
 * Value object for a view form component (formatter).
 */
class EntityFormDisplayComponent {
  constructor(type, weight, settings, region) {
    this.type = type;
    this.weight = weight || 0;
    this.settings = settings || {};
    this.region = region || 'content';
  }
}

/**
 * Fetches a view display and returns a promise.
 *
 * @param {string} hostname
 * @param {string} entityType
 *   The entity type.
 * @param {string} bundle
 *   The bundle.
 * @param {string} viewMode
 *   The view mode.
 * @param {BearerToken} bearerToken
 *   The bearer token fetched via oAuthTokenRequest.
 *
 * @returns {Promise.<EntityViewDisplay>}
 *   A promise which returns a EntityViewDisplay object.
 */
function fetchViewDisplay(hostname, entityType, bundle, viewMode, bearerToken) {
  const url = hostname + `/jsonapi/entity_view_display/entity_view_display?filter[targetEntityType][value]=${entityType}&filter[bundle][value]=${bundle}&filter[mode][value]=${viewMode}`;

  return fetch(url, {headers: {Authorization: 'Bearer ' + bearerToken.accessToken}})
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.data.length > 0) {
        return json.data[0].attributes;
      }
      throw new Error('No matching view mode found');
    })
    .then((viewDisplayData) => {
      const content = {};
      Object.keys(viewDisplayData.content).forEach((key) => {
        const single_component = viewDisplayData.content[key];
        if (typeof single_component.type !== undefined) {
          content[key] = new EntityViewDisplayComponent(single_component.type, single_component.weight, single_component.settings, single_component.region);
        }
      });
      return new EntityViewDisplay(viewDisplayData.targetEntityType, viewDisplayData.bundle, viewDisplayData.mode, content);
    });
}


/**
 * Fetches a form display and returns a promise.
 *
 * @param {string} hostname
 * @param {string} entityType
 *   The entity type.
 * @param {string} bundle
 *   The bundle.
 * @param {string} formMode
 *   The form mode.
 * @param {BearerToken} bearerToken
 *   The bearer token fetched via oAuthTokenRequest.
 *
 * @returns {Promise.<EntityFormDisplay>}
 *   A promise which returns a EntityFormDisplay object.
 */
function fetchFormDisplay(hostname, entityType, bundle, formMode, bearerToken) {
  const url = hostname + `/jsonapi/entity_form_display/entity_form_display?filter[targetEntityType][value]=${entityType}&filter[bundle][value]=${bundle}&filter[mode][value]=${formMode}`;

  return fetch(url, {headers: {Authorization: 'Bearer ' + bearerToken.accessToken}})
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.data.length > 0) {
        return json.data[0].attributes;
      }
      throw new Error('No matching form mode found');
    })
    .then((viewDisplayData) => {
      const content = {};
      Object.keys(viewDisplayData.content).forEach((key) => {
        const single_component = viewDisplayData.content[key];
        content[key] = new EntityFormDisplayComponent(single_component.type, single_component.weight, single_component.settings, single_component.region);
      });

      return new EntityFormDisplay(viewDisplayData.targetEntityType, viewDisplayData.bundle, viewDisplayData.mode, content);
    });
}

/**
 * Fires up a oauth request and returns 
 * 
 * @param hostname
 * @param postData
 * @returns {Promise.<BearerToken>}
 */
function oAuthTokenRequest(hostname, postData) {
  const url = hostname + '/oauth/token';
  return fetch(url, {
    method: 'POST',
    body: serialize(postData),
    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer'},
  })
    .then((result) => {
      return result.json();
    })
    .catch(console.error);
}

function serialize(data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
}

module.exports = {
  BearerToken: BearerToken,
  oAuthTokenRequest: oAuthTokenRequest,
  fetchFormDisplay: fetchFormDisplay,
  fetchViewDisplay: fetchViewDisplay,
};
