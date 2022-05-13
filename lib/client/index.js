/*external modules*/
/*lib*/
import packageJSON from '../../package.json' assert { type: 'json' };
import Request from '../request/index.js'
/*utils*/
import {
  isPureObject,
  setValueIfNotNil
} from '../utils/index.js'
/*other*/

class Client {

  /**
   *    params: {
   *      apiKey: String | undefined
   *      apiSecret: String | undefined
   *      apiToken: String | undefined
   *      options: (null | undefined) | {
   *        requestHeaders: Object | undefined
   *        timeout: Number | undefined
   *        proxyUrl: String | undefined
   *      }
   *      config: (null | undefined) | {
   *        host: String | undefined
   *        version: String | undefined
   *        output: String | undefined
   *        performAPICall: Boolean | undefined
   *      }
   *    }
   * */

  constructor(params) {
    if(!isPureObject(params)) {
      throw new Error(`Argument "params" must be object`)
    }

    return this.init(this.cloneParams(params));
  }

  init(params) {
    if(!isPureObject(params)) {
      throw new Error(`Argument "params" must be object`)
    }

    const {
      apiToken,
      apiKey,
      apiSecret,
      options,
      config
    } = params;

    this.version = Client.packageJSON.version;

    this.setConfig(config ?? null);
    this.setOptions(options ?? null);

    if('apiToken' in params) {
      return this.tokenConnectStrategy(apiToken)
    } else {
      return this.basicConnectStrategy(apiKey, apiSecret)
    }
  }

  cloneParams(params) {
    if(!isPureObject(params)) {
      throw new Error(`Argument "params" must be object`)
    }

    const clonedParams = { ...params };

    if(params.options) {
      clonedParams.options = { ...params.options }
    }
    if(params.config) {
      clonedParams.config = { ...params.config }
    }

    return clonedParams;
  }

  setConfig(customConfig) {
    if(typeof customConfig !== 'object') {
      throw new Error('Argument "customConfig" must be object or null');
    }

    const config = { ...Client.config }

    if (customConfig !== null) {
      setValueIfNotNil(config, 'host', customConfig.host)
      setValueIfNotNil(config, 'output', customConfig.output)
      setValueIfNotNil(config, 'version', customConfig.version)
      setValueIfNotNil(config, 'performAPICall', customConfig.performAPICall)
    }

    this.config = config;

    return this;
  }

  setOptions(options) {
    if(typeof options !== 'object') {
      throw new Error('Argument "options" must be object or null');
    }

    this.options = options ?? {};

    return this;
  }

  tokenConnectStrategy(apiToken) {
    if(!apiToken) {
      throw new Error('Mailjet API_TOKEN is required');
    }

    this.apiToken = apiToken;

    return this;
  }

  basicConnectStrategy(apiKey, apiSecret) {
    if (!apiKey) {
      throw new Error('Mailjet API_KEY is required');
    }
    if (!apiSecret) {
      throw new Error('Mailjet API_SECRET is required');
    }

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    return this;
  }

  get(resource, config) {
    return new Request(this, 'get', resource, config)
  }

  post(resource, config) {
    return new Request(this, 'post', resource, config)
  }

  put(resource, config) {
    return new Request(this, 'put', resource, config)
  }

  delete(resource, config) {
    return new Request(this, 'delete', resource, config)
  }

  static apiConnect(apiKey, apiSecret, params) {
    return new Client({ apiKey, apiSecret, ...params })
  }

  static smsConnect(apiToken, params) {
    return new Client({ apiToken, ...params })
  }

  static config = Object.freeze({
    host: 'api.mailjet.com',
    version: 'v3',
    output: 'json',
    performAPICall: true
  })

  static packageJSON = Object.freeze({
    ...packageJSON
  })

}

export default Client;