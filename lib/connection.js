"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _os = _interopRequireDefault(require("os"));
var tls = _interopRequireWildcard(require("tls"));
var net = _interopRequireWildcard(require("net"));
var _dns = _interopRequireDefault(require("dns"));
var _constants = _interopRequireDefault(require("constants"));
var _stream = require("stream");
var _identity = require("@azure/identity");
var _coreAuth = require("@azure/core-auth");
var _bulkLoad = _interopRequireDefault(require("./bulk-load"));
var _debug = _interopRequireDefault(require("./debug"));
var _events = require("events");
var _instanceLookup = require("./instance-lookup");
var _transientErrorLookup = require("./transient-error-lookup");
var _packet = require("./packet");
var _preloginPayload = _interopRequireDefault(require("./prelogin-payload"));
var _login7Payload = _interopRequireDefault(require("./login7-payload"));
var _ntlmPayload = _interopRequireDefault(require("./ntlm-payload"));
var _request = _interopRequireDefault(require("./request"));
var _rpcrequestPayload = _interopRequireDefault(require("./rpcrequest-payload"));
var _sqlbatchPayload = _interopRequireDefault(require("./sqlbatch-payload"));
var _messageIo = _interopRequireDefault(require("./message-io"));
var _tokenStreamParser = require("./token/token-stream-parser");
var _transaction = require("./transaction");
var _errors = require("./errors");
var _connector = require("./connector");
var _library = require("./library");
var _tdsVersions = require("./tds-versions");
var _message = _interopRequireDefault(require("./message"));
var _ntlm = require("./ntlm");
var _dataType = require("./data-type");
var _bulkLoadPayload = require("./bulk-load-payload");
var _specialStoredProcedure = _interopRequireDefault(require("./special-stored-procedure"));
var _package = require("../package.json");
var _url = require("url");
var _handler = require("./token/handler");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * @private
 */
const KEEP_ALIVE_INITIAL_DELAY = 30 * 1000;
/**
 * @private
 */
const DEFAULT_CONNECT_TIMEOUT = 15 * 1000;
/**
 * @private
 */
const DEFAULT_CLIENT_REQUEST_TIMEOUT = 15 * 1000;
/**
 * @private
 */
const DEFAULT_CANCEL_TIMEOUT = 5 * 1000;
/**
 * @private
 */
const DEFAULT_CONNECT_RETRY_INTERVAL = 500;
/**
 * @private
 */
const DEFAULT_PACKET_SIZE = 4 * 1024;
/**
 * @private
 */
const DEFAULT_TEXTSIZE = 2147483647;
/**
 * @private
 */
const DEFAULT_DATEFIRST = 7;
/**
 * @private
 */
const DEFAULT_PORT = 1433;
/**
 * @private
 */
const DEFAULT_TDS_VERSION = '7_4';
/**
 * @private
 */
const DEFAULT_LANGUAGE = 'us_english';
/**
 * @private
 */
const DEFAULT_DATEFORMAT = 'mdy';

/** Structure that defines the options that are necessary to authenticate the Tedious.JS instance with an `@azure/identity` token credential. */

/**
 * @private
 */

/**
 * Helper function, equivalent to `Promise.withResolvers()`.
 *
 * @returns An object with the properties `promise`, `resolve`, and `reject`.
 */
function withResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve,
    reject: reject
  };
}

/**
 * A [[Connection]] instance represents a single connection to a database server.
 *
 * ```js
 * var Connection = require('tedious').Connection;
 * var config = {
 *  "authentication": {
 *    ...,
 *    "options": {...}
 *  },
 *  "options": {...}
 * };
 * var connection = new Connection(config);
 * ```
 *
 * Only one request at a time may be executed on a connection. Once a [[Request]]
 * has been initiated (with [[Connection.callProcedure]], [[Connection.execSql]],
 * or [[Connection.execSqlBatch]]), another should not be initiated until the
 * [[Request]]'s completion callback is called.
 */
class Connection extends _events.EventEmitter {
  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * Note: be aware of the different options field:
   * 1. config.authentication.options
   * 2. config.options
   *
   * ```js
   * const { Connection } = require('tedious');
   *
   * const config = {
   *  "authentication": {
   *    ...,
   *    "options": {...}
   *  },
   *  "options": {...}
   * };
   *
   * const connection = new Connection(config);
   * ```
   *
   * @param config
   */
  constructor(config) {
    super();
    if (typeof config !== 'object' || config === null) {
      throw new TypeError('The "config" argument is required and must be of type Object.');
    }
    if (typeof config.server !== 'string') {
      throw new TypeError('The "config.server" property is required and must be of type string.');
    }
    this.fedAuthRequired = false;
    let authentication;
    if (config.authentication !== undefined) {
      if (typeof config.authentication !== 'object' || config.authentication === null) {
        throw new TypeError('The "config.authentication" property must be of type Object.');
      }
      const type = config.authentication.type;
      const options = config.authentication.options === undefined ? {} : config.authentication.options;
      if (typeof type !== 'string') {
        throw new TypeError('The "config.authentication.type" property must be of type string.');
      }
      if (type !== 'default' && type !== 'ntlm' && type !== 'token-credential' && type !== 'azure-active-directory-password' && type !== 'azure-active-directory-access-token' && type !== 'azure-active-directory-msi-vm' && type !== 'azure-active-directory-msi-app-service' && type !== 'azure-active-directory-service-principal-secret' && type !== 'azure-active-directory-default') {
        throw new TypeError('The "type" property must one of "default", "ntlm", "token-credential", "azure-active-directory-password", "azure-active-directory-access-token", "azure-active-directory-default", "azure-active-directory-msi-vm" or "azure-active-directory-msi-app-service" or "azure-active-directory-service-principal-secret".');
      }
      if (typeof options !== 'object' || options === null) {
        throw new TypeError('The "config.authentication.options" property must be of type object.');
      }
      if (type === 'ntlm') {
        if (typeof options.domain !== 'string') {
          throw new TypeError('The "config.authentication.options.domain" property must be of type string.');
        }
        if (options.userName !== undefined && typeof options.userName !== 'string') {
          throw new TypeError('The "config.authentication.options.userName" property must be of type string.');
        }
        if (options.password !== undefined && typeof options.password !== 'string') {
          throw new TypeError('The "config.authentication.options.password" property must be of type string.');
        }
        authentication = {
          type: 'ntlm',
          options: {
            userName: options.userName,
            password: options.password,
            domain: options.domain && options.domain.toUpperCase()
          }
        };
      } else if (type === 'token-credential') {
        if (!(0, _coreAuth.isTokenCredential)(options.credential)) {
          throw new TypeError('The "config.authentication.options.credential" property must be an instance of the token credential class.');
        }
        authentication = {
          type: 'token-credential',
          options: {
            credential: options.credential
          }
        };
      } else if (type === 'azure-active-directory-password') {
        if (typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        if (options.userName !== undefined && typeof options.userName !== 'string') {
          throw new TypeError('The "config.authentication.options.userName" property must be of type string.');
        }
        if (options.password !== undefined && typeof options.password !== 'string') {
          throw new TypeError('The "config.authentication.options.password" property must be of type string.');
        }
        if (options.tenantId !== undefined && typeof options.tenantId !== 'string') {
          throw new TypeError('The "config.authentication.options.tenantId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-password',
          options: {
            userName: options.userName,
            password: options.password,
            tenantId: options.tenantId,
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-access-token') {
        if (typeof options.token !== 'string') {
          throw new TypeError('The "config.authentication.options.token" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-access-token',
          options: {
            token: options.token
          }
        };
      } else if (type === 'azure-active-directory-msi-vm') {
        if (options.clientId !== undefined && typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-msi-vm',
          options: {
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-default') {
        if (options.clientId !== undefined && typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-default',
          options: {
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-msi-app-service') {
        if (options.clientId !== undefined && typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-msi-app-service',
          options: {
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-service-principal-secret') {
        if (typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        if (typeof options.clientSecret !== 'string') {
          throw new TypeError('The "config.authentication.options.clientSecret" property must be of type string.');
        }
        if (typeof options.tenantId !== 'string') {
          throw new TypeError('The "config.authentication.options.tenantId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-service-principal-secret',
          options: {
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            tenantId: options.tenantId
          }
        };
      } else {
        if (options.userName !== undefined && typeof options.userName !== 'string') {
          throw new TypeError('The "config.authentication.options.userName" property must be of type string.');
        }
        if (options.password !== undefined && typeof options.password !== 'string') {
          throw new TypeError('The "config.authentication.options.password" property must be of type string.');
        }
        authentication = {
          type: 'default',
          options: {
            userName: options.userName,
            password: options.password
          }
        };
      }
    } else {
      authentication = {
        type: 'default',
        options: {
          userName: undefined,
          password: undefined
        }
      };
    }
    this.config = {
      server: config.server,
      authentication: authentication,
      options: {
        abortTransactionOnError: false,
        appName: undefined,
        camelCaseColumns: false,
        cancelTimeout: DEFAULT_CANCEL_TIMEOUT,
        columnEncryptionKeyCacheTTL: 2 * 60 * 60 * 1000,
        // Units: milliseconds
        columnEncryptionSetting: false,
        columnNameReplacer: undefined,
        connectionRetryInterval: DEFAULT_CONNECT_RETRY_INTERVAL,
        connectTimeout: DEFAULT_CONNECT_TIMEOUT,
        connector: undefined,
        connectionIsolationLevel: _transaction.ISOLATION_LEVEL.READ_COMMITTED,
        cryptoCredentialsDetails: {},
        database: undefined,
        datefirst: DEFAULT_DATEFIRST,
        dateFormat: DEFAULT_DATEFORMAT,
        debug: {
          data: false,
          packet: false,
          payload: false,
          token: false
        },
        enableAnsiNull: true,
        enableAnsiNullDefault: true,
        enableAnsiPadding: true,
        enableAnsiWarnings: true,
        enableArithAbort: true,
        enableConcatNullYieldsNull: true,
        enableCursorCloseOnCommit: null,
        enableImplicitTransactions: false,
        enableNumericRoundabort: false,
        enableQuotedIdentifier: true,
        encrypt: true,
        fallbackToDefaultDb: false,
        encryptionKeyStoreProviders: undefined,
        instanceName: undefined,
        isolationLevel: _transaction.ISOLATION_LEVEL.READ_COMMITTED,
        language: DEFAULT_LANGUAGE,
        localAddress: undefined,
        maxRetriesOnTransientErrors: 3,
        multiSubnetFailover: false,
        packetSize: DEFAULT_PACKET_SIZE,
        port: DEFAULT_PORT,
        readOnlyIntent: false,
        requestTimeout: DEFAULT_CLIENT_REQUEST_TIMEOUT,
        rowCollectionOnDone: false,
        rowCollectionOnRequestCompletion: false,
        serverName: undefined,
        serverSupportsColumnEncryption: false,
        tdsVersion: DEFAULT_TDS_VERSION,
        textsize: DEFAULT_TEXTSIZE,
        trustedServerNameAE: undefined,
        trustServerCertificate: false,
        useColumnNames: false,
        useUTC: true,
        workstationId: undefined,
        lowerCaseGuids: false
      }
    };
    if (config.options) {
      if (config.options.port && config.options.instanceName) {
        throw new Error('Port and instanceName are mutually exclusive, but ' + config.options.port + ' and ' + config.options.instanceName + ' provided');
      }
      if (config.options.abortTransactionOnError !== undefined) {
        if (typeof config.options.abortTransactionOnError !== 'boolean' && config.options.abortTransactionOnError !== null) {
          throw new TypeError('The "config.options.abortTransactionOnError" property must be of type string or null.');
        }
        this.config.options.abortTransactionOnError = config.options.abortTransactionOnError;
      }
      if (config.options.appName !== undefined) {
        if (typeof config.options.appName !== 'string') {
          throw new TypeError('The "config.options.appName" property must be of type string.');
        }
        this.config.options.appName = config.options.appName;
      }
      if (config.options.camelCaseColumns !== undefined) {
        if (typeof config.options.camelCaseColumns !== 'boolean') {
          throw new TypeError('The "config.options.camelCaseColumns" property must be of type boolean.');
        }
        this.config.options.camelCaseColumns = config.options.camelCaseColumns;
      }
      if (config.options.cancelTimeout !== undefined) {
        if (typeof config.options.cancelTimeout !== 'number') {
          throw new TypeError('The "config.options.cancelTimeout" property must be of type number.');
        }
        this.config.options.cancelTimeout = config.options.cancelTimeout;
      }
      if (config.options.columnNameReplacer) {
        if (typeof config.options.columnNameReplacer !== 'function') {
          throw new TypeError('The "config.options.cancelTimeout" property must be of type function.');
        }
        this.config.options.columnNameReplacer = config.options.columnNameReplacer;
      }
      if (config.options.connectionIsolationLevel !== undefined) {
        (0, _transaction.assertValidIsolationLevel)(config.options.connectionIsolationLevel, 'config.options.connectionIsolationLevel');
        this.config.options.connectionIsolationLevel = config.options.connectionIsolationLevel;
      }
      if (config.options.connectTimeout !== undefined) {
        if (typeof config.options.connectTimeout !== 'number') {
          throw new TypeError('The "config.options.connectTimeout" property must be of type number.');
        }
        this.config.options.connectTimeout = config.options.connectTimeout;
      }
      if (config.options.connector !== undefined) {
        if (typeof config.options.connector !== 'function') {
          throw new TypeError('The "config.options.connector" property must be a function.');
        }
        this.config.options.connector = config.options.connector;
      }
      if (config.options.cryptoCredentialsDetails !== undefined) {
        if (typeof config.options.cryptoCredentialsDetails !== 'object' || config.options.cryptoCredentialsDetails === null) {
          throw new TypeError('The "config.options.cryptoCredentialsDetails" property must be of type Object.');
        }
        this.config.options.cryptoCredentialsDetails = config.options.cryptoCredentialsDetails;
      }
      if (config.options.database !== undefined) {
        if (typeof config.options.database !== 'string') {
          throw new TypeError('The "config.options.database" property must be of type string.');
        }
        this.config.options.database = config.options.database;
      }
      if (config.options.datefirst !== undefined) {
        if (typeof config.options.datefirst !== 'number' && config.options.datefirst !== null) {
          throw new TypeError('The "config.options.datefirst" property must be of type number.');
        }
        if (config.options.datefirst !== null && (config.options.datefirst < 1 || config.options.datefirst > 7)) {
          throw new RangeError('The "config.options.datefirst" property must be >= 1 and <= 7');
        }
        this.config.options.datefirst = config.options.datefirst;
      }
      if (config.options.dateFormat !== undefined) {
        if (typeof config.options.dateFormat !== 'string' && config.options.dateFormat !== null) {
          throw new TypeError('The "config.options.dateFormat" property must be of type string or null.');
        }
        this.config.options.dateFormat = config.options.dateFormat;
      }
      if (config.options.debug) {
        if (config.options.debug.data !== undefined) {
          if (typeof config.options.debug.data !== 'boolean') {
            throw new TypeError('The "config.options.debug.data" property must be of type boolean.');
          }
          this.config.options.debug.data = config.options.debug.data;
        }
        if (config.options.debug.packet !== undefined) {
          if (typeof config.options.debug.packet !== 'boolean') {
            throw new TypeError('The "config.options.debug.packet" property must be of type boolean.');
          }
          this.config.options.debug.packet = config.options.debug.packet;
        }
        if (config.options.debug.payload !== undefined) {
          if (typeof config.options.debug.payload !== 'boolean') {
            throw new TypeError('The "config.options.debug.payload" property must be of type boolean.');
          }
          this.config.options.debug.payload = config.options.debug.payload;
        }
        if (config.options.debug.token !== undefined) {
          if (typeof config.options.debug.token !== 'boolean') {
            throw new TypeError('The "config.options.debug.token" property must be of type boolean.');
          }
          this.config.options.debug.token = config.options.debug.token;
        }
      }
      if (config.options.enableAnsiNull !== undefined) {
        if (typeof config.options.enableAnsiNull !== 'boolean' && config.options.enableAnsiNull !== null) {
          throw new TypeError('The "config.options.enableAnsiNull" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiNull = config.options.enableAnsiNull;
      }
      if (config.options.enableAnsiNullDefault !== undefined) {
        if (typeof config.options.enableAnsiNullDefault !== 'boolean' && config.options.enableAnsiNullDefault !== null) {
          throw new TypeError('The "config.options.enableAnsiNullDefault" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiNullDefault = config.options.enableAnsiNullDefault;
      }
      if (config.options.enableAnsiPadding !== undefined) {
        if (typeof config.options.enableAnsiPadding !== 'boolean' && config.options.enableAnsiPadding !== null) {
          throw new TypeError('The "config.options.enableAnsiPadding" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiPadding = config.options.enableAnsiPadding;
      }
      if (config.options.enableAnsiWarnings !== undefined) {
        if (typeof config.options.enableAnsiWarnings !== 'boolean' && config.options.enableAnsiWarnings !== null) {
          throw new TypeError('The "config.options.enableAnsiWarnings" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiWarnings = config.options.enableAnsiWarnings;
      }
      if (config.options.enableArithAbort !== undefined) {
        if (typeof config.options.enableArithAbort !== 'boolean' && config.options.enableArithAbort !== null) {
          throw new TypeError('The "config.options.enableArithAbort" property must be of type boolean or null.');
        }
        this.config.options.enableArithAbort = config.options.enableArithAbort;
      }
      if (config.options.enableConcatNullYieldsNull !== undefined) {
        if (typeof config.options.enableConcatNullYieldsNull !== 'boolean' && config.options.enableConcatNullYieldsNull !== null) {
          throw new TypeError('The "config.options.enableConcatNullYieldsNull" property must be of type boolean or null.');
        }
        this.config.options.enableConcatNullYieldsNull = config.options.enableConcatNullYieldsNull;
      }
      if (config.options.enableCursorCloseOnCommit !== undefined) {
        if (typeof config.options.enableCursorCloseOnCommit !== 'boolean' && config.options.enableCursorCloseOnCommit !== null) {
          throw new TypeError('The "config.options.enableCursorCloseOnCommit" property must be of type boolean or null.');
        }
        this.config.options.enableCursorCloseOnCommit = config.options.enableCursorCloseOnCommit;
      }
      if (config.options.enableImplicitTransactions !== undefined) {
        if (typeof config.options.enableImplicitTransactions !== 'boolean' && config.options.enableImplicitTransactions !== null) {
          throw new TypeError('The "config.options.enableImplicitTransactions" property must be of type boolean or null.');
        }
        this.config.options.enableImplicitTransactions = config.options.enableImplicitTransactions;
      }
      if (config.options.enableNumericRoundabort !== undefined) {
        if (typeof config.options.enableNumericRoundabort !== 'boolean' && config.options.enableNumericRoundabort !== null) {
          throw new TypeError('The "config.options.enableNumericRoundabort" property must be of type boolean or null.');
        }
        this.config.options.enableNumericRoundabort = config.options.enableNumericRoundabort;
      }
      if (config.options.enableQuotedIdentifier !== undefined) {
        if (typeof config.options.enableQuotedIdentifier !== 'boolean' && config.options.enableQuotedIdentifier !== null) {
          throw new TypeError('The "config.options.enableQuotedIdentifier" property must be of type boolean or null.');
        }
        this.config.options.enableQuotedIdentifier = config.options.enableQuotedIdentifier;
      }
      if (config.options.encrypt !== undefined) {
        if (typeof config.options.encrypt !== 'boolean') {
          if (config.options.encrypt !== 'strict') {
            throw new TypeError('The "encrypt" property must be set to "strict", or of type boolean.');
          }
        }
        this.config.options.encrypt = config.options.encrypt;
      }
      if (config.options.fallbackToDefaultDb !== undefined) {
        if (typeof config.options.fallbackToDefaultDb !== 'boolean') {
          throw new TypeError('The "config.options.fallbackToDefaultDb" property must be of type boolean.');
        }
        this.config.options.fallbackToDefaultDb = config.options.fallbackToDefaultDb;
      }
      if (config.options.instanceName !== undefined) {
        if (typeof config.options.instanceName !== 'string') {
          throw new TypeError('The "config.options.instanceName" property must be of type string.');
        }
        this.config.options.instanceName = config.options.instanceName;
        this.config.options.port = undefined;
      }
      if (config.options.isolationLevel !== undefined) {
        (0, _transaction.assertValidIsolationLevel)(config.options.isolationLevel, 'config.options.isolationLevel');
        this.config.options.isolationLevel = config.options.isolationLevel;
      }
      if (config.options.language !== undefined) {
        if (typeof config.options.language !== 'string' && config.options.language !== null) {
          throw new TypeError('The "config.options.language" property must be of type string or null.');
        }
        this.config.options.language = config.options.language;
      }
      if (config.options.localAddress !== undefined) {
        if (typeof config.options.localAddress !== 'string') {
          throw new TypeError('The "config.options.localAddress" property must be of type string.');
        }
        this.config.options.localAddress = config.options.localAddress;
      }
      if (config.options.multiSubnetFailover !== undefined) {
        if (typeof config.options.multiSubnetFailover !== 'boolean') {
          throw new TypeError('The "config.options.multiSubnetFailover" property must be of type boolean.');
        }
        this.config.options.multiSubnetFailover = config.options.multiSubnetFailover;
      }
      if (config.options.packetSize !== undefined) {
        if (typeof config.options.packetSize !== 'number') {
          throw new TypeError('The "config.options.packetSize" property must be of type number.');
        }
        this.config.options.packetSize = config.options.packetSize;
      }
      if (config.options.port !== undefined) {
        if (typeof config.options.port !== 'number') {
          throw new TypeError('The "config.options.port" property must be of type number.');
        }
        if (config.options.port <= 0 || config.options.port >= 65536) {
          throw new RangeError('The "config.options.port" property must be > 0 and < 65536');
        }
        this.config.options.port = config.options.port;
        this.config.options.instanceName = undefined;
      }
      if (config.options.readOnlyIntent !== undefined) {
        if (typeof config.options.readOnlyIntent !== 'boolean') {
          throw new TypeError('The "config.options.readOnlyIntent" property must be of type boolean.');
        }
        this.config.options.readOnlyIntent = config.options.readOnlyIntent;
      }
      if (config.options.requestTimeout !== undefined) {
        if (typeof config.options.requestTimeout !== 'number') {
          throw new TypeError('The "config.options.requestTimeout" property must be of type number.');
        }
        this.config.options.requestTimeout = config.options.requestTimeout;
      }
      if (config.options.maxRetriesOnTransientErrors !== undefined) {
        if (typeof config.options.maxRetriesOnTransientErrors !== 'number') {
          throw new TypeError('The "config.options.maxRetriesOnTransientErrors" property must be of type number.');
        }
        if (config.options.maxRetriesOnTransientErrors < 0) {
          throw new TypeError('The "config.options.maxRetriesOnTransientErrors" property must be equal or greater than 0.');
        }
        this.config.options.maxRetriesOnTransientErrors = config.options.maxRetriesOnTransientErrors;
      }
      if (config.options.connectionRetryInterval !== undefined) {
        if (typeof config.options.connectionRetryInterval !== 'number') {
          throw new TypeError('The "config.options.connectionRetryInterval" property must be of type number.');
        }
        if (config.options.connectionRetryInterval <= 0) {
          throw new TypeError('The "config.options.connectionRetryInterval" property must be greater than 0.');
        }
        this.config.options.connectionRetryInterval = config.options.connectionRetryInterval;
      }
      if (config.options.rowCollectionOnDone !== undefined) {
        if (typeof config.options.rowCollectionOnDone !== 'boolean') {
          throw new TypeError('The "config.options.rowCollectionOnDone" property must be of type boolean.');
        }
        this.config.options.rowCollectionOnDone = config.options.rowCollectionOnDone;
      }
      if (config.options.rowCollectionOnRequestCompletion !== undefined) {
        if (typeof config.options.rowCollectionOnRequestCompletion !== 'boolean') {
          throw new TypeError('The "config.options.rowCollectionOnRequestCompletion" property must be of type boolean.');
        }
        this.config.options.rowCollectionOnRequestCompletion = config.options.rowCollectionOnRequestCompletion;
      }
      if (config.options.tdsVersion !== undefined) {
        if (typeof config.options.tdsVersion !== 'string') {
          throw new TypeError('The "config.options.tdsVersion" property must be of type string.');
        }
        this.config.options.tdsVersion = config.options.tdsVersion;
      }
      if (config.options.textsize !== undefined) {
        if (typeof config.options.textsize !== 'number' && config.options.textsize !== null) {
          throw new TypeError('The "config.options.textsize" property must be of type number or null.');
        }
        if (config.options.textsize > 2147483647) {
          throw new TypeError('The "config.options.textsize" can\'t be greater than 2147483647.');
        } else if (config.options.textsize < -1) {
          throw new TypeError('The "config.options.textsize" can\'t be smaller than -1.');
        }
        this.config.options.textsize = config.options.textsize | 0;
      }
      if (config.options.trustServerCertificate !== undefined) {
        if (typeof config.options.trustServerCertificate !== 'boolean') {
          throw new TypeError('The "config.options.trustServerCertificate" property must be of type boolean.');
        }
        this.config.options.trustServerCertificate = config.options.trustServerCertificate;
      }
      if (config.options.serverName !== undefined) {
        if (typeof config.options.serverName !== 'string') {
          throw new TypeError('The "config.options.serverName" property must be of type string.');
        }
        this.config.options.serverName = config.options.serverName;
      }
      if (config.options.useColumnNames !== undefined) {
        if (typeof config.options.useColumnNames !== 'boolean') {
          throw new TypeError('The "config.options.useColumnNames" property must be of type boolean.');
        }
        this.config.options.useColumnNames = config.options.useColumnNames;
      }
      if (config.options.useUTC !== undefined) {
        if (typeof config.options.useUTC !== 'boolean') {
          throw new TypeError('The "config.options.useUTC" property must be of type boolean.');
        }
        this.config.options.useUTC = config.options.useUTC;
      }
      if (config.options.workstationId !== undefined) {
        if (typeof config.options.workstationId !== 'string') {
          throw new TypeError('The "config.options.workstationId" property must be of type string.');
        }
        this.config.options.workstationId = config.options.workstationId;
      }
      if (config.options.lowerCaseGuids !== undefined) {
        if (typeof config.options.lowerCaseGuids !== 'boolean') {
          throw new TypeError('The "config.options.lowerCaseGuids" property must be of type boolean.');
        }
        this.config.options.lowerCaseGuids = config.options.lowerCaseGuids;
      }
    }
    this.secureContextOptions = this.config.options.cryptoCredentialsDetails;
    if (this.secureContextOptions.secureOptions === undefined) {
      // If the caller has not specified their own `secureOptions`,
      // we set `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` here.
      // Older SQL Server instances running on older Windows versions have
      // trouble with the BEAST workaround in OpenSSL.
      // As BEAST is a browser specific exploit, we can just disable this option here.
      this.secureContextOptions = Object.create(this.secureContextOptions, {
        secureOptions: {
          value: _constants.default.SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS
        }
      });
    }
    this.debug = this.createDebug();
    this.inTransaction = false;
    this.transactionDescriptors = [Buffer.from([0, 0, 0, 0, 0, 0, 0, 0])];

    // 'beginTransaction', 'commitTransaction' and 'rollbackTransaction'
    // events are utilized to maintain inTransaction property state which in
    // turn is used in managing transactions. These events are only fired for
    // TDS version 7.2 and beyond. The properties below are used to emulate
    // equivalent behavior for TDS versions before 7.2.
    this.transactionDepth = 0;
    this.isSqlBatch = false;
    this.closed = false;
    this.messageBuffer = Buffer.alloc(0);
    this.curTransientRetryCount = 0;
    this.transientErrorLookup = new _transientErrorLookup.TransientErrorLookup();
    this.state = this.STATE.INITIALIZED;
    this._cancelAfterRequestSent = () => {
      this.messageIo.sendMessage(_packet.TYPE.ATTENTION);
      this.createCancelTimer();
    };
    this._onSocketClose = () => {
      this.socketClose();
    };
    this._onSocketEnd = () => {
      this.socketEnd();
    };
    this._onSocketError = error => {
      this.dispatchEvent('socketError', error);
      process.nextTick(() => {
        this.emit('error', this.wrapSocketError(error));
      });
    };
  }
  connect(connectListener) {
    if (this.state !== this.STATE.INITIALIZED) {
      throw new _errors.ConnectionError('`.connect` can not be called on a Connection in `' + this.state.name + '` state.');
    }
    if (connectListener) {
      const onConnect = err => {
        this.removeListener('error', onError);
        connectListener(err);
      };
      const onError = err => {
        this.removeListener('connect', onConnect);
        connectListener(err);
      };
      this.once('connect', onConnect);
      this.once('error', onError);
    }
    this.transitionTo(this.STATE.CONNECTING);
    this.initialiseConnection().then(() => {
      process.nextTick(() => {
        this.emit('connect');
      });
    }, err => {
      this.transitionTo(this.STATE.FINAL);
      this.closed = true;
      process.nextTick(() => {
        this.emit('connect', err);
      });
      process.nextTick(() => {
        this.emit('end');
      });
    });
  }

  /**
   * The server has reported that the charset has changed.
   */

  /**
   * The attempt to connect and validate has completed.
   */

  /**
   * The server has reported that the active database has changed.
   * This may be as a result of a successful login, or a `use` statement.
   */

  /**
   * A debug message is available. It may be logged or ignored.
   */

  /**
   * Internal error occurs.
   */

  /**
   * The server has issued an error message.
   */

  /**
   * The connection has ended.
   *
   * This may be as a result of the client calling [[close]], the server
   * closing the connection, or a network error.
   */

  /**
   * The server has issued an information message.
   */

  /**
   * The server has reported that the language has changed.
   */

  /**
   * The connection was reset.
   */

  /**
   * A secure connection has been established.
   */

  on(event, listener) {
    return super.on(event, listener);
  }

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  emit(event, ...args) {
    return super.emit(event, ...args);
  }

  /**
   * Closes the connection to the database.
   *
   * The [[Event_end]] will be emitted once the connection has been closed.
   */
  close() {
    this.transitionTo(this.STATE.FINAL);
    this.cleanupConnection();
  }

  /**
   * @private
   */
  async initialiseConnection() {
    const timeoutController = new AbortController();
    const connectTimer = setTimeout(() => {
      const hostPostfix = this.config.options.port ? `:${this.config.options.port}` : `\\${this.config.options.instanceName}`;
      // If we have routing data stored, this connection has been redirected
      const server = this.routingData ? this.routingData.server : this.config.server;
      const port = this.routingData ? `:${this.routingData.port}` : hostPostfix;
      // Grab the target host from the connection configuration, and from a redirect message
      // otherwise, leave the message empty.
      const routingMessage = this.routingData ? ` (redirected from ${this.config.server}${hostPostfix})` : '';
      const message = `Failed to connect to ${server}${port}${routingMessage} in ${this.config.options.connectTimeout}ms`;
      this.debug.log(message);
      timeoutController.abort(new _errors.ConnectionError(message, 'ETIMEOUT'));
    }, this.config.options.connectTimeout);
    try {
      let signal = timeoutController.signal;
      let port = this.config.options.port;
      if (!port) {
        try {
          port = await (0, _instanceLookup.instanceLookup)({
            server: this.config.server,
            instanceName: this.config.options.instanceName,
            timeout: this.config.options.connectTimeout,
            signal: signal
          });
        } catch (err) {
          signal.throwIfAborted();
          throw new _errors.ConnectionError(err.message, 'EINSTLOOKUP', {
            cause: err
          });
        }
      }
      let socket;
      try {
        socket = await this.connectOnPort(port, this.config.options.multiSubnetFailover, signal, this.config.options.connector);
      } catch (err) {
        signal.throwIfAborted();
        throw this.wrapSocketError(err);
      }
      try {
        const controller = new AbortController();
        const onError = err => {
          controller.abort(this.wrapSocketError(err));
        };
        const onClose = () => {
          this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
        };
        const onEnd = () => {
          this.debug.log('socket ended');
          const error = new Error('socket hang up');
          error.code = 'ECONNRESET';
          controller.abort(this.wrapSocketError(error));
        };
        socket.once('error', onError);
        socket.once('close', onClose);
        socket.once('end', onEnd);
        try {
          signal = AbortSignal.any([signal, controller.signal]);
          socket.setKeepAlive(true, KEEP_ALIVE_INITIAL_DELAY);
          this.messageIo = new _messageIo.default(socket, this.config.options.packetSize, this.debug);
          this.messageIo.on('secure', cleartext => {
            this.emit('secure', cleartext);
          });
          this.socket = socket;
          this.closed = false;
          this.debug.log('connected to ' + this.config.server + ':' + this.config.options.port);
          this.sendPreLogin();
          this.transitionTo(this.STATE.SENT_PRELOGIN);
          const preloginResponse = await this.readPreloginResponse(signal);
          await this.performTlsNegotiation(preloginResponse, signal);
          this.sendLogin7Packet();
          try {
            const {
              authentication
            } = this.config;
            switch (authentication.type) {
              case 'token-credential':
              case 'azure-active-directory-password':
              case 'azure-active-directory-msi-vm':
              case 'azure-active-directory-msi-app-service':
              case 'azure-active-directory-service-principal-secret':
              case 'azure-active-directory-default':
                this.transitionTo(this.STATE.SENT_LOGIN7_WITH_FEDAUTH);
                this.routingData = await this.performSentLogin7WithFedAuth(signal);
                break;
              case 'ntlm':
                this.transitionTo(this.STATE.SENT_LOGIN7_WITH_NTLM);
                this.routingData = await this.performSentLogin7WithNTLMLogin(signal);
                break;
              default:
                this.transitionTo(this.STATE.SENT_LOGIN7_WITH_STANDARD_LOGIN);
                this.routingData = await this.performSentLogin7WithStandardLogin(signal);
                break;
            }
          } catch (err) {
            if (isTransientError(err)) {
              this.debug.log('Initiating retry on transient error');
              this.transitionTo(this.STATE.TRANSIENT_FAILURE_RETRY);
              return await this.performTransientFailureRetry();
            }
            throw err;
          }

          // If routing data is present, we need to re-route the connection
          if (this.routingData) {
            this.transitionTo(this.STATE.REROUTING);
            return await this.performReRouting();
          }
          this.transitionTo(this.STATE.LOGGED_IN_SENDING_INITIAL_SQL);
          await this.performLoggedInSendingInitialSql(signal);
        } finally {
          socket.removeListener('error', onError);
          socket.removeListener('close', onClose);
          socket.removeListener('end', onEnd);
        }
      } catch (err) {
        socket.destroy();
        throw err;
      }
      socket.on('error', this._onSocketError);
      socket.on('close', this._onSocketClose);
      socket.on('end', this._onSocketEnd);
      this.transitionTo(this.STATE.LOGGED_IN);
    } finally {
      clearTimeout(connectTimer);
    }
  }

  /**
   * @private
   */
  cleanupConnection() {
    if (!this.closed) {
      this.clearRequestTimer();
      this.closeConnection();
      process.nextTick(() => {
        this.emit('end');
      });
      const request = this.request;
      if (request) {
        const err = new _errors.RequestError('Connection closed before request completed.', 'ECLOSE');
        request.callback(err);
        this.request = undefined;
      }
      this.closed = true;
    }
  }

  /**
   * @private
   */
  createDebug() {
    const debug = new _debug.default(this.config.options.debug);
    debug.on('debug', message => {
      this.emit('debug', message);
    });
    return debug;
  }

  /**
   * @private
   */
  createTokenStreamParser(message, handler) {
    return new _tokenStreamParser.Parser(message, this.debug, handler, this.config.options);
  }
  async wrapWithTls(socket, signal) {
    signal.throwIfAborted();
    const secureContext = tls.createSecureContext(this.secureContextOptions);
    // If connect to an ip address directly,
    // need to set the servername to an empty string
    // if the user has not given a servername explicitly
    const serverName = !net.isIP(this.config.server) ? this.config.server : '';
    const encryptOptions = {
      host: this.config.server,
      socket: socket,
      ALPNProtocols: ['tds/8.0'],
      secureContext: secureContext,
      servername: this.config.options.serverName ? this.config.options.serverName : serverName
    };
    const {
      promise,
      resolve,
      reject
    } = withResolvers();
    const encryptsocket = tls.connect(encryptOptions);
    try {
      const onAbort = () => {
        reject(signal.reason);
      };
      signal.addEventListener('abort', onAbort, {
        once: true
      });
      try {
        const onError = reject;
        const onConnect = () => {
          resolve(encryptsocket);
        };
        encryptsocket.once('error', onError);
        encryptsocket.once('secureConnect', onConnect);
        try {
          return await promise;
        } finally {
          encryptsocket.removeListener('error', onError);
          encryptsocket.removeListener('connect', onConnect);
        }
      } finally {
        signal.removeEventListener('abort', onAbort);
      }
    } catch (err) {
      encryptsocket.destroy();
      throw err;
    }
  }
  async connectOnPort(port, multiSubnetFailover, signal, customConnector) {
    const connectOpts = {
      host: this.routingData ? this.routingData.server : this.config.server,
      port: this.routingData ? this.routingData.port : port,
      localAddress: this.config.options.localAddress
    };
    const connect = customConnector || (multiSubnetFailover ? _connector.connectInParallel : _connector.connectInSequence);
    let socket = await connect(connectOpts, _dns.default.lookup, signal);
    if (this.config.options.encrypt === 'strict') {
      try {
        // Wrap the socket with TLS for TDS 8.0
        socket = await this.wrapWithTls(socket, signal);
      } catch (err) {
        socket.end();
        throw err;
      }
    }
    return socket;
  }

  /**
   * @private
   */
  closeConnection() {
    if (this.socket) {
      this.socket.destroy();
    }
  }

  /**
   * @private
   */
  createCancelTimer() {
    this.clearCancelTimer();
    const timeout = this.config.options.cancelTimeout;
    if (timeout > 0) {
      this.cancelTimer = setTimeout(() => {
        this.cancelTimeout();
      }, timeout);
    }
  }

  /**
   * @private
   */
  createRequestTimer() {
    this.clearRequestTimer(); // release old timer, just to be safe
    const request = this.request;
    const timeout = request.timeout !== undefined ? request.timeout : this.config.options.requestTimeout;
    if (timeout) {
      this.requestTimer = setTimeout(() => {
        this.requestTimeout();
      }, timeout);
    }
  }

  /**
   * @private
   */
  cancelTimeout() {
    const message = `Failed to cancel request in ${this.config.options.cancelTimeout}ms`;
    this.debug.log(message);
    this.dispatchEvent('socketError', new _errors.ConnectionError(message, 'ETIMEOUT'));
  }

  /**
   * @private
   */
  requestTimeout() {
    this.requestTimer = undefined;
    const request = this.request;
    request.cancel();
    const timeout = request.timeout !== undefined ? request.timeout : this.config.options.requestTimeout;
    const message = 'Timeout: Request failed to complete in ' + timeout + 'ms';
    request.error = new _errors.RequestError(message, 'ETIMEOUT');
  }

  /**
   * @private
   */
  clearCancelTimer() {
    if (this.cancelTimer) {
      clearTimeout(this.cancelTimer);
      this.cancelTimer = undefined;
    }
  }

  /**
   * @private
   */
  clearRequestTimer() {
    if (this.requestTimer) {
      clearTimeout(this.requestTimer);
      this.requestTimer = undefined;
    }
  }

  /**
   * @private
   */
  transitionTo(newState) {
    if (this.state === newState) {
      this.debug.log('State is already ' + newState.name);
      return;
    }
    if (this.state && this.state.exit) {
      this.state.exit.call(this, newState);
    }
    this.debug.log('State change: ' + (this.state ? this.state.name : 'undefined') + ' -> ' + newState.name);
    this.state = newState;
    if (this.state.enter) {
      this.state.enter.apply(this);
    }
  }

  /**
   * @private
   */
  getEventHandler(eventName) {
    const handler = this.state.events[eventName];
    if (!handler) {
      throw new Error(`No event '${eventName}' in state '${this.state.name}'`);
    }
    return handler;
  }

  /**
   * @private
   */
  dispatchEvent(eventName, ...args) {
    const handler = this.state.events[eventName];
    if (handler) {
      handler.apply(this, args);
    } else {
      this.emit('error', new Error(`No event '${eventName}' in state '${this.state.name}'`));
      this.close();
    }
  }

  /**
   * @private
   */
  wrapSocketError(error) {
    if (this.state === this.STATE.CONNECTING || this.state === this.STATE.SENT_TLSSSLNEGOTIATION) {
      const hostPostfix = this.config.options.port ? `:${this.config.options.port}` : `\\${this.config.options.instanceName}`;
      // If we have routing data stored, this connection has been redirected
      const server = this.routingData ? this.routingData.server : this.config.server;
      const port = this.routingData ? `:${this.routingData.port}` : hostPostfix;
      // Grab the target host from the connection configuration, and from a redirect message
      // otherwise, leave the message empty.
      const routingMessage = this.routingData ? ` (redirected from ${this.config.server}${hostPostfix})` : '';
      const message = `Failed to connect to ${server}${port}${routingMessage} - ${error.message}`;
      return new _errors.ConnectionError(message, 'ESOCKET', {
        cause: error
      });
    } else {
      const message = `Connection lost - ${error.message}`;
      return new _errors.ConnectionError(message, 'ESOCKET', {
        cause: error
      });
    }
  }

  /**
   * @private
   */
  socketEnd() {
    this.debug.log('socket ended');
    if (this.state !== this.STATE.FINAL) {
      const error = new Error('socket hang up');
      error.code = 'ECONNRESET';
      this.dispatchEvent('socketError', error);
      process.nextTick(() => {
        this.emit('error', this.wrapSocketError(error));
      });
    }
  }

  /**
   * @private
   */
  socketClose() {
    this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
    this.transitionTo(this.STATE.FINAL);
    this.cleanupConnection();
  }

  /**
   * @private
   */
  sendPreLogin() {
    const [, major, minor, build] = /^(\d+)\.(\d+)\.(\d+)/.exec(_package.version) ?? ['0.0.0', '0', '0', '0'];
    const payload = new _preloginPayload.default({
      // If encrypt setting is set to 'strict', then we should have already done the encryption before calling
      // this function. Therefore, the encrypt will be set to false here.
      // Otherwise, we will set encrypt here based on the encrypt Boolean value from the configuration.
      encrypt: typeof this.config.options.encrypt === 'boolean' && this.config.options.encrypt,
      version: {
        major: Number(major),
        minor: Number(minor),
        build: Number(build),
        subbuild: 0
      }
    });
    this.messageIo.sendMessage(_packet.TYPE.PRELOGIN, payload.data);
    this.debug.payload(function () {
      return payload.toString('  ');
    });
  }

  /**
   * @private
   */
  sendLogin7Packet() {
    const payload = new _login7Payload.default({
      tdsVersion: _tdsVersions.versions[this.config.options.tdsVersion],
      packetSize: this.config.options.packetSize,
      clientProgVer: 0,
      clientPid: process.pid,
      connectionId: 0,
      clientTimeZone: new Date().getTimezoneOffset(),
      clientLcid: 0x00000409
    });
    const {
      authentication
    } = this.config;
    switch (authentication.type) {
      case 'azure-active-directory-password':
        payload.fedAuth = {
          type: 'ADAL',
          echo: this.fedAuthRequired,
          workflow: 'default'
        };
        break;
      case 'azure-active-directory-access-token':
        payload.fedAuth = {
          type: 'SECURITYTOKEN',
          echo: this.fedAuthRequired,
          fedAuthToken: authentication.options.token
        };
        break;
      case 'token-credential':
      case 'azure-active-directory-msi-vm':
      case 'azure-active-directory-default':
      case 'azure-active-directory-msi-app-service':
      case 'azure-active-directory-service-principal-secret':
        payload.fedAuth = {
          type: 'ADAL',
          echo: this.fedAuthRequired,
          workflow: 'integrated'
        };
        break;
      case 'ntlm':
        payload.sspi = (0, _ntlm.createNTLMRequest)({
          domain: authentication.options.domain
        });
        break;
      default:
        payload.userName = authentication.options.userName;
        payload.password = authentication.options.password;
    }
    payload.hostname = this.config.options.workstationId || _os.default.hostname();
    payload.serverName = this.routingData ? this.routingData.login7server : this.config.server;
    payload.appName = this.config.options.appName || 'Tedious';
    payload.libraryName = _library.name;
    payload.language = this.config.options.language;
    payload.database = this.config.options.database;
    payload.clientId = Buffer.from([1, 2, 3, 4, 5, 6]);
    payload.readOnlyIntent = this.config.options.readOnlyIntent;
    payload.initDbFatal = !this.config.options.fallbackToDefaultDb;
    this.routingData = undefined;
    this.messageIo.sendMessage(_packet.TYPE.LOGIN7, payload.toBuffer());
    this.debug.payload(function () {
      return payload.toString('  ');
    });
  }

  /**
   * @private
   */
  sendFedAuthTokenMessage(token) {
    const accessTokenLen = Buffer.byteLength(token, 'ucs2');
    const data = Buffer.alloc(8 + accessTokenLen);
    let offset = 0;
    offset = data.writeUInt32LE(accessTokenLen + 4, offset);
    offset = data.writeUInt32LE(accessTokenLen, offset);
    data.write(token, offset, 'ucs2');
    this.messageIo.sendMessage(_packet.TYPE.FEDAUTH_TOKEN, data);
  }

  /**
   * @private
   */
  sendInitialSql() {
    const payload = new _sqlbatchPayload.default(this.getInitialSql(), this.currentTransactionDescriptor(), this.config.options);
    const message = new _message.default({
      type: _packet.TYPE.SQL_BATCH
    });
    this.messageIo.outgoingMessageStream.write(message);
    _stream.Readable.from(payload).pipe(message);
  }

  /**
   * @private
   */
  getInitialSql() {
    const options = [];
    if (this.config.options.enableAnsiNull === true) {
      options.push('set ansi_nulls on');
    } else if (this.config.options.enableAnsiNull === false) {
      options.push('set ansi_nulls off');
    }
    if (this.config.options.enableAnsiNullDefault === true) {
      options.push('set ansi_null_dflt_on on');
    } else if (this.config.options.enableAnsiNullDefault === false) {
      options.push('set ansi_null_dflt_on off');
    }
    if (this.config.options.enableAnsiPadding === true) {
      options.push('set ansi_padding on');
    } else if (this.config.options.enableAnsiPadding === false) {
      options.push('set ansi_padding off');
    }
    if (this.config.options.enableAnsiWarnings === true) {
      options.push('set ansi_warnings on');
    } else if (this.config.options.enableAnsiWarnings === false) {
      options.push('set ansi_warnings off');
    }
    if (this.config.options.enableArithAbort === true) {
      options.push('set arithabort on');
    } else if (this.config.options.enableArithAbort === false) {
      options.push('set arithabort off');
    }
    if (this.config.options.enableConcatNullYieldsNull === true) {
      options.push('set concat_null_yields_null on');
    } else if (this.config.options.enableConcatNullYieldsNull === false) {
      options.push('set concat_null_yields_null off');
    }
    if (this.config.options.enableCursorCloseOnCommit === true) {
      options.push('set cursor_close_on_commit on');
    } else if (this.config.options.enableCursorCloseOnCommit === false) {
      options.push('set cursor_close_on_commit off');
    }
    if (this.config.options.datefirst !== null) {
      options.push(`set datefirst ${this.config.options.datefirst}`);
    }
    if (this.config.options.dateFormat !== null) {
      options.push(`set dateformat ${this.config.options.dateFormat}`);
    }
    if (this.config.options.enableImplicitTransactions === true) {
      options.push('set implicit_transactions on');
    } else if (this.config.options.enableImplicitTransactions === false) {
      options.push('set implicit_transactions off');
    }
    if (this.config.options.language !== null) {
      options.push(`set language ${this.config.options.language}`);
    }
    if (this.config.options.enableNumericRoundabort === true) {
      options.push('set numeric_roundabort on');
    } else if (this.config.options.enableNumericRoundabort === false) {
      options.push('set numeric_roundabort off');
    }
    if (this.config.options.enableQuotedIdentifier === true) {
      options.push('set quoted_identifier on');
    } else if (this.config.options.enableQuotedIdentifier === false) {
      options.push('set quoted_identifier off');
    }
    if (this.config.options.textsize !== null) {
      options.push(`set textsize ${this.config.options.textsize}`);
    }
    if (this.config.options.connectionIsolationLevel !== null) {
      options.push(`set transaction isolation level ${this.getIsolationLevelText(this.config.options.connectionIsolationLevel)}`);
    }
    if (this.config.options.abortTransactionOnError === true) {
      options.push('set xact_abort on');
    } else if (this.config.options.abortTransactionOnError === false) {
      options.push('set xact_abort off');
    }
    return options.join('\n');
  }

  /**
   * Execute the SQL batch represented by [[Request]].
   * There is no param support, and unlike [[Request.execSql]],
   * it is not likely that SQL Server will reuse the execution plan it generates for the SQL.
   *
   * In almost all cases, [[Request.execSql]] will be a better choice.
   *
   * @param request A [[Request]] object representing the request.
   */
  execSqlBatch(request) {
    this.makeRequest(request, _packet.TYPE.SQL_BATCH, new _sqlbatchPayload.default(request.sqlTextOrProcedure, this.currentTransactionDescriptor(), this.config.options));
  }

  /**
   *  Execute the SQL represented by [[Request]].
   *
   * As `sp_executesql` is used to execute the SQL, if the same SQL is executed multiples times
   * using this function, the SQL Server query optimizer is likely to reuse the execution plan it generates
   * for the first execution. This may also result in SQL server treating the request like a stored procedure
   * which can result in the [[Event_doneInProc]] or [[Event_doneProc]] events being emitted instead of the
   * [[Event_done]] event you might expect. Using [[execSqlBatch]] will prevent this from occurring but may have a negative performance impact.
   *
   * Beware of the way that scoping rules apply, and how they may [affect local temp tables](http://weblogs.sqlteam.com/mladenp/archive/2006/11/03/17197.aspx)
   * If you're running in to scoping issues, then [[execSqlBatch]] may be a better choice.
   * See also [issue #24](https://github.com/pekim/tedious/issues/24)
   *
   * @param request A [[Request]] object representing the request.
   */
  execSql(request) {
    try {
      request.validateParameters(this.databaseCollation);
    } catch (error) {
      request.error = error;
      process.nextTick(() => {
        this.debug.log(error.message);
        request.callback(error);
      });
      return;
    }
    const parameters = [];
    parameters.push({
      type: _dataType.TYPES.NVarChar,
      name: 'statement',
      value: request.sqlTextOrProcedure,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    if (request.parameters.length) {
      parameters.push({
        type: _dataType.TYPES.NVarChar,
        name: 'params',
        value: request.makeParamsParameter(request.parameters),
        output: false,
        length: undefined,
        precision: undefined,
        scale: undefined
      });
      parameters.push(...request.parameters);
    }
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_ExecuteSql, parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Creates a new BulkLoad instance.
   *
   * @param table The name of the table to bulk-insert into.
   * @param options A set of bulk load options.
   */

  newBulkLoad(table, callbackOrOptions, callback) {
    let options;
    if (callback === undefined) {
      callback = callbackOrOptions;
      options = {};
    } else {
      options = callbackOrOptions;
    }
    if (typeof options !== 'object') {
      throw new TypeError('"options" argument must be an object');
    }
    return new _bulkLoad.default(table, this.databaseCollation, this.config.options, options, callback);
  }

  /**
   * Execute a [[BulkLoad]].
   *
   * ```js
   * // We want to perform a bulk load into a table with the following format:
   * // CREATE TABLE employees (first_name nvarchar(255), last_name nvarchar(255), day_of_birth date);
   *
   * const bulkLoad = connection.newBulkLoad('employees', (err, rowCount) => {
   *   // ...
   * });
   *
   * // First, we need to specify the columns that we want to write to,
   * // and their definitions. These definitions must match the actual table,
   * // otherwise the bulk load will fail.
   * bulkLoad.addColumn('first_name', TYPES.NVarchar, { nullable: false });
   * bulkLoad.addColumn('last_name', TYPES.NVarchar, { nullable: false });
   * bulkLoad.addColumn('date_of_birth', TYPES.Date, { nullable: false });
   *
   * // Execute a bulk load with a predefined list of rows.
   * //
   * // Note that these rows are held in memory until the
   * // bulk load was performed, so if you need to write a large
   * // number of rows (e.g. by reading from a CSV file),
   * // passing an `AsyncIterable` is advisable to keep memory usage low.
   * connection.execBulkLoad(bulkLoad, [
   *   { 'first_name': 'Steve', 'last_name': 'Jobs', 'day_of_birth': new Date('02-24-1955') },
   *   { 'first_name': 'Bill', 'last_name': 'Gates', 'day_of_birth': new Date('10-28-1955') }
   * ]);
   * ```
   *
   * @param bulkLoad A previously created [[BulkLoad]].
   * @param rows A [[Iterable]] or [[AsyncIterable]] that contains the rows that should be bulk loaded.
   */

  execBulkLoad(bulkLoad, rows) {
    bulkLoad.executionStarted = true;
    if (rows) {
      if (bulkLoad.streamingMode) {
        throw new Error("Connection.execBulkLoad can't be called with a BulkLoad that was put in streaming mode.");
      }
      if (bulkLoad.firstRowWritten) {
        throw new Error("Connection.execBulkLoad can't be called with a BulkLoad that already has rows written to it.");
      }
      const rowStream = _stream.Readable.from(rows);

      // Destroy the packet transform if an error happens in the row stream,
      // e.g. if an error is thrown from within a generator or stream.
      rowStream.on('error', err => {
        bulkLoad.rowToPacketTransform.destroy(err);
      });

      // Destroy the row stream if an error happens in the packet transform,
      // e.g. if the bulk load is cancelled.
      bulkLoad.rowToPacketTransform.on('error', err => {
        rowStream.destroy(err);
      });
      rowStream.pipe(bulkLoad.rowToPacketTransform);
    } else if (!bulkLoad.streamingMode) {
      // If the bulkload was not put into streaming mode by the user,
      // we end the rowToPacketTransform here for them.
      //
      // If it was put into streaming mode, it's the user's responsibility
      // to end the stream.
      bulkLoad.rowToPacketTransform.end();
    }
    const onCancel = () => {
      request.cancel();
    };
    const payload = new _bulkLoadPayload.BulkLoadPayload(bulkLoad);
    const request = new _request.default(bulkLoad.getBulkInsertSql(), error => {
      bulkLoad.removeListener('cancel', onCancel);
      if (error) {
        if (error.code === 'UNKNOWN') {
          error.message += ' This is likely because the schema of the BulkLoad does not match the schema of the table you are attempting to insert into.';
        }
        bulkLoad.error = error;
        bulkLoad.callback(error);
        return;
      }
      this.makeRequest(bulkLoad, _packet.TYPE.BULK_LOAD, payload);
    });
    bulkLoad.once('cancel', onCancel);
    this.execSqlBatch(request);
  }

  /**
   * Prepare the SQL represented by the request.
   *
   * The request can then be used in subsequent calls to
   * [[execute]] and [[unprepare]]
   *
   * @param request A [[Request]] object representing the request.
   *   Parameters only require a name and type. Parameter values are ignored.
   */
  prepare(request) {
    const parameters = [];
    parameters.push({
      type: _dataType.TYPES.Int,
      name: 'handle',
      value: undefined,
      output: true,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    parameters.push({
      type: _dataType.TYPES.NVarChar,
      name: 'params',
      value: request.parameters.length ? request.makeParamsParameter(request.parameters) : null,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    parameters.push({
      type: _dataType.TYPES.NVarChar,
      name: 'stmt',
      value: request.sqlTextOrProcedure,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    request.preparing = true;

    // TODO: We need to clean up this event handler, otherwise this leaks memory
    request.on('returnValue', (name, value) => {
      if (name === 'handle') {
        request.handle = value;
      } else {
        request.error = new _errors.RequestError(`Tedious > Unexpected output parameter ${name} from sp_prepare`);
      }
    });
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_Prepare, parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Release the SQL Server resources associated with a previously prepared request.
   *
   * @param request A [[Request]] object representing the request.
   *   Parameters only require a name and type.
   *   Parameter values are ignored.
   */
  unprepare(request) {
    const parameters = [];
    parameters.push({
      type: _dataType.TYPES.Int,
      name: 'handle',
      // TODO: Abort if `request.handle` is not set
      value: request.handle,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_Unprepare, parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Execute previously prepared SQL, using the supplied parameters.
   *
   * @param request A previously prepared [[Request]].
   * @param parameters  An object whose names correspond to the names of
   *   parameters that were added to the [[Request]] before it was prepared.
   *   The object's values are passed as the parameters' values when the
   *   request is executed.
   */
  execute(request, parameters) {
    const executeParameters = [];
    executeParameters.push({
      type: _dataType.TYPES.Int,
      name: '',
      // TODO: Abort if `request.handle` is not set
      value: request.handle,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    try {
      for (let i = 0, len = request.parameters.length; i < len; i++) {
        const parameter = request.parameters[i];
        executeParameters.push({
          ...parameter,
          value: parameter.type.validate(parameters ? parameters[parameter.name] : null, this.databaseCollation)
        });
      }
    } catch (error) {
      request.error = error;
      process.nextTick(() => {
        this.debug.log(error.message);
        request.callback(error);
      });
      return;
    }
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_Execute, executeParameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Call a stored procedure represented by [[Request]].
   *
   * @param request A [[Request]] object representing the request.
   */
  callProcedure(request) {
    try {
      request.validateParameters(this.databaseCollation);
    } catch (error) {
      request.error = error;
      process.nextTick(() => {
        this.debug.log(error.message);
        request.callback(error);
      });
      return;
    }
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(request.sqlTextOrProcedure, request.parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Start a transaction.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.
   *   Optional, and defaults to an empty string. Required when `isolationLevel`
   *   is present.
   * @param isolationLevel The isolation level that the transaction is to be run with.
   *
   *   The isolation levels are available from `require('tedious').ISOLATION_LEVEL`.
   *   * `READ_UNCOMMITTED`
   *   * `READ_COMMITTED`
   *   * `REPEATABLE_READ`
   *   * `SERIALIZABLE`
   *   * `SNAPSHOT`
   *
   *   Optional, and defaults to the Connection's isolation level.
   */
  beginTransaction(callback, name = '', isolationLevel = this.config.options.isolationLevel) {
    (0, _transaction.assertValidIsolationLevel)(isolationLevel, 'isolationLevel');
    const transaction = new _transaction.Transaction(name, isolationLevel);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('SET TRANSACTION ISOLATION LEVEL ' + transaction.isolationLevelToTSQL() + ';BEGIN TRAN ' + transaction.name, err => {
        this.transactionDepth++;
        if (this.transactionDepth === 1) {
          this.inTransaction = true;
        }
        callback(err);
      }));
    }
    const request = new _request.default(undefined, err => {
      return callback(err, this.currentTransactionDescriptor());
    });
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.beginPayload(this.currentTransactionDescriptor()));
  }

  /**
   * Commit a transaction.
   *
   * There should be an active transaction - that is, [[beginTransaction]]
   * should have been previously called.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.
   *   Optional, and defaults to an empty string. Required when `isolationLevel`is present.
   */
  commitTransaction(callback, name = '') {
    const transaction = new _transaction.Transaction(name);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('COMMIT TRAN ' + transaction.name, err => {
        this.transactionDepth--;
        if (this.transactionDepth === 0) {
          this.inTransaction = false;
        }
        callback(err);
      }));
    }
    const request = new _request.default(undefined, callback);
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.commitPayload(this.currentTransactionDescriptor()));
  }

  /**
   * Rollback a transaction.
   *
   * There should be an active transaction - that is, [[beginTransaction]]
   * should have been previously called.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.
   *   Optional, and defaults to an empty string.
   *   Required when `isolationLevel` is present.
   */
  rollbackTransaction(callback, name = '') {
    const transaction = new _transaction.Transaction(name);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('ROLLBACK TRAN ' + transaction.name, err => {
        this.transactionDepth--;
        if (this.transactionDepth === 0) {
          this.inTransaction = false;
        }
        callback(err);
      }));
    }
    const request = new _request.default(undefined, callback);
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.rollbackPayload(this.currentTransactionDescriptor()));
  }

  /**
   * Set a savepoint within a transaction.
   *
   * There should be an active transaction - that is, [[beginTransaction]]
   * should have been previously called.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.\
   *   Optional, and defaults to an empty string.
   *   Required when `isolationLevel` is present.
   */
  saveTransaction(callback, name) {
    const transaction = new _transaction.Transaction(name);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('SAVE TRAN ' + transaction.name, err => {
        this.transactionDepth++;
        callback(err);
      }));
    }
    const request = new _request.default(undefined, callback);
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.savePayload(this.currentTransactionDescriptor()));
  }

  /**
   * Run the given callback after starting a transaction, and commit or
   * rollback the transaction afterwards.
   *
   * This is a helper that employs [[beginTransaction]], [[commitTransaction]],
   * [[rollbackTransaction]], and [[saveTransaction]] to greatly simplify the
   * use of database transactions and automatically handle transaction nesting.
   *
   * @param cb
   * @param isolationLevel
   *   The isolation level that the transaction is to be run with.
   *
   *   The isolation levels are available from `require('tedious').ISOLATION_LEVEL`.
   *   * `READ_UNCOMMITTED`
   *   * `READ_COMMITTED`
   *   * `REPEATABLE_READ`
   *   * `SERIALIZABLE`
   *   * `SNAPSHOT`
   *
   *   Optional, and defaults to the Connection's isolation level.
   */
  transaction(cb, isolationLevel) {
    if (typeof cb !== 'function') {
      throw new TypeError('`cb` must be a function');
    }
    const useSavepoint = this.inTransaction;
    const name = '_tedious_' + _crypto.default.randomBytes(10).toString('hex');
    const txDone = (err, done, ...args) => {
      if (err) {
        if (this.inTransaction && this.state === this.STATE.LOGGED_IN) {
          this.rollbackTransaction(txErr => {
            done(txErr || err, ...args);
          }, name);
        } else {
          done(err, ...args);
        }
      } else if (useSavepoint) {
        if (this.config.options.tdsVersion < '7_2') {
          this.transactionDepth--;
        }
        done(null, ...args);
      } else {
        this.commitTransaction(txErr => {
          done(txErr, ...args);
        }, name);
      }
    };
    if (useSavepoint) {
      return this.saveTransaction(err => {
        if (err) {
          return cb(err);
        }
        if (isolationLevel) {
          return this.execSqlBatch(new _request.default('SET transaction isolation level ' + this.getIsolationLevelText(isolationLevel), err => {
            return cb(err, txDone);
          }));
        } else {
          return cb(null, txDone);
        }
      }, name);
    } else {
      return this.beginTransaction(err => {
        if (err) {
          return cb(err);
        }
        return cb(null, txDone);
      }, name, isolationLevel);
    }
  }

  /**
   * @private
   */
  makeRequest(request, packetType, payload) {
    if (this.state !== this.STATE.LOGGED_IN) {
      const message = 'Requests can only be made in the ' + this.STATE.LOGGED_IN.name + ' state, not the ' + this.state.name + ' state';
      this.debug.log(message);
      request.callback(new _errors.RequestError(message, 'EINVALIDSTATE'));
    } else if (request.canceled) {
      process.nextTick(() => {
        request.callback(new _errors.RequestError('Canceled.', 'ECANCEL'));
      });
    } else {
      if (packetType === _packet.TYPE.SQL_BATCH) {
        this.isSqlBatch = true;
      } else {
        this.isSqlBatch = false;
      }
      this.request = request;
      request.connection = this;
      request.rowCount = 0;
      request.rows = [];
      request.rst = [];
      const onCancel = () => {
        payloadStream.unpipe(message);
        payloadStream.destroy(new _errors.RequestError('Canceled.', 'ECANCEL'));

        // set the ignore bit and end the message.
        message.ignore = true;
        message.end();
        if (request instanceof _request.default && request.paused) {
          // resume the request if it was paused so we can read the remaining tokens
          request.resume();
        }
      };
      request.once('cancel', onCancel);
      this.createRequestTimer();
      const message = new _message.default({
        type: packetType,
        resetConnection: this.resetConnectionOnNextRequest
      });
      this.messageIo.outgoingMessageStream.write(message);
      this.transitionTo(this.STATE.SENT_CLIENT_REQUEST);
      message.once('finish', () => {
        request.removeListener('cancel', onCancel);
        request.once('cancel', this._cancelAfterRequestSent);
        this.resetConnectionOnNextRequest = false;
        this.debug.payload(function () {
          return payload.toString('  ');
        });
      });
      const payloadStream = _stream.Readable.from(payload);
      payloadStream.once('error', error => {
        payloadStream.unpipe(message);

        // Only set a request error if no error was set yet.
        request.error ??= error;
        message.ignore = true;
        message.end();
      });
      payloadStream.pipe(message);
    }
  }

  /**
   * Cancel currently executed request.
   */
  cancel() {
    if (!this.request) {
      return false;
    }
    if (this.request.canceled) {
      return false;
    }
    this.request.cancel();
    return true;
  }

  /**
   * Reset the connection to its initial state.
   * Can be useful for connection pool implementations.
   *
   * @param callback
   */
  reset(callback) {
    const request = new _request.default(this.getInitialSql(), err => {
      if (this.config.options.tdsVersion < '7_2') {
        this.inTransaction = false;
      }
      callback(err);
    });
    this.resetConnectionOnNextRequest = true;
    this.execSqlBatch(request);
  }

  /**
   * @private
   */
  currentTransactionDescriptor() {
    return this.transactionDescriptors[this.transactionDescriptors.length - 1];
  }

  /**
   * @private
   */
  getIsolationLevelText(isolationLevel) {
    switch (isolationLevel) {
      case _transaction.ISOLATION_LEVEL.READ_UNCOMMITTED:
        return 'read uncommitted';
      case _transaction.ISOLATION_LEVEL.REPEATABLE_READ:
        return 'repeatable read';
      case _transaction.ISOLATION_LEVEL.SERIALIZABLE:
        return 'serializable';
      case _transaction.ISOLATION_LEVEL.SNAPSHOT:
        return 'snapshot';
      default:
        return 'read committed';
    }
  }

  /**
   * @private
   */
  async performTlsNegotiation(preloginPayload, signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      if (preloginPayload.fedAuthRequired === 1) {
        this.fedAuthRequired = true;
      }
      if ('strict' !== this.config.options.encrypt && (preloginPayload.encryptionString === 'ON' || preloginPayload.encryptionString === 'REQ')) {
        if (!this.config.options.encrypt) {
          throw new _errors.ConnectionError("Server requires encryption, set 'encrypt' config option to true.", 'EENCRYPT');
        }
        this.transitionTo(this.STATE.SENT_TLSSSLNEGOTIATION);
        await Promise.race([this.messageIo.startTls(this.secureContextOptions, this.config.options.serverName ? this.config.options.serverName : this.routingData?.server ?? this.config.server, this.config.options.trustServerCertificate).catch(err => {
          throw this.wrapSocketError(err);
        }), signalAborted]);
      }
    } finally {
      signal.removeEventListener('abort', onAbort);
    }
  }
  async readPreloginResponse(signal) {
    signal.throwIfAborted();
    let messageBuffer = Buffer.alloc(0);
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const iterator = message[Symbol.asyncIterator]();
      try {
        while (true) {
          const {
            done,
            value
          } = await Promise.race([iterator.next(), signalAborted]);
          if (done) {
            break;
          }
          messageBuffer = Buffer.concat([messageBuffer, value]);
        }
      } finally {
        if (iterator.return) {
          await iterator.return();
        }
      }
    } finally {
      signal.removeEventListener('abort', onAbort);
    }
    const preloginPayload = new _preloginPayload.default(messageBuffer);
    this.debug.payload(function () {
      return preloginPayload.toString('  ');
    });
    return preloginPayload;
  }

  /**
   * @private
   */
  async performReRouting() {
    this.socket.removeListener('error', this._onSocketError);
    this.socket.removeListener('close', this._onSocketClose);
    this.socket.removeListener('end', this._onSocketEnd);
    this.socket.destroy();
    this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
    this.emit('rerouting');
    this.debug.log('Rerouting to ' + this.routingData.server + ':' + this.routingData.port);

    // Attempt connecting to the rerouting target
    this.transitionTo(this.STATE.CONNECTING);
    await this.initialiseConnection();
  }

  /**
   * @private
   */
  async performTransientFailureRetry() {
    this.curTransientRetryCount++;
    this.socket.removeListener('error', this._onSocketError);
    this.socket.removeListener('close', this._onSocketClose);
    this.socket.removeListener('end', this._onSocketEnd);
    this.socket.destroy();
    this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
    const server = this.routingData ? this.routingData.server : this.config.server;
    const port = this.routingData ? this.routingData.port : this.config.options.port;
    this.debug.log('Retry after transient failure connecting to ' + server + ':' + port);
    const {
      promise,
      resolve
    } = withResolvers();
    setTimeout(resolve, this.config.options.connectionRetryInterval);
    await promise;
    this.emit('retry');
    this.transitionTo(this.STATE.CONNECTING);
    await this.initialiseConnection();
  }

  /**
   * @private
   */
  async performSentLogin7WithStandardLogin(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const handler = new _handler.Login7TokenHandler(this);
      const tokenStreamParser = this.createTokenStreamParser(message, handler);
      await (0, _events.once)(tokenStreamParser, 'end');
      if (handler.loginAckReceived) {
        return handler.routingData;
      } else if (this.loginError) {
        throw this.loginError;
      } else {
        throw new _errors.ConnectionError('Login failed.', 'ELOGIN');
      }
    } finally {
      this.loginError = undefined;
      signal.removeEventListener('abort', onAbort);
    }
  }

  /**
   * @private
   */
  async performSentLogin7WithNTLMLogin(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      while (true) {
        const message = await Promise.race([this.messageIo.readMessage().catch(err => {
          throw this.wrapSocketError(err);
        }), signalAborted]);
        const handler = new _handler.Login7TokenHandler(this);
        const tokenStreamParser = this.createTokenStreamParser(message, handler);
        await Promise.race([(0, _events.once)(tokenStreamParser, 'end'), signalAborted]);
        if (handler.loginAckReceived) {
          return handler.routingData;
        } else if (this.ntlmpacket) {
          const authentication = this.config.authentication;
          const payload = new _ntlmPayload.default({
            domain: authentication.options.domain,
            userName: authentication.options.userName,
            password: authentication.options.password,
            ntlmpacket: this.ntlmpacket
          });
          this.messageIo.sendMessage(_packet.TYPE.NTLMAUTH_PKT, payload.data);
          this.debug.payload(function () {
            return payload.toString('  ');
          });
          this.ntlmpacket = undefined;
        } else if (this.loginError) {
          throw this.loginError;
        } else {
          throw new _errors.ConnectionError('Login failed.', 'ELOGIN');
        }
      }
    } finally {
      this.loginError = undefined;
      signal.removeEventListener('abort', onAbort);
    }
  }

  /**
   * @private
   */
  async performSentLogin7WithFedAuth(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const handler = new _handler.Login7TokenHandler(this);
      const tokenStreamParser = this.createTokenStreamParser(message, handler);
      await Promise.race([(0, _events.once)(tokenStreamParser, 'end'), signalAborted]);
      if (handler.loginAckReceived) {
        return handler.routingData;
      }
      const fedAuthInfoToken = handler.fedAuthInfoToken;
      if (fedAuthInfoToken && fedAuthInfoToken.stsurl && fedAuthInfoToken.spn) {
        /** Federated authentication configation. */
        const authentication = this.config.authentication;
        /** Permission scope to pass to Entra ID when requesting an authentication token. */
        const tokenScope = new _url.URL('/.default', fedAuthInfoToken.spn).toString();

        /** Instance of the token credential to use to authenticate to the resource. */
        let credentials;
        switch (authentication.type) {
          case 'token-credential':
            credentials = authentication.options.credential;
            break;
          case 'azure-active-directory-password':
            credentials = new _identity.UsernamePasswordCredential(authentication.options.tenantId ?? 'common', authentication.options.clientId, authentication.options.userName, authentication.options.password);
            break;
          case 'azure-active-directory-msi-vm':
          case 'azure-active-directory-msi-app-service':
            const msiArgs = authentication.options.clientId ? [authentication.options.clientId, {}] : [{}];
            credentials = new _identity.ManagedIdentityCredential(...msiArgs);
            break;
          case 'azure-active-directory-default':
            const args = authentication.options.clientId ? {
              managedIdentityClientId: authentication.options.clientId
            } : {};
            credentials = new _identity.DefaultAzureCredential(args);
            break;
          case 'azure-active-directory-service-principal-secret':
            credentials = new _identity.ClientSecretCredential(authentication.options.tenantId, authentication.options.clientId, authentication.options.clientSecret);
            break;
        }

        /** Access token retrieved from Entra ID for the configured permission scope(s). */
        let tokenResponse;
        try {
          tokenResponse = await Promise.race([credentials.getToken(tokenScope), signalAborted]);
        } catch (err) {
          signal.throwIfAborted();
          throw new AggregateError([new _errors.ConnectionError('Security token could not be authenticated or authorized.', 'EFEDAUTH'), err]);
        }

        // Type guard the token value so that it is never null.
        if (tokenResponse === null) {
          throw new AggregateError([new _errors.ConnectionError('Security token could not be authenticated or authorized.', 'EFEDAUTH')]);
        }
        this.sendFedAuthTokenMessage(tokenResponse.token);
        // sent the fedAuth token message, the rest is similar to standard login 7
        this.transitionTo(this.STATE.SENT_LOGIN7_WITH_STANDARD_LOGIN);
        return await this.performSentLogin7WithStandardLogin(signal);
      } else if (this.loginError) {
        throw this.loginError;
      } else {
        throw new _errors.ConnectionError('Login failed.', 'ELOGIN');
      }
    } finally {
      this.loginError = undefined;
      signal.removeEventListener('abort', onAbort);
    }
  }

  /**
   * @private
   */
  async performLoggedInSendingInitialSql(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      this.sendInitialSql();
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const tokenStreamParser = this.createTokenStreamParser(message, new _handler.InitialSqlTokenHandler(this));
      await Promise.race([(0, _events.once)(tokenStreamParser, 'end'), signalAborted]);
    } finally {
      signal.removeEventListener('abort', onAbort);
    }
  }
}
function isTransientError(error) {
  if (error instanceof AggregateError) {
    error = error.errors[0];
  }
  return error instanceof _errors.ConnectionError && !!error.isTransient;
}
var _default = exports.default = Connection;
module.exports = Connection;
Connection.prototype.STATE = {
  INITIALIZED: {
    name: 'Initialized',
    events: {}
  },
  CONNECTING: {
    name: 'Connecting',
    events: {}
  },
  SENT_PRELOGIN: {
    name: 'SentPrelogin',
    events: {}
  },
  REROUTING: {
    name: 'ReRouting',
    events: {}
  },
  TRANSIENT_FAILURE_RETRY: {
    name: 'TRANSIENT_FAILURE_RETRY',
    events: {}
  },
  SENT_TLSSSLNEGOTIATION: {
    name: 'SentTLSSSLNegotiation',
    events: {}
  },
  SENT_LOGIN7_WITH_STANDARD_LOGIN: {
    name: 'SentLogin7WithStandardLogin',
    events: {}
  },
  SENT_LOGIN7_WITH_NTLM: {
    name: 'SentLogin7WithNTLMLogin',
    events: {}
  },
  SENT_LOGIN7_WITH_FEDAUTH: {
    name: 'SentLogin7WithFedauth',
    events: {}
  },
  LOGGED_IN_SENDING_INITIAL_SQL: {
    name: 'LoggedInSendingInitialSql',
    events: {}
  },
  LOGGED_IN: {
    name: 'LoggedIn',
    events: {
      socketError: function () {
        this.transitionTo(this.STATE.FINAL);
        this.cleanupConnection();
      }
    }
  },
  SENT_CLIENT_REQUEST: {
    name: 'SentClientRequest',
    enter: function () {
      (async () => {
        let message;
        try {
          message = await this.messageIo.readMessage();
        } catch (err) {
          this.dispatchEvent('socketError', err);
          process.nextTick(() => {
            this.emit('error', this.wrapSocketError(err));
          });
          return;
        }
        // request timer is stopped on first data package
        this.clearRequestTimer();
        const tokenStreamParser = this.createTokenStreamParser(message, new _handler.RequestTokenHandler(this, this.request));

        // If the request was canceled and we have a `cancelTimer`
        // defined, we send a attention message after the
        // request message was fully sent off.
        //
        // We already started consuming the current message
        // (but all the token handlers should be no-ops), and
        // need to ensure the next message is handled by the
        // `SENT_ATTENTION` state.
        if (this.request?.canceled && this.cancelTimer) {
          return this.transitionTo(this.STATE.SENT_ATTENTION);
        }
        const onResume = () => {
          tokenStreamParser.resume();
        };
        const onPause = () => {
          tokenStreamParser.pause();
          this.request?.once('resume', onResume);
        };
        this.request?.on('pause', onPause);
        if (this.request instanceof _request.default && this.request.paused) {
          onPause();
        }
        const onCancel = () => {
          tokenStreamParser.removeListener('end', onEndOfMessage);
          if (this.request instanceof _request.default && this.request.paused) {
            // resume the request if it was paused so we can read the remaining tokens
            this.request.resume();
          }
          this.request?.removeListener('pause', onPause);
          this.request?.removeListener('resume', onResume);

          // The `_cancelAfterRequestSent` callback will have sent a
          // attention message, so now we need to also switch to
          // the `SENT_ATTENTION` state to make sure the attention ack
          // message is processed correctly.
          this.transitionTo(this.STATE.SENT_ATTENTION);
        };
        const onEndOfMessage = () => {
          this.request?.removeListener('cancel', this._cancelAfterRequestSent);
          this.request?.removeListener('cancel', onCancel);
          this.request?.removeListener('pause', onPause);
          this.request?.removeListener('resume', onResume);
          this.transitionTo(this.STATE.LOGGED_IN);
          const sqlRequest = this.request;
          this.request = undefined;
          if (this.config.options.tdsVersion < '7_2' && sqlRequest.error && this.isSqlBatch) {
            this.inTransaction = false;
          }
          sqlRequest.callback(sqlRequest.error, sqlRequest.rowCount, sqlRequest.rows);
        };
        tokenStreamParser.once('end', onEndOfMessage);
        this.request?.once('cancel', onCancel);
      })();
    },
    exit: function (nextState) {
      this.clearRequestTimer();
    },
    events: {
      socketError: function (err) {
        const sqlRequest = this.request;
        this.request = undefined;
        this.transitionTo(this.STATE.FINAL);
        this.cleanupConnection();
        sqlRequest.callback(err);
      }
    }
  },
  SENT_ATTENTION: {
    name: 'SentAttention',
    enter: function () {
      (async () => {
        let message;
        try {
          message = await this.messageIo.readMessage();
        } catch (err) {
          this.dispatchEvent('socketError', err);
          process.nextTick(() => {
            this.emit('error', this.wrapSocketError(err));
          });
          return;
        }
        const handler = new _handler.AttentionTokenHandler(this, this.request);
        const tokenStreamParser = this.createTokenStreamParser(message, handler);
        await (0, _events.once)(tokenStreamParser, 'end');
        // 3.2.5.7 Sent Attention State
        // Discard any data contained in the response, until we receive the attention response
        if (handler.attentionReceived) {
          this.clearCancelTimer();
          const sqlRequest = this.request;
          this.request = undefined;
          this.transitionTo(this.STATE.LOGGED_IN);
          if (sqlRequest.error && sqlRequest.error instanceof _errors.RequestError && sqlRequest.error.code === 'ETIMEOUT') {
            sqlRequest.callback(sqlRequest.error);
          } else {
            sqlRequest.callback(new _errors.RequestError('Canceled.', 'ECANCEL'));
          }
        }
      })().catch(err => {
        process.nextTick(() => {
          throw err;
        });
      });
    },
    events: {
      socketError: function (err) {
        const sqlRequest = this.request;
        this.request = undefined;
        this.transitionTo(this.STATE.FINAL);
        this.cleanupConnection();
        sqlRequest.callback(err);
      }
    }
  },
  FINAL: {
    name: 'Final',
    events: {}
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY3J5cHRvIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfb3MiLCJ0bHMiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIm5ldCIsIl9kbnMiLCJfY29uc3RhbnRzIiwiX3N0cmVhbSIsIl9pZGVudGl0eSIsIl9jb3JlQXV0aCIsIl9idWxrTG9hZCIsIl9kZWJ1ZyIsIl9ldmVudHMiLCJfaW5zdGFuY2VMb29rdXAiLCJfdHJhbnNpZW50RXJyb3JMb29rdXAiLCJfcGFja2V0IiwiX3ByZWxvZ2luUGF5bG9hZCIsIl9sb2dpbjdQYXlsb2FkIiwiX250bG1QYXlsb2FkIiwiX3JlcXVlc3QiLCJfcnBjcmVxdWVzdFBheWxvYWQiLCJfc3FsYmF0Y2hQYXlsb2FkIiwiX21lc3NhZ2VJbyIsIl90b2tlblN0cmVhbVBhcnNlciIsIl90cmFuc2FjdGlvbiIsIl9lcnJvcnMiLCJfY29ubmVjdG9yIiwiX2xpYnJhcnkiLCJfdGRzVmVyc2lvbnMiLCJfbWVzc2FnZSIsIl9udGxtIiwiX2RhdGFUeXBlIiwiX2J1bGtMb2FkUGF5bG9hZCIsIl9zcGVjaWFsU3RvcmVkUHJvY2VkdXJlIiwiX3BhY2thZ2UiLCJfdXJsIiwiX2hhbmRsZXIiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJuIiwiX19wcm90b19fIiwiYSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImkiLCJzZXQiLCJLRUVQX0FMSVZFX0lOSVRJQUxfREVMQVkiLCJERUZBVUxUX0NPTk5FQ1RfVElNRU9VVCIsIkRFRkFVTFRfQ0xJRU5UX1JFUVVFU1RfVElNRU9VVCIsIkRFRkFVTFRfQ0FOQ0VMX1RJTUVPVVQiLCJERUZBVUxUX0NPTk5FQ1RfUkVUUllfSU5URVJWQUwiLCJERUZBVUxUX1BBQ0tFVF9TSVpFIiwiREVGQVVMVF9URVhUU0laRSIsIkRFRkFVTFRfREFURUZJUlNUIiwiREVGQVVMVF9QT1JUIiwiREVGQVVMVF9URFNfVkVSU0lPTiIsIkRFRkFVTFRfTEFOR1VBR0UiLCJERUZBVUxUX0RBVEVGT1JNQVQiLCJ3aXRoUmVzb2x2ZXJzIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2UiLCJQcm9taXNlIiwicmVzIiwicmVqIiwiQ29ubmVjdGlvbiIsIkV2ZW50RW1pdHRlciIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwiVHlwZUVycm9yIiwic2VydmVyIiwiZmVkQXV0aFJlcXVpcmVkIiwiYXV0aGVudGljYXRpb24iLCJ1bmRlZmluZWQiLCJ0eXBlIiwib3B0aW9ucyIsImRvbWFpbiIsInVzZXJOYW1lIiwicGFzc3dvcmQiLCJ0b1VwcGVyQ2FzZSIsImlzVG9rZW5DcmVkZW50aWFsIiwiY3JlZGVudGlhbCIsImNsaWVudElkIiwidGVuYW50SWQiLCJ0b2tlbiIsImNsaWVudFNlY3JldCIsImFib3J0VHJhbnNhY3Rpb25PbkVycm9yIiwiYXBwTmFtZSIsImNhbWVsQ2FzZUNvbHVtbnMiLCJjYW5jZWxUaW1lb3V0IiwiY29sdW1uRW5jcnlwdGlvbktleUNhY2hlVFRMIiwiY29sdW1uRW5jcnlwdGlvblNldHRpbmciLCJjb2x1bW5OYW1lUmVwbGFjZXIiLCJjb25uZWN0aW9uUmV0cnlJbnRlcnZhbCIsImNvbm5lY3RUaW1lb3V0IiwiY29ubmVjdG9yIiwiY29ubmVjdGlvbklzb2xhdGlvbkxldmVsIiwiSVNPTEFUSU9OX0xFVkVMIiwiUkVBRF9DT01NSVRURUQiLCJjcnlwdG9DcmVkZW50aWFsc0RldGFpbHMiLCJkYXRhYmFzZSIsImRhdGVmaXJzdCIsImRhdGVGb3JtYXQiLCJkZWJ1ZyIsImRhdGEiLCJwYWNrZXQiLCJwYXlsb2FkIiwiZW5hYmxlQW5zaU51bGwiLCJlbmFibGVBbnNpTnVsbERlZmF1bHQiLCJlbmFibGVBbnNpUGFkZGluZyIsImVuYWJsZUFuc2lXYXJuaW5ncyIsImVuYWJsZUFyaXRoQWJvcnQiLCJlbmFibGVDb25jYXROdWxsWWllbGRzTnVsbCIsImVuYWJsZUN1cnNvckNsb3NlT25Db21taXQiLCJlbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucyIsImVuYWJsZU51bWVyaWNSb3VuZGFib3J0IiwiZW5hYmxlUXVvdGVkSWRlbnRpZmllciIsImVuY3J5cHQiLCJmYWxsYmFja1RvRGVmYXVsdERiIiwiZW5jcnlwdGlvbktleVN0b3JlUHJvdmlkZXJzIiwiaW5zdGFuY2VOYW1lIiwiaXNvbGF0aW9uTGV2ZWwiLCJsYW5ndWFnZSIsImxvY2FsQWRkcmVzcyIsIm1heFJldHJpZXNPblRyYW5zaWVudEVycm9ycyIsIm11bHRpU3VibmV0RmFpbG92ZXIiLCJwYWNrZXRTaXplIiwicG9ydCIsInJlYWRPbmx5SW50ZW50IiwicmVxdWVzdFRpbWVvdXQiLCJyb3dDb2xsZWN0aW9uT25Eb25lIiwicm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb24iLCJzZXJ2ZXJOYW1lIiwic2VydmVyU3VwcG9ydHNDb2x1bW5FbmNyeXB0aW9uIiwidGRzVmVyc2lvbiIsInRleHRzaXplIiwidHJ1c3RlZFNlcnZlck5hbWVBRSIsInRydXN0U2VydmVyQ2VydGlmaWNhdGUiLCJ1c2VDb2x1bW5OYW1lcyIsInVzZVVUQyIsIndvcmtzdGF0aW9uSWQiLCJsb3dlckNhc2VHdWlkcyIsIkVycm9yIiwiYXNzZXJ0VmFsaWRJc29sYXRpb25MZXZlbCIsIlJhbmdlRXJyb3IiLCJzZWN1cmVDb250ZXh0T3B0aW9ucyIsInNlY3VyZU9wdGlvbnMiLCJjcmVhdGUiLCJ2YWx1ZSIsImNvbnN0YW50cyIsIlNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFMiLCJjcmVhdGVEZWJ1ZyIsImluVHJhbnNhY3Rpb24iLCJ0cmFuc2FjdGlvbkRlc2NyaXB0b3JzIiwiQnVmZmVyIiwiZnJvbSIsInRyYW5zYWN0aW9uRGVwdGgiLCJpc1NxbEJhdGNoIiwiY2xvc2VkIiwibWVzc2FnZUJ1ZmZlciIsImFsbG9jIiwiY3VyVHJhbnNpZW50UmV0cnlDb3VudCIsInRyYW5zaWVudEVycm9yTG9va3VwIiwiVHJhbnNpZW50RXJyb3JMb29rdXAiLCJzdGF0ZSIsIlNUQVRFIiwiSU5JVElBTElaRUQiLCJfY2FuY2VsQWZ0ZXJSZXF1ZXN0U2VudCIsIm1lc3NhZ2VJbyIsInNlbmRNZXNzYWdlIiwiVFlQRSIsIkFUVEVOVElPTiIsImNyZWF0ZUNhbmNlbFRpbWVyIiwiX29uU29ja2V0Q2xvc2UiLCJzb2NrZXRDbG9zZSIsIl9vblNvY2tldEVuZCIsInNvY2tldEVuZCIsIl9vblNvY2tldEVycm9yIiwiZXJyb3IiLCJkaXNwYXRjaEV2ZW50IiwicHJvY2VzcyIsIm5leHRUaWNrIiwiZW1pdCIsIndyYXBTb2NrZXRFcnJvciIsImNvbm5lY3QiLCJjb25uZWN0TGlzdGVuZXIiLCJDb25uZWN0aW9uRXJyb3IiLCJuYW1lIiwib25Db25uZWN0IiwiZXJyIiwicmVtb3ZlTGlzdGVuZXIiLCJvbkVycm9yIiwib25jZSIsInRyYW5zaXRpb25UbyIsIkNPTk5FQ1RJTkciLCJpbml0aWFsaXNlQ29ubmVjdGlvbiIsInRoZW4iLCJGSU5BTCIsIm9uIiwiZXZlbnQiLCJsaXN0ZW5lciIsImFyZ3MiLCJjbG9zZSIsImNsZWFudXBDb25uZWN0aW9uIiwidGltZW91dENvbnRyb2xsZXIiLCJBYm9ydENvbnRyb2xsZXIiLCJjb25uZWN0VGltZXIiLCJzZXRUaW1lb3V0IiwiaG9zdFBvc3RmaXgiLCJyb3V0aW5nRGF0YSIsInJvdXRpbmdNZXNzYWdlIiwibWVzc2FnZSIsImxvZyIsImFib3J0Iiwic2lnbmFsIiwiaW5zdGFuY2VMb29rdXAiLCJ0aW1lb3V0IiwidGhyb3dJZkFib3J0ZWQiLCJjYXVzZSIsInNvY2tldCIsImNvbm5lY3RPblBvcnQiLCJjb250cm9sbGVyIiwib25DbG9zZSIsIm9uRW5kIiwiY29kZSIsIkFib3J0U2lnbmFsIiwiYW55Iiwic2V0S2VlcEFsaXZlIiwiTWVzc2FnZUlPIiwiY2xlYXJ0ZXh0Iiwic2VuZFByZUxvZ2luIiwiU0VOVF9QUkVMT0dJTiIsInByZWxvZ2luUmVzcG9uc2UiLCJyZWFkUHJlbG9naW5SZXNwb25zZSIsInBlcmZvcm1UbHNOZWdvdGlhdGlvbiIsInNlbmRMb2dpbjdQYWNrZXQiLCJTRU5UX0xPR0lON19XSVRIX0ZFREFVVEgiLCJwZXJmb3JtU2VudExvZ2luN1dpdGhGZWRBdXRoIiwiU0VOVF9MT0dJTjdfV0lUSF9OVExNIiwicGVyZm9ybVNlbnRMb2dpbjdXaXRoTlRMTUxvZ2luIiwiU0VOVF9MT0dJTjdfV0lUSF9TVEFOREFSRF9MT0dJTiIsInBlcmZvcm1TZW50TG9naW43V2l0aFN0YW5kYXJkTG9naW4iLCJpc1RyYW5zaWVudEVycm9yIiwiVFJBTlNJRU5UX0ZBSUxVUkVfUkVUUlkiLCJwZXJmb3JtVHJhbnNpZW50RmFpbHVyZVJldHJ5IiwiUkVST1VUSU5HIiwicGVyZm9ybVJlUm91dGluZyIsIkxPR0dFRF9JTl9TRU5ESU5HX0lOSVRJQUxfU1FMIiwicGVyZm9ybUxvZ2dlZEluU2VuZGluZ0luaXRpYWxTcWwiLCJkZXN0cm95IiwiTE9HR0VEX0lOIiwiY2xlYXJUaW1lb3V0IiwiY2xlYXJSZXF1ZXN0VGltZXIiLCJjbG9zZUNvbm5lY3Rpb24iLCJyZXF1ZXN0IiwiUmVxdWVzdEVycm9yIiwiY2FsbGJhY2siLCJEZWJ1ZyIsImNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyIiwiaGFuZGxlciIsIlRva2VuU3RyZWFtUGFyc2VyIiwid3JhcFdpdGhUbHMiLCJzZWN1cmVDb250ZXh0IiwiY3JlYXRlU2VjdXJlQ29udGV4dCIsImlzSVAiLCJlbmNyeXB0T3B0aW9ucyIsImhvc3QiLCJBTFBOUHJvdG9jb2xzIiwic2VydmVybmFtZSIsImVuY3J5cHRzb2NrZXQiLCJvbkFib3J0IiwicmVhc29uIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjdXN0b21Db25uZWN0b3IiLCJjb25uZWN0T3B0cyIsImNvbm5lY3RJblBhcmFsbGVsIiwiY29ubmVjdEluU2VxdWVuY2UiLCJkbnMiLCJsb29rdXAiLCJlbmQiLCJjbGVhckNhbmNlbFRpbWVyIiwiY2FuY2VsVGltZXIiLCJjcmVhdGVSZXF1ZXN0VGltZXIiLCJyZXF1ZXN0VGltZXIiLCJjYW5jZWwiLCJuZXdTdGF0ZSIsImV4aXQiLCJlbnRlciIsImFwcGx5IiwiZ2V0RXZlbnRIYW5kbGVyIiwiZXZlbnROYW1lIiwiZXZlbnRzIiwiU0VOVF9UTFNTU0xORUdPVElBVElPTiIsIm1ham9yIiwibWlub3IiLCJidWlsZCIsImV4ZWMiLCJ2ZXJzaW9uIiwiUHJlbG9naW5QYXlsb2FkIiwiTnVtYmVyIiwic3ViYnVpbGQiLCJQUkVMT0dJTiIsInRvU3RyaW5nIiwiTG9naW43UGF5bG9hZCIsInZlcnNpb25zIiwiY2xpZW50UHJvZ1ZlciIsImNsaWVudFBpZCIsInBpZCIsImNvbm5lY3Rpb25JZCIsImNsaWVudFRpbWVab25lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwiY2xpZW50TGNpZCIsImZlZEF1dGgiLCJlY2hvIiwid29ya2Zsb3ciLCJmZWRBdXRoVG9rZW4iLCJzc3BpIiwiY3JlYXRlTlRMTVJlcXVlc3QiLCJob3N0bmFtZSIsIm9zIiwibG9naW43c2VydmVyIiwibGlicmFyeU5hbWUiLCJpbml0RGJGYXRhbCIsIkxPR0lONyIsInRvQnVmZmVyIiwic2VuZEZlZEF1dGhUb2tlbk1lc3NhZ2UiLCJhY2Nlc3NUb2tlbkxlbiIsImJ5dGVMZW5ndGgiLCJvZmZzZXQiLCJ3cml0ZVVJbnQzMkxFIiwid3JpdGUiLCJGRURBVVRIX1RPS0VOIiwic2VuZEluaXRpYWxTcWwiLCJTcWxCYXRjaFBheWxvYWQiLCJnZXRJbml0aWFsU3FsIiwiY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvciIsIk1lc3NhZ2UiLCJTUUxfQkFUQ0giLCJvdXRnb2luZ01lc3NhZ2VTdHJlYW0iLCJSZWFkYWJsZSIsInBpcGUiLCJwdXNoIiwiZ2V0SXNvbGF0aW9uTGV2ZWxUZXh0Iiwiam9pbiIsImV4ZWNTcWxCYXRjaCIsIm1ha2VSZXF1ZXN0Iiwic3FsVGV4dE9yUHJvY2VkdXJlIiwiZXhlY1NxbCIsInZhbGlkYXRlUGFyYW1ldGVycyIsImRhdGFiYXNlQ29sbGF0aW9uIiwicGFyYW1ldGVycyIsIlRZUEVTIiwiTlZhckNoYXIiLCJvdXRwdXQiLCJsZW5ndGgiLCJwcmVjaXNpb24iLCJzY2FsZSIsIm1ha2VQYXJhbXNQYXJhbWV0ZXIiLCJSUENfUkVRVUVTVCIsIlJwY1JlcXVlc3RQYXlsb2FkIiwiUHJvY2VkdXJlcyIsIlNwX0V4ZWN1dGVTcWwiLCJuZXdCdWxrTG9hZCIsInRhYmxlIiwiY2FsbGJhY2tPck9wdGlvbnMiLCJCdWxrTG9hZCIsImV4ZWNCdWxrTG9hZCIsImJ1bGtMb2FkIiwicm93cyIsImV4ZWN1dGlvblN0YXJ0ZWQiLCJzdHJlYW1pbmdNb2RlIiwiZmlyc3RSb3dXcml0dGVuIiwicm93U3RyZWFtIiwicm93VG9QYWNrZXRUcmFuc2Zvcm0iLCJvbkNhbmNlbCIsIkJ1bGtMb2FkUGF5bG9hZCIsIlJlcXVlc3QiLCJnZXRCdWxrSW5zZXJ0U3FsIiwiQlVMS19MT0FEIiwicHJlcGFyZSIsIkludCIsInByZXBhcmluZyIsImhhbmRsZSIsIlNwX1ByZXBhcmUiLCJ1bnByZXBhcmUiLCJTcF9VbnByZXBhcmUiLCJleGVjdXRlIiwiZXhlY3V0ZVBhcmFtZXRlcnMiLCJsZW4iLCJwYXJhbWV0ZXIiLCJ2YWxpZGF0ZSIsIlNwX0V4ZWN1dGUiLCJjYWxsUHJvY2VkdXJlIiwiYmVnaW5UcmFuc2FjdGlvbiIsInRyYW5zYWN0aW9uIiwiVHJhbnNhY3Rpb24iLCJpc29sYXRpb25MZXZlbFRvVFNRTCIsIlRSQU5TQUNUSU9OX01BTkFHRVIiLCJiZWdpblBheWxvYWQiLCJjb21taXRUcmFuc2FjdGlvbiIsImNvbW1pdFBheWxvYWQiLCJyb2xsYmFja1RyYW5zYWN0aW9uIiwicm9sbGJhY2tQYXlsb2FkIiwic2F2ZVRyYW5zYWN0aW9uIiwic2F2ZVBheWxvYWQiLCJjYiIsInVzZVNhdmVwb2ludCIsImNyeXB0byIsInJhbmRvbUJ5dGVzIiwidHhEb25lIiwiZG9uZSIsInR4RXJyIiwicGFja2V0VHlwZSIsImNhbmNlbGVkIiwiY29ubmVjdGlvbiIsInJvd0NvdW50IiwicnN0IiwicGF5bG9hZFN0cmVhbSIsInVucGlwZSIsImlnbm9yZSIsInBhdXNlZCIsInJlc3VtZSIsInJlc2V0Q29ubmVjdGlvbiIsInJlc2V0Q29ubmVjdGlvbk9uTmV4dFJlcXVlc3QiLCJTRU5UX0NMSUVOVF9SRVFVRVNUIiwicmVzZXQiLCJSRUFEX1VOQ09NTUlUVEVEIiwiUkVQRUFUQUJMRV9SRUFEIiwiU0VSSUFMSVpBQkxFIiwiU05BUFNIT1QiLCJwcmVsb2dpblBheWxvYWQiLCJzaWduYWxBYm9ydGVkIiwiZW5jcnlwdGlvblN0cmluZyIsInJhY2UiLCJzdGFydFRscyIsImNhdGNoIiwicmVhZE1lc3NhZ2UiLCJpdGVyYXRvciIsIlN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJuZXh0IiwiY29uY2F0IiwicmV0dXJuIiwiTG9naW43VG9rZW5IYW5kbGVyIiwidG9rZW5TdHJlYW1QYXJzZXIiLCJsb2dpbkFja1JlY2VpdmVkIiwibG9naW5FcnJvciIsIm50bG1wYWNrZXQiLCJOVExNUmVzcG9uc2VQYXlsb2FkIiwiTlRMTUFVVEhfUEtUIiwiZmVkQXV0aEluZm9Ub2tlbiIsInN0c3VybCIsInNwbiIsInRva2VuU2NvcGUiLCJVUkwiLCJjcmVkZW50aWFscyIsIlVzZXJuYW1lUGFzc3dvcmRDcmVkZW50aWFsIiwibXNpQXJncyIsIk1hbmFnZWRJZGVudGl0eUNyZWRlbnRpYWwiLCJtYW5hZ2VkSWRlbnRpdHlDbGllbnRJZCIsIkRlZmF1bHRBenVyZUNyZWRlbnRpYWwiLCJDbGllbnRTZWNyZXRDcmVkZW50aWFsIiwidG9rZW5SZXNwb25zZSIsImdldFRva2VuIiwiQWdncmVnYXRlRXJyb3IiLCJJbml0aWFsU3FsVG9rZW5IYW5kbGVyIiwiZXJyb3JzIiwiaXNUcmFuc2llbnQiLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiLCJwcm90b3R5cGUiLCJzb2NrZXRFcnJvciIsIlJlcXVlc3RUb2tlbkhhbmRsZXIiLCJTRU5UX0FUVEVOVElPTiIsIm9uUmVzdW1lIiwib25QYXVzZSIsInBhdXNlIiwib25FbmRPZk1lc3NhZ2UiLCJzcWxSZXF1ZXN0IiwibmV4dFN0YXRlIiwiQXR0ZW50aW9uVG9rZW5IYW5kbGVyIiwiYXR0ZW50aW9uUmVjZWl2ZWQiXSwic291cmNlcyI6WyIuLi9zcmMvY29ubmVjdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgdGxzIGZyb20gJ3Rscyc7XG5pbXBvcnQgKiBhcyBuZXQgZnJvbSAnbmV0JztcbmltcG9ydCBkbnMgZnJvbSAnZG5zJztcblxuaW1wb3J0IGNvbnN0YW50cyBmcm9tICdjb25zdGFudHMnO1xuaW1wb3J0IHsgdHlwZSBTZWN1cmVDb250ZXh0T3B0aW9ucyB9IGZyb20gJ3Rscyc7XG5cbmltcG9ydCB7IFJlYWRhYmxlIH0gZnJvbSAnc3RyZWFtJztcblxuaW1wb3J0IHtcbiAgQ2xpZW50U2VjcmV0Q3JlZGVudGlhbCxcbiAgRGVmYXVsdEF6dXJlQ3JlZGVudGlhbCxcbiAgTWFuYWdlZElkZW50aXR5Q3JlZGVudGlhbCxcbiAgVXNlcm5hbWVQYXNzd29yZENyZWRlbnRpYWxcbn0gZnJvbSAnQGF6dXJlL2lkZW50aXR5JztcbmltcG9ydCB7IHR5cGUgQWNjZXNzVG9rZW4sIHR5cGUgVG9rZW5DcmVkZW50aWFsLCBpc1Rva2VuQ3JlZGVudGlhbCB9IGZyb20gJ0BhenVyZS9jb3JlLWF1dGgnO1xuXG5pbXBvcnQgQnVsa0xvYWQsIHsgdHlwZSBPcHRpb25zIGFzIEJ1bGtMb2FkT3B0aW9ucywgdHlwZSBDYWxsYmFjayBhcyBCdWxrTG9hZENhbGxiYWNrIH0gZnJvbSAnLi9idWxrLWxvYWQnO1xuaW1wb3J0IERlYnVnIGZyb20gJy4vZGVidWcnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBvbmNlIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IGluc3RhbmNlTG9va3VwIH0gZnJvbSAnLi9pbnN0YW5jZS1sb29rdXAnO1xuaW1wb3J0IHsgVHJhbnNpZW50RXJyb3JMb29rdXAgfSBmcm9tICcuL3RyYW5zaWVudC1lcnJvci1sb29rdXAnO1xuaW1wb3J0IHsgVFlQRSB9IGZyb20gJy4vcGFja2V0JztcbmltcG9ydCBQcmVsb2dpblBheWxvYWQgZnJvbSAnLi9wcmVsb2dpbi1wYXlsb2FkJztcbmltcG9ydCBMb2dpbjdQYXlsb2FkIGZyb20gJy4vbG9naW43LXBheWxvYWQnO1xuaW1wb3J0IE5UTE1SZXNwb25zZVBheWxvYWQgZnJvbSAnLi9udGxtLXBheWxvYWQnO1xuaW1wb3J0IFJlcXVlc3QgZnJvbSAnLi9yZXF1ZXN0JztcbmltcG9ydCBScGNSZXF1ZXN0UGF5bG9hZCBmcm9tICcuL3JwY3JlcXVlc3QtcGF5bG9hZCc7XG5pbXBvcnQgU3FsQmF0Y2hQYXlsb2FkIGZyb20gJy4vc3FsYmF0Y2gtcGF5bG9hZCc7XG5pbXBvcnQgTWVzc2FnZUlPIGZyb20gJy4vbWVzc2FnZS1pbyc7XG5pbXBvcnQgeyBQYXJzZXIgYXMgVG9rZW5TdHJlYW1QYXJzZXIgfSBmcm9tICcuL3Rva2VuL3Rva2VuLXN0cmVhbS1wYXJzZXInO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb24sIElTT0xBVElPTl9MRVZFTCwgYXNzZXJ0VmFsaWRJc29sYXRpb25MZXZlbCB9IGZyb20gJy4vdHJhbnNhY3Rpb24nO1xuaW1wb3J0IHsgQ29ubmVjdGlvbkVycm9yLCBSZXF1ZXN0RXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5pbXBvcnQgeyBjb25uZWN0SW5QYXJhbGxlbCwgY29ubmVjdEluU2VxdWVuY2UgfSBmcm9tICcuL2Nvbm5lY3Rvcic7XG5pbXBvcnQgeyBuYW1lIGFzIGxpYnJhcnlOYW1lIH0gZnJvbSAnLi9saWJyYXJ5JztcbmltcG9ydCB7IHZlcnNpb25zIH0gZnJvbSAnLi90ZHMtdmVyc2lvbnMnO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB7IHR5cGUgTWV0YWRhdGEgfSBmcm9tICcuL21ldGFkYXRhLXBhcnNlcic7XG5pbXBvcnQgeyBjcmVhdGVOVExNUmVxdWVzdCB9IGZyb20gJy4vbnRsbSc7XG5pbXBvcnQgeyBDb2x1bW5FbmNyeXB0aW9uQXp1cmVLZXlWYXVsdFByb3ZpZGVyIH0gZnJvbSAnLi9hbHdheXMtZW5jcnlwdGVkL2tleXN0b3JlLXByb3ZpZGVyLWF6dXJlLWtleS12YXVsdCc7XG5cbmltcG9ydCB7IHR5cGUgUGFyYW1ldGVyLCBUWVBFUyB9IGZyb20gJy4vZGF0YS10eXBlJztcbmltcG9ydCB7IEJ1bGtMb2FkUGF5bG9hZCB9IGZyb20gJy4vYnVsay1sb2FkLXBheWxvYWQnO1xuaW1wb3J0IHsgQ29sbGF0aW9uIH0gZnJvbSAnLi9jb2xsYXRpb24nO1xuaW1wb3J0IFByb2NlZHVyZXMgZnJvbSAnLi9zcGVjaWFsLXN0b3JlZC1wcm9jZWR1cmUnO1xuXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcbmltcG9ydCB7IFVSTCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBBdHRlbnRpb25Ub2tlbkhhbmRsZXIsIEluaXRpYWxTcWxUb2tlbkhhbmRsZXIsIExvZ2luN1Rva2VuSGFuZGxlciwgUmVxdWVzdFRva2VuSGFuZGxlciwgVG9rZW5IYW5kbGVyIH0gZnJvbSAnLi90b2tlbi9oYW5kbGVyJztcblxudHlwZSBCZWdpblRyYW5zYWN0aW9uQ2FsbGJhY2sgPVxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aGVuIHRoZSByZXF1ZXN0IHRvIHN0YXJ0IHRoZSB0cmFuc2FjdGlvbiBoYXMgY29tcGxldGVkLFxuICAgKiBlaXRoZXIgc3VjY2Vzc2Z1bGx5IG9yIHdpdGggYW4gZXJyb3IuXG4gICAqIElmIGFuIGVycm9yIG9jY3VycmVkIHRoZW4gYGVycmAgd2lsbCBkZXNjcmliZSB0aGUgZXJyb3IuXG4gICAqXG4gICAqIEFzIG9ubHkgb25lIHJlcXVlc3QgYXQgYSB0aW1lIG1heSBiZSBleGVjdXRlZCBvbiBhIGNvbm5lY3Rpb24sIGFub3RoZXIgcmVxdWVzdCBzaG91bGQgbm90XG4gICAqIGJlIGluaXRpYXRlZCB1bnRpbCB0aGlzIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIGVyciBJZiBhbiBlcnJvciBvY2N1cnJlZCwgYW4gW1tFcnJvcl1dIG9iamVjdCB3aXRoIGRldGFpbHMgb2YgdGhlIGVycm9yLlxuICAgKiBAcGFyYW0gdHJhbnNhY3Rpb25EZXNjcmlwdG9yIEEgQnVmZmVyIHRoYXQgZGVzY3JpYmUgdGhlIHRyYW5zYWN0aW9uXG4gICAqL1xuICAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQsIHRyYW5zYWN0aW9uRGVzY3JpcHRvcj86IEJ1ZmZlcikgPT4gdm9pZFxuXG50eXBlIFNhdmVUcmFuc2FjdGlvbkNhbGxiYWNrID1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCB0byBzZXQgYSBzYXZlcG9pbnQgd2l0aGluIHRoZVxuICAgKiB0cmFuc2FjdGlvbiBoYXMgY29tcGxldGVkLCBlaXRoZXIgc3VjY2Vzc2Z1bGx5IG9yIHdpdGggYW4gZXJyb3IuXG4gICAqIElmIGFuIGVycm9yIG9jY3VycmVkIHRoZW4gYGVycmAgd2lsbCBkZXNjcmliZSB0aGUgZXJyb3IuXG4gICAqXG4gICAqIEFzIG9ubHkgb25lIHJlcXVlc3QgYXQgYSB0aW1lIG1heSBiZSBleGVjdXRlZCBvbiBhIGNvbm5lY3Rpb24sIGFub3RoZXIgcmVxdWVzdCBzaG91bGQgbm90XG4gICAqIGJlIGluaXRpYXRlZCB1bnRpbCB0aGlzIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIGVyciBJZiBhbiBlcnJvciBvY2N1cnJlZCwgYW4gW1tFcnJvcl1dIG9iamVjdCB3aXRoIGRldGFpbHMgb2YgdGhlIGVycm9yLlxuICAgKi9cbiAgKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkKSA9PiB2b2lkO1xuXG50eXBlIENvbW1pdFRyYW5zYWN0aW9uQ2FsbGJhY2sgPVxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aGVuIHRoZSByZXF1ZXN0IHRvIGNvbW1pdCB0aGUgdHJhbnNhY3Rpb24gaGFzIGNvbXBsZXRlZCxcbiAgICogZWl0aGVyIHN1Y2Nlc3NmdWxseSBvciB3aXRoIGFuIGVycm9yLlxuICAgKiBJZiBhbiBlcnJvciBvY2N1cnJlZCB0aGVuIGBlcnJgIHdpbGwgZGVzY3JpYmUgdGhlIGVycm9yLlxuICAgKlxuICAgKiBBcyBvbmx5IG9uZSByZXF1ZXN0IGF0IGEgdGltZSBtYXkgYmUgZXhlY3V0ZWQgb24gYSBjb25uZWN0aW9uLCBhbm90aGVyIHJlcXVlc3Qgc2hvdWxkIG5vdFxuICAgKiBiZSBpbml0aWF0ZWQgdW50aWwgdGhpcyBjYWxsYmFjayBpcyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnIgSWYgYW4gZXJyb3Igb2NjdXJyZWQsIGFuIFtbRXJyb3JdXSBvYmplY3Qgd2l0aCBkZXRhaWxzIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4gdm9pZDtcblxudHlwZSBSb2xsYmFja1RyYW5zYWN0aW9uQ2FsbGJhY2sgPVxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aGVuIHRoZSByZXF1ZXN0IHRvIHJvbGxiYWNrIHRoZSB0cmFuc2FjdGlvbiBoYXNcbiAgICogY29tcGxldGVkLCBlaXRoZXIgc3VjY2Vzc2Z1bGx5IG9yIHdpdGggYW4gZXJyb3IuXG4gICAqIElmIGFuIGVycm9yIG9jY3VycmVkIHRoZW4gZXJyIHdpbGwgZGVzY3JpYmUgdGhlIGVycm9yLlxuICAgKlxuICAgKiBBcyBvbmx5IG9uZSByZXF1ZXN0IGF0IGEgdGltZSBtYXkgYmUgZXhlY3V0ZWQgb24gYSBjb25uZWN0aW9uLCBhbm90aGVyIHJlcXVlc3Qgc2hvdWxkIG5vdFxuICAgKiBiZSBpbml0aWF0ZWQgdW50aWwgdGhpcyBjYWxsYmFjayBpcyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnIgSWYgYW4gZXJyb3Igb2NjdXJyZWQsIGFuIFtbRXJyb3JdXSBvYmplY3Qgd2l0aCBkZXRhaWxzIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4gdm9pZDtcblxudHlwZSBSZXNldENhbGxiYWNrID1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgY29ubmVjdGlvbiByZXNldCBoYXMgY29tcGxldGVkLFxuICAgKiBlaXRoZXIgc3VjY2Vzc2Z1bGx5IG9yIHdpdGggYW4gZXJyb3IuXG4gICAqXG4gICAqIElmIGFuIGVycm9yIG9jY3VycmVkIHRoZW4gYGVycmAgd2lsbCBkZXNjcmliZSB0aGUgZXJyb3IuXG4gICAqXG4gICAqIEFzIG9ubHkgb25lIHJlcXVlc3QgYXQgYSB0aW1lIG1heSBiZSBleGVjdXRlZCBvbiBhIGNvbm5lY3Rpb24sIGFub3RoZXJcbiAgICogcmVxdWVzdCBzaG91bGQgbm90IGJlIGluaXRpYXRlZCB1bnRpbCB0aGlzIGNhbGxiYWNrIGlzIGNhbGxlZFxuICAgKlxuICAgKiBAcGFyYW0gZXJyIElmIGFuIGVycm9yIG9jY3VycmVkLCBhbiBbW0Vycm9yXV0gb2JqZWN0IHdpdGggZGV0YWlscyBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQpID0+IHZvaWQ7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbnR5cGUgVHJhbnNhY3Rpb25DYWxsYmFjazxUIGV4dGVuZHMgKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCAuLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD4gPVxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aGVuIHRoZSByZXF1ZXN0IHRvIHN0YXJ0IGEgdHJhbnNhY3Rpb24gKG9yIGNyZWF0ZSBhIHNhdmVwb2ludCwgaW5cbiAgICogdGhlIGNhc2Ugb2YgYSBuZXN0ZWQgdHJhbnNhY3Rpb24pIGhhcyBjb21wbGV0ZWQsIGVpdGhlciBzdWNjZXNzZnVsbHkgb3Igd2l0aCBhbiBlcnJvci5cbiAgICogSWYgYW4gZXJyb3Igb2NjdXJyZWQsIHRoZW4gYGVycmAgd2lsbCBkZXNjcmliZSB0aGUgZXJyb3IuXG4gICAqIElmIG5vIGVycm9yIG9jY3VycmVkLCB0aGUgY2FsbGJhY2sgc2hvdWxkIHBlcmZvcm0gaXRzIHdvcmsgYW5kIGV2ZW50dWFsbHkgY2FsbFxuICAgKiBgZG9uZWAgd2l0aCBhbiBlcnJvciBvciBudWxsICh0byB0cmlnZ2VyIGEgdHJhbnNhY3Rpb24gcm9sbGJhY2sgb3IgYVxuICAgKiB0cmFuc2FjdGlvbiBjb21taXQpIGFuZCBhbiBhZGRpdGlvbmFsIGNvbXBsZXRpb24gY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSByZXF1ZXN0XG4gICAqIHRvIHJvbGxiYWNrIG9yIGNvbW1pdCB0aGUgY3VycmVudCB0cmFuc2FjdGlvbiBoYXMgY29tcGxldGVkLCBlaXRoZXIgc3VjY2Vzc2Z1bGx5IG9yIHdpdGggYW4gZXJyb3IuXG4gICAqIEFkZGl0aW9uYWwgYXJndW1lbnRzIGdpdmVuIHRvIGBkb25lYCB3aWxsIGJlIHBhc3NlZCB0aHJvdWdoIHRvIHRoaXMgY2FsbGJhY2suXG4gICAqXG4gICAqIEFzIG9ubHkgb25lIHJlcXVlc3QgYXQgYSB0aW1lIG1heSBiZSBleGVjdXRlZCBvbiBhIGNvbm5lY3Rpb24sIGFub3RoZXIgcmVxdWVzdCBzaG91bGQgbm90XG4gICAqIGJlIGluaXRpYXRlZCB1bnRpbCB0aGUgY29tcGxldGlvbiBjYWxsYmFjayBpcyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnIgSWYgYW4gZXJyb3Igb2NjdXJyZWQsIGFuIFtbRXJyb3JdXSBvYmplY3Qgd2l0aCBkZXRhaWxzIG9mIHRoZSBlcnJvci5cbiAgICogQHBhcmFtIHR4RG9uZSBJZiBubyBlcnJvciBvY2N1cnJlZCwgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgdG8gY29tbWl0IG9yIHJvbGxiYWNrIHRoZSB0cmFuc2FjdGlvbi5cbiAgICovXG4gIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgdHhEb25lPzogVHJhbnNhY3Rpb25Eb25lPFQ+KSA9PiB2b2lkO1xuXG50eXBlIFRyYW5zYWN0aW9uRG9uZUNhbGxiYWNrID0gKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCAuLi5hcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgQ2FsbGJhY2tQYXJhbWV0ZXJzPFQgZXh0ZW5kcyAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk+ID0gVCBleHRlbmRzIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgLi4uYXJnczogaW5mZXIgUCkgPT4gYW55ID8gUCA6IG5ldmVyO1xuXG50eXBlIFRyYW5zYWN0aW9uRG9uZTxUIGV4dGVuZHMgKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCAuLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD4gPVxuICAvKipcbiAgICogSWYgbm8gZXJyb3Igb2NjdXJyZWQsIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHRvIGNvbW1pdCBvciByb2xsYmFjayB0aGUgdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBlcnIgSWYgYW4gZXJyIG9jY3VycmVkLCBhIHN0cmluZyB3aXRoIGRldGFpbHMgb2YgdGhlIGVycm9yLlxuICAgKi9cbiAgKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCBkb25lOiBULCAuLi5hcmdzOiBDYWxsYmFja1BhcmFtZXRlcnM8VD4pID0+IHZvaWQ7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgS0VFUF9BTElWRV9JTklUSUFMX0RFTEFZID0gMzAgKiAxMDAwO1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX0NPTk5FQ1RfVElNRU9VVCA9IDE1ICogMTAwMDtcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9DTElFTlRfUkVRVUVTVF9USU1FT1VUID0gMTUgKiAxMDAwO1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX0NBTkNFTF9USU1FT1VUID0gNSAqIDEwMDA7XG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IERFRkFVTFRfQ09OTkVDVF9SRVRSWV9JTlRFUlZBTCA9IDUwMDtcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9QQUNLRVRfU0laRSA9IDQgKiAxMDI0O1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX1RFWFRTSVpFID0gMjE0NzQ4MzY0Nztcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9EQVRFRklSU1QgPSA3O1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX1BPUlQgPSAxNDMzO1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX1REU19WRVJTSU9OID0gJzdfNCc7XG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IERFRkFVTFRfTEFOR1VBR0UgPSAndXNfZW5nbGlzaCc7XG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IERFRkFVTFRfREFURUZPUk1BVCA9ICdtZHknO1xuXG5pbnRlcmZhY2UgQXp1cmVBY3RpdmVEaXJlY3RvcnlNc2lBcHBTZXJ2aWNlQXV0aGVudGljYXRpb24ge1xuICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktYXBwLXNlcnZpY2UnO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogSWYgeW91IHVzZXIgd2FudCB0byBjb25uZWN0IHRvIGFuIEF6dXJlIGFwcCBzZXJ2aWNlIHVzaW5nIGEgc3BlY2lmaWMgY2xpZW50IGFjY291bnRcbiAgICAgKiB0aGV5IG5lZWQgdG8gcHJvdmlkZSBgY2xpZW50SWRgIGFzc29jaWF0ZSB0byB0aGVpciBjcmVhdGVkIGlkZW50aXR5LlxuICAgICAqXG4gICAgICogVGhpcyBpcyBvcHRpb25hbCBmb3IgcmV0cmlldmUgdG9rZW4gZnJvbSBhenVyZSB3ZWIgYXBwIHNlcnZpY2VcbiAgICAgKi9cbiAgICBjbGllbnRJZD86IHN0cmluZztcbiAgfTtcbn1cblxuaW50ZXJmYWNlIEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpVm1BdXRoZW50aWNhdGlvbiB7XG4gIHR5cGU6ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS12bSc7XG4gIG9wdGlvbnM6IHtcbiAgICAvKipcbiAgICAgKiBJZiB5b3Ugd2FudCB0byBjb25uZWN0IHVzaW5nIGEgc3BlY2lmaWMgY2xpZW50IGFjY291bnRcbiAgICAgKiB0aGV5IG5lZWQgdG8gcHJvdmlkZSBgY2xpZW50SWRgIGFzc29jaWF0ZWQgdG8gdGhlaXIgY3JlYXRlZCBpZGVudGl0eS5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgb3B0aW9uYWwgZm9yIHJldHJpZXZlIGEgdG9rZW5cbiAgICAgKi9cbiAgICBjbGllbnRJZD86IHN0cmluZztcbiAgfTtcbn1cblxuaW50ZXJmYWNlIEF6dXJlQWN0aXZlRGlyZWN0b3J5RGVmYXVsdEF1dGhlbnRpY2F0aW9uIHtcbiAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCc7XG4gIG9wdGlvbnM6IHtcbiAgICAvKipcbiAgICAgKiBJZiB5b3Ugd2FudCB0byBjb25uZWN0IHVzaW5nIGEgc3BlY2lmaWMgY2xpZW50IGFjY291bnRcbiAgICAgKiB0aGV5IG5lZWQgdG8gcHJvdmlkZSBgY2xpZW50SWRgIGFzc29jaWF0ZWQgdG8gdGhlaXIgY3JlYXRlZCBpZGVudGl0eS5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgb3B0aW9uYWwgZm9yIHJldHJpZXZpbmcgYSB0b2tlblxuICAgICAqL1xuICAgIGNsaWVudElkPzogc3RyaW5nO1xuICB9O1xufVxuXG5cbmludGVyZmFjZSBBenVyZUFjdGl2ZURpcmVjdG9yeUFjY2Vzc1Rva2VuQXV0aGVudGljYXRpb24ge1xuICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1hY2Nlc3MtdG9rZW4nO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogQSB1c2VyIG5lZWQgdG8gcHJvdmlkZSBgdG9rZW5gIHdoaWNoIHRoZXkgcmV0cmlldmVkIGVsc2Ugd2hlcmVcbiAgICAgKiB0byBmb3JtaW5nIHRoZSBjb25uZWN0aW9uLlxuICAgICAqL1xuICAgIHRva2VuOiBzdHJpbmc7XG4gIH07XG59XG5cbmludGVyZmFjZSBBenVyZUFjdGl2ZURpcmVjdG9yeVBhc3N3b3JkQXV0aGVudGljYXRpb24ge1xuICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZCc7XG4gIG9wdGlvbnM6IHtcbiAgICAvKipcbiAgICAgKiBBIHVzZXIgbmVlZCB0byBwcm92aWRlIGB1c2VyTmFtZWAgYXNzb2NpYXRlIHRvIHRoZWlyIGFjY291bnQuXG4gICAgICovXG4gICAgdXNlck5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgdXNlciBuZWVkIHRvIHByb3ZpZGUgYHBhc3N3b3JkYCBhc3NvY2lhdGUgdG8gdGhlaXIgYWNjb3VudC5cbiAgICAgKi9cbiAgICBwYXNzd29yZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQSBjbGllbnQgaWQgdG8gdXNlLlxuICAgICAqL1xuICAgIGNsaWVudElkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25hbCBwYXJhbWV0ZXIgZm9yIHNwZWNpZmljIEF6dXJlIHRlbmFudCBJRFxuICAgICAqL1xuICAgIHRlbmFudElkOiBzdHJpbmc7XG4gIH07XG59XG5cbmludGVyZmFjZSBBenVyZUFjdGl2ZURpcmVjdG9yeVNlcnZpY2VQcmluY2lwYWxTZWNyZXQge1xuICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1zZXJ2aWNlLXByaW5jaXBhbC1zZWNyZXQnO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogQXBwbGljYXRpb24gKGBjbGllbnRgKSBJRCBmcm9tIHlvdXIgcmVnaXN0ZXJlZCBBenVyZSBhcHBsaWNhdGlvblxuICAgICAqL1xuICAgIGNsaWVudElkOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIGNyZWF0ZWQgYGNsaWVudCBzZWNyZXRgIGZvciB0aGlzIHJlZ2lzdGVyZWQgQXp1cmUgYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICBjbGllbnRTZWNyZXQ6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBEaXJlY3RvcnkgKGB0ZW5hbnRgKSBJRCBmcm9tIHlvdXIgcmVnaXN0ZXJlZCBBenVyZSBhcHBsaWNhdGlvblxuICAgICAqL1xuICAgIHRlbmFudElkOiBzdHJpbmc7XG4gIH07XG59XG5cbi8qKiBTdHJ1Y3R1cmUgdGhhdCBkZWZpbmVzIHRoZSBvcHRpb25zIHRoYXQgYXJlIG5lY2Vzc2FyeSB0byBhdXRoZW50aWNhdGUgdGhlIFRlZGlvdXMuSlMgaW5zdGFuY2Ugd2l0aCBhbiBgQGF6dXJlL2lkZW50aXR5YCB0b2tlbiBjcmVkZW50aWFsLiAqL1xuaW50ZXJmYWNlIFRva2VuQ3JlZGVudGlhbEF1dGhlbnRpY2F0aW9uIHtcbiAgLyoqIFVuaXF1ZSBkZXNpZ25hdG9yIGZvciB0aGUgdHlwZSBvZiBhdXRoZW50aWNhdGlvbiB0byBiZSB1c2VkLiAqL1xuICB0eXBlOiAndG9rZW4tY3JlZGVudGlhbCc7XG4gIC8qKiBTZXQgb2YgY29uZmlndXJhdGlvbnMgdGhhdCBhcmUgcmVxdWlyZWQgb3IgYWxsb3dlZCB3aXRoIHRoaXMgYXV0aGVudGljYXRpb24gdHlwZS4gKi9cbiAgb3B0aW9uczoge1xuICAgIC8qKiBDcmVkZW50aWFsIG9iamVjdCB1c2VkIHRvIGF1dGhlbnRpY2F0ZSB0byB0aGUgcmVzb3VyY2UuICovXG4gICAgY3JlZGVudGlhbDogVG9rZW5DcmVkZW50aWFsO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgTnRsbUF1dGhlbnRpY2F0aW9uIHtcbiAgdHlwZTogJ250bG0nO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogVXNlciBuYW1lIGZyb20geW91ciB3aW5kb3dzIGFjY291bnQuXG4gICAgICovXG4gICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBQYXNzd29yZCBmcm9tIHlvdXIgd2luZG93cyBhY2NvdW50LlxuICAgICAqL1xuICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogT25jZSB5b3Ugc2V0IGRvbWFpbiBmb3IgbnRsbSBhdXRoZW50aWNhdGlvbiB0eXBlLCBkcml2ZXIgd2lsbCBjb25uZWN0IHRvIFNRTCBTZXJ2ZXIgdXNpbmcgZG9tYWluIGxvZ2luLlxuICAgICAqXG4gICAgICogVGhpcyBpcyBuZWNlc3NhcnkgZm9yIGZvcm1pbmcgYSBjb25uZWN0aW9uIHVzaW5nIG50bG0gdHlwZVxuICAgICAqL1xuICAgIGRvbWFpbjogc3RyaW5nO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgRGVmYXVsdEF1dGhlbnRpY2F0aW9uIHtcbiAgdHlwZTogJ2RlZmF1bHQnO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogVXNlciBuYW1lIHRvIHVzZSBmb3Igc3FsIHNlcnZlciBsb2dpbi5cbiAgICAgKi9cbiAgICB1c2VyTmFtZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBQYXNzd29yZCB0byB1c2UgZm9yIHNxbCBzZXJ2ZXIgbG9naW4uXG4gICAgICovXG4gICAgcGFzc3dvcmQ/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIH07XG59XG5cbmludGVyZmFjZSBFcnJvcldpdGhDb2RlIGV4dGVuZHMgRXJyb3Ige1xuICBjb2RlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBDb25uZWN0aW9uQXV0aGVudGljYXRpb24gPSBEZWZhdWx0QXV0aGVudGljYXRpb24gfCBOdGxtQXV0aGVudGljYXRpb24gfCBUb2tlbkNyZWRlbnRpYWxBdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5UGFzc3dvcmRBdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpQXBwU2VydmljZUF1dGhlbnRpY2F0aW9uIHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlNc2lWbUF1dGhlbnRpY2F0aW9uIHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlBY2Nlc3NUb2tlbkF1dGhlbnRpY2F0aW9uIHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlTZXJ2aWNlUHJpbmNpcGFsU2VjcmV0IHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlEZWZhdWx0QXV0aGVudGljYXRpb247XG5cbmludGVyZmFjZSBJbnRlcm5hbENvbm5lY3Rpb25Db25maWcge1xuICBzZXJ2ZXI6IHN0cmluZztcbiAgYXV0aGVudGljYXRpb246IENvbm5lY3Rpb25BdXRoZW50aWNhdGlvbjtcbiAgb3B0aW9uczogSW50ZXJuYWxDb25uZWN0aW9uT3B0aW9ucztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbnRlcm5hbENvbm5lY3Rpb25PcHRpb25zIHtcbiAgYWJvcnRUcmFuc2FjdGlvbk9uRXJyb3I6IGJvb2xlYW47XG4gIGFwcE5hbWU6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgY2FtZWxDYXNlQ29sdW1uczogYm9vbGVhbjtcbiAgY2FuY2VsVGltZW91dDogbnVtYmVyO1xuICBjb2x1bW5FbmNyeXB0aW9uS2V5Q2FjaGVUVEw6IG51bWJlcjtcbiAgY29sdW1uRW5jcnlwdGlvblNldHRpbmc6IGJvb2xlYW47XG4gIGNvbHVtbk5hbWVSZXBsYWNlcjogdW5kZWZpbmVkIHwgKChjb2xOYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIG1ldGFkYXRhOiBNZXRhZGF0YSkgPT4gc3RyaW5nKTtcbiAgY29ubmVjdGlvblJldHJ5SW50ZXJ2YWw6IG51bWJlcjtcbiAgY29ubmVjdG9yOiB1bmRlZmluZWQgfCAoKCkgPT4gUHJvbWlzZTxuZXQuU29ja2V0Pik7XG4gIGNvbm5lY3RUaW1lb3V0OiBudW1iZXI7XG4gIGNvbm5lY3Rpb25Jc29sYXRpb25MZXZlbDogdHlwZW9mIElTT0xBVElPTl9MRVZFTFtrZXlvZiB0eXBlb2YgSVNPTEFUSU9OX0xFVkVMXTtcbiAgY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzOiBTZWN1cmVDb250ZXh0T3B0aW9ucztcbiAgZGF0YWJhc2U6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgZGF0ZWZpcnN0OiBudW1iZXI7XG4gIGRhdGVGb3JtYXQ6IHN0cmluZztcbiAgZGVidWc6IHtcbiAgICBkYXRhOiBib29sZWFuO1xuICAgIHBhY2tldDogYm9vbGVhbjtcbiAgICBwYXlsb2FkOiBib29sZWFuO1xuICAgIHRva2VuOiBib29sZWFuO1xuICB9O1xuICBlbmFibGVBbnNpTnVsbDogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZUFuc2lOdWxsRGVmYXVsdDogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZUFuc2lQYWRkaW5nOiBudWxsIHwgYm9vbGVhbjtcbiAgZW5hYmxlQW5zaVdhcm5pbmdzOiBudWxsIHwgYm9vbGVhbjtcbiAgZW5hYmxlQXJpdGhBYm9ydDogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsOiBudWxsIHwgYm9vbGVhbjtcbiAgZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdDogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zOiBudWxsIHwgYm9vbGVhbjtcbiAgZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnQ6IG51bGwgfCBib29sZWFuO1xuICBlbmFibGVRdW90ZWRJZGVudGlmaWVyOiBudWxsIHwgYm9vbGVhbjtcbiAgZW5jcnlwdDogc3RyaW5nIHwgYm9vbGVhbjtcbiAgZW5jcnlwdGlvbktleVN0b3JlUHJvdmlkZXJzOiBLZXlTdG9yZVByb3ZpZGVyTWFwIHwgdW5kZWZpbmVkO1xuICBmYWxsYmFja1RvRGVmYXVsdERiOiBib29sZWFuO1xuICBpbnN0YW5jZU5hbWU6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgaXNvbGF0aW9uTGV2ZWw6IHR5cGVvZiBJU09MQVRJT05fTEVWRUxba2V5b2YgdHlwZW9mIElTT0xBVElPTl9MRVZFTF07XG4gIGxhbmd1YWdlOiBzdHJpbmc7XG4gIGxvY2FsQWRkcmVzczogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICBtYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnM6IG51bWJlcjtcbiAgbXVsdGlTdWJuZXRGYWlsb3ZlcjogYm9vbGVhbjtcbiAgcGFja2V0U2l6ZTogbnVtYmVyO1xuICBwb3J0OiB1bmRlZmluZWQgfCBudW1iZXI7XG4gIHJlYWRPbmx5SW50ZW50OiBib29sZWFuO1xuICByZXF1ZXN0VGltZW91dDogbnVtYmVyO1xuICByb3dDb2xsZWN0aW9uT25Eb25lOiBib29sZWFuO1xuICByb3dDb2xsZWN0aW9uT25SZXF1ZXN0Q29tcGxldGlvbjogYm9vbGVhbjtcbiAgc2VydmVyTmFtZTogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICBzZXJ2ZXJTdXBwb3J0c0NvbHVtbkVuY3J5cHRpb246IGJvb2xlYW47XG4gIHRkc1ZlcnNpb246IHN0cmluZztcbiAgdGV4dHNpemU6IG51bWJlcjtcbiAgdHJ1c3RlZFNlcnZlck5hbWVBRTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICB0cnVzdFNlcnZlckNlcnRpZmljYXRlOiBib29sZWFuO1xuICB1c2VDb2x1bW5OYW1lczogYm9vbGVhbjtcbiAgdXNlVVRDOiBib29sZWFuO1xuICB3b3Jrc3RhdGlvbklkOiB1bmRlZmluZWQgfCBzdHJpbmc7XG4gIGxvd2VyQ2FzZUd1aWRzOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgS2V5U3RvcmVQcm92aWRlck1hcCB7XG4gIFtrZXk6IHN0cmluZ106IENvbHVtbkVuY3J5cHRpb25BenVyZUtleVZhdWx0UHJvdmlkZXI7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuaW50ZXJmYWNlIFN0YXRlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBlbnRlcj8odGhpczogQ29ubmVjdGlvbik6IHZvaWQ7XG4gIGV4aXQ/KHRoaXM6IENvbm5lY3Rpb24sIG5ld1N0YXRlOiBTdGF0ZSk6IHZvaWQ7XG4gIGV2ZW50czoge1xuICAgIHNvY2tldEVycm9yPyh0aGlzOiBDb25uZWN0aW9uLCBlcnI6IEVycm9yKTogdm9pZDtcbiAgICBtZXNzYWdlPyh0aGlzOiBDb25uZWN0aW9uLCBtZXNzYWdlOiBNZXNzYWdlKTogdm9pZDtcbiAgfTtcbn1cblxudHlwZSBBdXRoZW50aWNhdGlvbiA9IERlZmF1bHRBdXRoZW50aWNhdGlvbiB8XG4gIE50bG1BdXRoZW50aWNhdGlvbiB8XG4gIFRva2VuQ3JlZGVudGlhbEF1dGhlbnRpY2F0aW9uIHxcbiAgQXp1cmVBY3RpdmVEaXJlY3RvcnlQYXNzd29yZEF1dGhlbnRpY2F0aW9uIHxcbiAgQXp1cmVBY3RpdmVEaXJlY3RvcnlNc2lBcHBTZXJ2aWNlQXV0aGVudGljYXRpb24gfFxuICBBenVyZUFjdGl2ZURpcmVjdG9yeU1zaVZtQXV0aGVudGljYXRpb24gfFxuICBBenVyZUFjdGl2ZURpcmVjdG9yeUFjY2Vzc1Rva2VuQXV0aGVudGljYXRpb24gfFxuICBBenVyZUFjdGl2ZURpcmVjdG9yeVNlcnZpY2VQcmluY2lwYWxTZWNyZXQgfFxuICBBenVyZUFjdGl2ZURpcmVjdG9yeURlZmF1bHRBdXRoZW50aWNhdGlvbjtcblxudHlwZSBBdXRoZW50aWNhdGlvblR5cGUgPSBBdXRoZW50aWNhdGlvblsndHlwZSddO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25Db25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIEhvc3RuYW1lIHRvIGNvbm5lY3QgdG8uXG4gICAqL1xuICBzZXJ2ZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgZm9ybWluZyB0aGUgY29ubmVjdGlvbi5cbiAgICovXG4gIG9wdGlvbnM/OiBDb25uZWN0aW9uT3B0aW9ucztcbiAgLyoqXG4gICAqIEF1dGhlbnRpY2F0aW9uIHJlbGF0ZWQgb3B0aW9ucyBmb3IgY29ubmVjdGlvbi5cbiAgICovXG4gIGF1dGhlbnRpY2F0aW9uPzogQXV0aGVudGljYXRpb25PcHRpb25zO1xufVxuXG5pbnRlcmZhY2UgRGVidWdPcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbGxpbmcgd2hldGhlciBbW2RlYnVnXV0gZXZlbnRzIHdpbGwgYmUgZW1pdHRlZCB3aXRoIHRleHQgZGVzY3JpYmluZyBwYWNrZXQgZGF0YSBkZXRhaWxzXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKi9cbiAgZGF0YTogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbGxpbmcgd2hldGhlciBbW2RlYnVnXV0gZXZlbnRzIHdpbGwgYmUgZW1pdHRlZCB3aXRoIHRleHQgZGVzY3JpYmluZyBwYWNrZXQgZGV0YWlsc1xuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYClcbiAgICovXG4gIHBhY2tldDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbGxpbmcgd2hldGhlciBbW2RlYnVnXV0gZXZlbnRzIHdpbGwgYmUgZW1pdHRlZCB3aXRoIHRleHQgZGVzY3JpYmluZyBwYWNrZXQgcGF5bG9hZCBkZXRhaWxzXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKi9cbiAgcGF5bG9hZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbGxpbmcgd2hldGhlciBbW2RlYnVnXV0gZXZlbnRzIHdpbGwgYmUgZW1pdHRlZCB3aXRoIHRleHQgZGVzY3JpYmluZyB0b2tlbiBzdHJlYW0gdG9rZW5zXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKi9cbiAgdG9rZW46IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBBdXRoZW50aWNhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVHlwZSBvZiB0aGUgYXV0aGVudGljYXRpb24gbWV0aG9kLCB2YWxpZCB0eXBlcyBhcmUgYGRlZmF1bHRgLCBgbnRsbWAsXG4gICAqIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXBhc3N3b3JkYCwgYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktYWNjZXNzLXRva2VuYCxcbiAgICogYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtYCwgYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLWFwcC1zZXJ2aWNlYCxcbiAgICogYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdGBcbiAgICogb3IgYGF6dXJlLWFjdGl2ZS1kaXJlY3Rvcnktc2VydmljZS1wcmluY2lwYWwtc2VjcmV0YFxuICAgKi9cbiAgdHlwZT86IEF1dGhlbnRpY2F0aW9uVHlwZTtcbiAgLyoqXG4gICAqIERpZmZlcmVudCBvcHRpb25zIGZvciBhdXRoZW50aWNhdGlvbiB0eXBlczpcbiAgICpcbiAgICogKiBgZGVmYXVsdGA6IFtbRGVmYXVsdEF1dGhlbnRpY2F0aW9uLm9wdGlvbnNdXVxuICAgKiAqIGBudGxtYCA6W1tOdGxtQXV0aGVudGljYXRpb25dXVxuICAgKiAqIGB0b2tlbi1jcmVkZW50aWFsYDogW1tDcmVkZW50aWFsQ2hhaW5BdXRoZW50aWNhdGlvbi5vcHRpb25zXV1cbiAgICogKiBgYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZGAgOiBbW0F6dXJlQWN0aXZlRGlyZWN0b3J5UGFzc3dvcmRBdXRoZW50aWNhdGlvbi5vcHRpb25zXV1cbiAgICogKiBgYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1hY2Nlc3MtdG9rZW5gIDogW1tBenVyZUFjdGl2ZURpcmVjdG9yeUFjY2Vzc1Rva2VuQXV0aGVudGljYXRpb24ub3B0aW9uc11dXG4gICAqICogYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtYCA6IFtbQXp1cmVBY3RpdmVEaXJlY3RvcnlNc2lWbUF1dGhlbnRpY2F0aW9uLm9wdGlvbnNdXVxuICAgKiAqIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZWAgOiBbW0F6dXJlQWN0aXZlRGlyZWN0b3J5TXNpQXBwU2VydmljZUF1dGhlbnRpY2F0aW9uLm9wdGlvbnNdXVxuICAgKiAqIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXNlcnZpY2UtcHJpbmNpcGFsLXNlY3JldGAgOiBbW0F6dXJlQWN0aXZlRGlyZWN0b3J5U2VydmljZVByaW5jaXBhbFNlY3JldC5vcHRpb25zXV1cbiAgICogKiBgYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1kZWZhdWx0YCA6IFtbQXp1cmVBY3RpdmVEaXJlY3RvcnlEZWZhdWx0QXV0aGVudGljYXRpb24ub3B0aW9uc11dXG4gICAqL1xuICBvcHRpb25zPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRvIHJvbGxiYWNrIGEgdHJhbnNhY3Rpb24gYXV0b21hdGljYWxseSBpZiBhbnkgZXJyb3IgaXMgZW5jb3VudGVyZWRcbiAgICogZHVyaW5nIHRoZSBnaXZlbiB0cmFuc2FjdGlvbidzIGV4ZWN1dGlvbi4gVGhpcyBzZXRzIHRoZSB2YWx1ZSBmb3IgYFNFVCBYQUNUX0FCT1JUYCBkdXJpbmcgdGhlXG4gICAqIGluaXRpYWwgU1FMIHBoYXNlIG9mIGEgY29ubmVjdGlvbiBbZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvc3FsL3Qtc3FsL3N0YXRlbWVudHMvc2V0LXhhY3QtYWJvcnQtdHJhbnNhY3Qtc3FsKS5cbiAgICovXG4gIGFib3J0VHJhbnNhY3Rpb25PbkVycm9yPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQXBwbGljYXRpb24gbmFtZSB1c2VkIGZvciBpZGVudGlmeWluZyBhIHNwZWNpZmljIGFwcGxpY2F0aW9uIGluIHByb2ZpbGluZywgbG9nZ2luZyBvciB0cmFjaW5nIHRvb2xzIG9mIFNRTFNlcnZlci5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBUZWRpb3VzYClcbiAgICovXG4gIGFwcE5hbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbGxpbmcgd2hldGhlciB0aGUgY29sdW1uIG5hbWVzIHJldHVybmVkIHdpbGwgaGF2ZSB0aGUgZmlyc3QgbGV0dGVyIGNvbnZlcnRlZCB0byBsb3dlciBjYXNlXG4gICAqIChgdHJ1ZWApIG9yIG5vdC4gVGhpcyB2YWx1ZSBpcyBpZ25vcmVkIGlmIHlvdSBwcm92aWRlIGEgW1tjb2x1bW5OYW1lUmVwbGFjZXJdXS5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApLlxuICAgKi9cbiAgY2FtZWxDYXNlQ29sdW1ucz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgW1tSZXF1ZXN0LmNhbmNlbF1dIChhYm9ydCkgb2YgYSByZXF1ZXN0IGlzIGNvbnNpZGVyZWQgZmFpbGVkXG4gICAqXG4gICAqIChkZWZhdWx0OiBgNTAwMGApLlxuICAgKi9cbiAgY2FuY2VsVGltZW91dD86IG51bWJlcjtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB3aXRoIHBhcmFtZXRlcnMgYChjb2x1bW5OYW1lLCBpbmRleCwgY29sdW1uTWV0YURhdGEpYCBhbmQgcmV0dXJuaW5nIGEgc3RyaW5nLiBJZiBwcm92aWRlZCxcbiAgICogdGhpcyB3aWxsIGJlIGNhbGxlZCBvbmNlIHBlciBjb2x1bW4gcGVyIHJlc3VsdC1zZXQuIFRoZSByZXR1cm5lZCB2YWx1ZSB3aWxsIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgU1FMLXByb3ZpZGVkXG4gICAqIGNvbHVtbiBuYW1lIG9uIHJvdyBhbmQgbWV0YSBkYXRhIG9iamVjdHMuIFRoaXMgYWxsb3dzIHlvdSB0byBkeW5hbWljYWxseSBjb252ZXJ0IGJldHdlZW4gbmFtaW5nIGNvbnZlbnRpb25zLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYG51bGxgKVxuICAgKi9cbiAgY29sdW1uTmFtZVJlcGxhY2VyPzogKGNvbE5hbWU6IHN0cmluZywgaW5kZXg6IG51bWJlciwgbWV0YWRhdGE6IE1ldGFkYXRhKSA9PiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBtaWxsaXNlY29uZHMgYmVmb3JlIHJldHJ5aW5nIHRvIGVzdGFibGlzaCBjb25uZWN0aW9uLCBpbiBjYXNlIG9mIHRyYW5zaWVudCBmYWlsdXJlLlxuICAgKlxuICAgKiAoZGVmYXVsdDpgNTAwYClcbiAgICovXG4gIGNvbm5lY3Rpb25SZXRyeUludGVydmFsPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gY29ubmVjdG9yIGZhY3RvcnkgbWV0aG9kLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYHVuZGVmaW5lZGApXG4gICAqL1xuICBjb25uZWN0b3I/OiAoKSA9PiBQcm9taXNlPG5ldC5Tb2NrZXQ+O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIGF0dGVtcHQgdG8gY29ubmVjdCBpcyBjb25zaWRlcmVkIGZhaWxlZFxuICAgKlxuICAgKiAoZGVmYXVsdDogYDE1MDAwYCkuXG4gICAqL1xuICBjb25uZWN0VGltZW91dD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgaXNvbGF0aW9uIGxldmVsIGZvciBuZXcgY29ubmVjdGlvbnMuIEFsbCBvdXQtb2YtdHJhbnNhY3Rpb24gcXVlcmllcyBhcmUgZXhlY3V0ZWQgd2l0aCB0aGlzIHNldHRpbmcuXG4gICAqXG4gICAqIFRoZSBpc29sYXRpb24gbGV2ZWxzIGFyZSBhdmFpbGFibGUgZnJvbSBgcmVxdWlyZSgndGVkaW91cycpLklTT0xBVElPTl9MRVZFTGAuXG4gICAqICogYFJFQURfVU5DT01NSVRURURgXG4gICAqICogYFJFQURfQ09NTUlUVEVEYFxuICAgKiAqIGBSRVBFQVRBQkxFX1JFQURgXG4gICAqICogYFNFUklBTElaQUJMRWBcbiAgICogKiBgU05BUFNIT1RgXG4gICAqXG4gICAqIChkZWZhdWx0OiBgUkVBRF9DT01NSVRFRGApLlxuICAgKi9cbiAgY29ubmVjdGlvbklzb2xhdGlvbkxldmVsPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXaGVuIGVuY3J5cHRpb24gaXMgdXNlZCwgYW4gb2JqZWN0IG1heSBiZSBzdXBwbGllZCB0aGF0IHdpbGwgYmUgdXNlZFxuICAgKiBmb3IgdGhlIGZpcnN0IGFyZ3VtZW50IHdoZW4gY2FsbGluZyBbYHRscy5jcmVhdGVTZWN1cmVQYWlyYF0oaHR0cDovL25vZGVqcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3Rscy5odG1sI3Rsc190bHNfY3JlYXRlc2VjdXJlcGFpcl9jcmVkZW50aWFsc19pc3NlcnZlcl9yZXF1ZXN0Y2VydF9yZWplY3R1bmF1dGhvcml6ZWQpXG4gICAqXG4gICAqIChkZWZhdWx0OiBge31gKVxuICAgKi9cbiAgY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzPzogU2VjdXJlQ29udGV4dE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIERhdGFiYXNlIHRvIGNvbm5lY3QgdG8gKGRlZmF1bHQ6IGRlcGVuZGVudCBvbiBzZXJ2ZXIgY29uZmlndXJhdGlvbikuXG4gICAqL1xuICBkYXRhYmFzZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogU2V0cyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrIHRvIGEgbnVtYmVyIGZyb20gMSB0aHJvdWdoIDcuXG4gICAqL1xuICBkYXRlZmlyc3Q/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyBwb3NpdGlvbiBvZiBtb250aCwgZGF5IGFuZCB5ZWFyIGluIHRlbXBvcmFsIGRhdGF0eXBlcy5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBtZHlgKVxuICAgKi9cbiAgZGF0ZUZvcm1hdD86IHN0cmluZztcblxuICBkZWJ1Zz86IERlYnVnT3B0aW9ucztcblxuICAvKipcbiAgICogQSBib29sZWFuLCBjb250cm9scyB0aGUgd2F5IG51bGwgdmFsdWVzIHNob3VsZCBiZSB1c2VkIGR1cmluZyBjb21wYXJpc29uIG9wZXJhdGlvbi5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYClcbiAgICovXG4gIGVuYWJsZUFuc2lOdWxsPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgYFNFVCBBTlNJX05VTExfREZMVF9PTiBPTmAgd2lsbCBiZSBzZXQgaW4gdGhlIGluaXRpYWwgc3FsLiBUaGlzIG1lYW5zIG5ldyBjb2x1bW5zIHdpbGwgYmVcbiAgICogbnVsbGFibGUgYnkgZGVmYXVsdC4gU2VlIHRoZSBbVC1TUUwgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczE4NzM3NS5hc3B4KVxuICAgKlxuICAgKiAoZGVmYXVsdDogYHRydWVgKS5cbiAgICovXG4gIGVuYWJsZUFuc2lOdWxsRGVmYXVsdD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbHMgaWYgcGFkZGluZyBzaG91bGQgYmUgYXBwbGllZCBmb3IgdmFsdWVzIHNob3J0ZXIgdGhhbiB0aGUgc2l6ZSBvZiBkZWZpbmVkIGNvbHVtbi5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYClcbiAgICovXG4gIGVuYWJsZUFuc2lQYWRkaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgU1FMIFNlcnZlciB3aWxsIGZvbGxvdyBJU08gc3RhbmRhcmQgYmVoYXZpb3IgZHVyaW5nIHZhcmlvdXMgZXJyb3IgY29uZGl0aW9ucy4gRm9yIGRldGFpbHMsXG4gICAqIHNlZSBbZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvc3FsL3Qtc3FsL3N0YXRlbWVudHMvc2V0LWFuc2ktd2FybmluZ3MtdHJhbnNhY3Qtc3FsKVxuICAgKlxuICAgKiAoZGVmYXVsdDogYHRydWVgKVxuICAgKi9cbiAgZW5hYmxlQW5zaVdhcm5pbmdzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRW5kcyBhIHF1ZXJ5IHdoZW4gYW4gb3ZlcmZsb3cgb3IgZGl2aWRlLWJ5LXplcm8gZXJyb3Igb2NjdXJzIGR1cmluZyBxdWVyeSBleGVjdXRpb24uXG4gICAqIFNlZSBbZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvc3FsL3Qtc3FsL3N0YXRlbWVudHMvc2V0LWFyaXRoYWJvcnQtdHJhbnNhY3Qtc3FsP3ZpZXc9c3FsLXNlcnZlci0yMDE3KVxuICAgKiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYHRydWVgKVxuICAgKi9cbiAgZW5hYmxlQXJpdGhBYm9ydD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgZGV0ZXJtaW5lcyBpZiBjb25jYXRlbmF0aW9uIHdpdGggTlVMTCBzaG91bGQgcmVzdWx0IGluIE5VTEwgb3IgZW1wdHkgc3RyaW5nIHZhbHVlLCBtb3JlIGRldGFpbHMgaW5cbiAgICogW2RvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3NxbC90LXNxbC9zdGF0ZW1lbnRzL3NldC1jb25jYXQtbnVsbC15aWVsZHMtbnVsbC10cmFuc2FjdC1zcWwpXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdHJ1ZWApXG4gICAqL1xuICBlbmFibGVDb25jYXROdWxsWWllbGRzTnVsbD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbHMgd2hldGhlciBjdXJzb3Igc2hvdWxkIGJlIGNsb3NlZCwgaWYgdGhlIHRyYW5zYWN0aW9uIG9wZW5pbmcgaXQgZ2V0cyBjb21taXR0ZWQgb3Igcm9sbGVkXG4gICAqIGJhY2suXG4gICAqXG4gICAqIChkZWZhdWx0OiBgbnVsbGApXG4gICAqL1xuICBlbmFibGVDdXJzb3JDbG9zZU9uQ29tbWl0PzogYm9vbGVhbiB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgc2V0cyB0aGUgY29ubmVjdGlvbiB0byBlaXRoZXIgaW1wbGljaXQgb3IgYXV0b2NvbW1pdCB0cmFuc2FjdGlvbiBtb2RlLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYClcbiAgICovXG4gIGVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgZmFsc2UsIGVycm9yIGlzIG5vdCBnZW5lcmF0ZWQgZHVyaW5nIGxvc3Mgb2YgcHJlY2Vzc2lvbi5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApXG4gICAqL1xuICBlbmFibGVOdW1lcmljUm91bmRhYm9ydD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIGNoYXJhY3RlcnMgZW5jbG9zZWQgaW4gc2luZ2xlIHF1b3RlcyBhcmUgdHJlYXRlZCBhcyBsaXRlcmFscyBhbmQgdGhvc2UgZW5jbG9zZWQgZG91YmxlIHF1b3RlcyBhcmUgdHJlYXRlZCBhcyBpZGVudGlmaWVycy5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYClcbiAgICovXG4gIGVuYWJsZVF1b3RlZElkZW50aWZpZXI/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyB2YWx1ZSB0aGF0IGNhbiBiZSBvbmx5IHNldCB0byAnc3RyaWN0Jywgd2hpY2ggaW5kaWNhdGVzIHRoZSB1c2FnZSBURFMgOC4wIHByb3RvY29sLiBPdGhlcndpc2UsXG4gICAqIGEgYm9vbGVhbiBkZXRlcm1pbmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgY29ubmVjdGlvbiB3aWxsIGJlIGVuY3J5cHRlZC5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYClcbiAgICovXG4gIGVuY3J5cHQ/OiBzdHJpbmcgfCBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBpZiB0aGUgZGF0YWJhc2UgcmVxdWVzdGVkIGJ5IFtbZGF0YWJhc2VdXSBjYW5ub3QgYmUgYWNjZXNzZWQsXG4gICAqIHRoZSBjb25uZWN0aW9uIHdpbGwgZmFpbCB3aXRoIGFuIGVycm9yLiBIb3dldmVyLCBpZiBbW2ZhbGxiYWNrVG9EZWZhdWx0RGJdXSBpc1xuICAgKiBzZXQgdG8gYHRydWVgLCB0aGVuIHRoZSB1c2VyJ3MgZGVmYXVsdCBkYXRhYmFzZSB3aWxsIGJlIHVzZWQgaW5zdGVhZFxuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYClcbiAgICovXG4gIGZhbGxiYWNrVG9EZWZhdWx0RGI/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2UgbmFtZSB0byBjb25uZWN0IHRvLlxuICAgKiBUaGUgU1FMIFNlcnZlciBCcm93c2VyIHNlcnZpY2UgbXVzdCBiZSBydW5uaW5nIG9uIHRoZSBkYXRhYmFzZSBzZXJ2ZXIsXG4gICAqIGFuZCBVRFAgcG9ydCAxNDM0IG9uIHRoZSBkYXRhYmFzZSBzZXJ2ZXIgbXVzdCBiZSByZWFjaGFibGUuXG4gICAqXG4gICAqIChubyBkZWZhdWx0KVxuICAgKlxuICAgKiBNdXR1YWxseSBleGNsdXNpdmUgd2l0aCBbW3BvcnRdXS5cbiAgICovXG4gIGluc3RhbmNlTmFtZT86IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgaXNvbGF0aW9uIGxldmVsIHRoYXQgdHJhbnNhY3Rpb25zIHdpbGwgYmUgcnVuIHdpdGguXG4gICAqXG4gICAqIFRoZSBpc29sYXRpb24gbGV2ZWxzIGFyZSBhdmFpbGFibGUgZnJvbSBgcmVxdWlyZSgndGVkaW91cycpLklTT0xBVElPTl9MRVZFTGAuXG4gICAqICogYFJFQURfVU5DT01NSVRURURgXG4gICAqICogYFJFQURfQ09NTUlUVEVEYFxuICAgKiAqIGBSRVBFQVRBQkxFX1JFQURgXG4gICAqICogYFNFUklBTElaQUJMRWBcbiAgICogKiBgU05BUFNIT1RgXG4gICAqXG4gICAqIChkZWZhdWx0OiBgUkVBRF9DT01NSVRFRGApLlxuICAgKi9cbiAgaXNvbGF0aW9uTGV2ZWw/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgbGFuZ3VhZ2UgZW52aXJvbm1lbnQgZm9yIHRoZSBzZXNzaW9uLiBUaGUgc2Vzc2lvbiBsYW5ndWFnZSBkZXRlcm1pbmVzIHRoZSBkYXRldGltZSBmb3JtYXRzIGFuZCBzeXN0ZW0gbWVzc2FnZXMuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdXNfZW5nbGlzaGApLlxuICAgKi9cbiAgbGFuZ3VhZ2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIGluZGljYXRpbmcgd2hpY2ggbmV0d29yayBpbnRlcmZhY2UgKGlwIGFkZHJlc3MpIHRvIHVzZSB3aGVuIGNvbm5lY3RpbmcgdG8gU1FMIFNlcnZlci5cbiAgICovXG4gIGxvY2FsQWRkcmVzcz86IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQSBib29sZWFuIGRldGVybWluaW5nIHdoZXRoZXIgdG8gcGFyc2UgdW5pcXVlIGlkZW50aWZpZXIgdHlwZSB3aXRoIGxvd2VyY2FzZSBjYXNlIGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKS5cbiAgICovXG4gIGxvd2VyQ2FzZUd1aWRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIGNvbm5lY3Rpb24gcmV0cmllcyBmb3IgdHJhbnNpZW50IGVycm9ycy7jgIFcbiAgICpcbiAgICogKGRlZmF1bHQ6IGAzYCkuXG4gICAqL1xuICBtYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIE11bHRpU3VibmV0RmFpbG92ZXIgPSBUcnVlIHBhcmFtZXRlciwgd2hpY2ggY2FuIGhlbHAgbWluaW1pemUgdGhlIGNsaWVudCByZWNvdmVyeSBsYXRlbmN5IHdoZW4gZmFpbG92ZXJzIG9jY3VyLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYCkuXG4gICAqL1xuICBtdWx0aVN1Ym5ldEZhaWxvdmVyPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHNpemUgb2YgVERTIHBhY2tldHMgKHN1YmplY3QgdG8gbmVnb3RpYXRpb24gd2l0aCB0aGUgc2VydmVyKS5cbiAgICogU2hvdWxkIGJlIGEgcG93ZXIgb2YgMi5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGA0MDk2YCkuXG4gICAqL1xuICBwYWNrZXRTaXplPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBQb3J0IHRvIGNvbm5lY3QgdG8gKGRlZmF1bHQ6IGAxNDMzYCkuXG4gICAqXG4gICAqIE11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIFtbaW5zdGFuY2VOYW1lXV1cbiAgICovXG4gIHBvcnQ/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgY29ubmVjdGlvbiB3aWxsIHJlcXVlc3QgcmVhZCBvbmx5IGFjY2VzcyBmcm9tIGEgU1FMIFNlcnZlciBBdmFpbGFiaWxpdHlcbiAgICogR3JvdXAuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW2hlcmVdKGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9oaDcxMDA1NC5hc3B4IFwiTWljcm9zb2Z0OiBDb25maWd1cmUgUmVhZC1Pbmx5IFJvdXRpbmcgZm9yIGFuIEF2YWlsYWJpbGl0eSBHcm91cCAoU1FMIFNlcnZlcilcIilcbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApLlxuICAgKi9cbiAgcmVhZE9ubHlJbnRlbnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBiZWZvcmUgYSByZXF1ZXN0IGlzIGNvbnNpZGVyZWQgZmFpbGVkLCBvciBgMGAgZm9yIG5vIHRpbWVvdXQuXG4gICAqXG4gICAqIEFzIHNvb24gYXMgYSByZXNwb25zZSBpcyByZWNlaXZlZCwgdGhlIHRpbWVvdXQgaXMgY2xlYXJlZC4gVGhpcyBtZWFucyB0aGF0IHF1ZXJpZXMgdGhhdCBpbW1lZGlhdGVseSByZXR1cm4gYSByZXNwb25zZSBoYXZlIGFiaWxpdHkgdG8gcnVuIGxvbmdlciB0aGFuIHRoaXMgdGltZW91dC5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGAxNTAwMGApLlxuICAgKi9cbiAgcmVxdWVzdFRpbWVvdXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgdGhhdCB3aGVuIHRydWUgd2lsbCBleHBvc2UgcmVjZWl2ZWQgcm93cyBpbiBSZXF1ZXN0cyBkb25lIHJlbGF0ZWQgZXZlbnRzOlxuICAgKiAqIFtbUmVxdWVzdC5FdmVudF9kb25lSW5Qcm9jXV1cbiAgICogKiBbW1JlcXVlc3QuRXZlbnRfZG9uZVByb2NdXVxuICAgKiAqIFtbUmVxdWVzdC5FdmVudF9kb25lXV1cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApXG4gICAqXG4gICAqIENhdXRpb246IElmIG1hbnkgcm93IGFyZSByZWNlaXZlZCwgZW5hYmxpbmcgdGhpcyBvcHRpb24gY291bGQgcmVzdWx0IGluXG4gICAqIGV4Y2Vzc2l2ZSBtZW1vcnkgdXNhZ2UuXG4gICAqL1xuICByb3dDb2xsZWN0aW9uT25Eb25lPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBib29sZWFuLCB0aGF0IHdoZW4gdHJ1ZSB3aWxsIGV4cG9zZSByZWNlaXZlZCByb3dzIGluIFJlcXVlc3RzJyBjb21wbGV0aW9uIGNhbGxiYWNrLlNlZSBbW1JlcXVlc3QuY29uc3RydWN0b3JdXS5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApXG4gICAqXG4gICAqIENhdXRpb246IElmIG1hbnkgcm93IGFyZSByZWNlaXZlZCwgZW5hYmxpbmcgdGhpcyBvcHRpb24gY291bGQgcmVzdWx0IGluXG4gICAqIGV4Y2Vzc2l2ZSBtZW1vcnkgdXNhZ2UuXG4gICAqL1xuICByb3dDb2xsZWN0aW9uT25SZXF1ZXN0Q29tcGxldGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG9mIFREUyB0byB1c2UuIElmIHNlcnZlciBkb2Vzbid0IHN1cHBvcnQgc3BlY2lmaWVkIHZlcnNpb24sIG5lZ290aWF0ZWQgdmVyc2lvbiBpcyB1c2VkIGluc3RlYWQuXG4gICAqXG4gICAqIFRoZSB2ZXJzaW9ucyBhcmUgYXZhaWxhYmxlIGZyb20gYHJlcXVpcmUoJ3RlZGlvdXMnKS5URFNfVkVSU0lPTmAuXG4gICAqICogYDdfMWBcbiAgICogKiBgN18yYFxuICAgKiAqIGA3XzNfQWBcbiAgICogKiBgN18zX0JgXG4gICAqICogYDdfNGBcbiAgICpcbiAgICogKGRlZmF1bHQ6IGA3XzRgKVxuICAgKi9cbiAgdGRzVmVyc2lvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBzaXplIG9mIHZhcmNoYXIobWF4KSwgbnZhcmNoYXIobWF4KSwgdmFyYmluYXJ5KG1heCksIHRleHQsIG50ZXh0LCBhbmQgaW1hZ2UgZGF0YSByZXR1cm5lZCBieSBhIFNFTEVDVCBzdGF0ZW1lbnQuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgMjE0NzQ4MzY0N2ApXG4gICAqL1xuICB0ZXh0c2l6ZT86IG51bWJlcjtcblxuICAvKipcbiAgICogSWYgXCJ0cnVlXCIsIHRoZSBTUUwgU2VydmVyIFNTTCBjZXJ0aWZpY2F0ZSBpcyBhdXRvbWF0aWNhbGx5IHRydXN0ZWQgd2hlbiB0aGUgY29tbXVuaWNhdGlvbiBsYXllciBpcyBlbmNyeXB0ZWQgdXNpbmcgU1NMLlxuICAgKlxuICAgKiBJZiBcImZhbHNlXCIsIHRoZSBTUUwgU2VydmVyIHZhbGlkYXRlcyB0aGUgc2VydmVyIFNTTCBjZXJ0aWZpY2F0ZS4gSWYgdGhlIHNlcnZlciBjZXJ0aWZpY2F0ZSB2YWxpZGF0aW9uIGZhaWxzLFxuICAgKiB0aGUgZHJpdmVyIHJhaXNlcyBhbiBlcnJvciBhbmQgdGVybWluYXRlcyB0aGUgY29ubmVjdGlvbi4gTWFrZSBzdXJlIHRoZSB2YWx1ZSBwYXNzZWQgdG8gc2VydmVyTmFtZSBleGFjdGx5XG4gICAqIG1hdGNoZXMgdGhlIENvbW1vbiBOYW1lIChDTikgb3IgRE5TIG5hbWUgaW4gdGhlIFN1YmplY3QgQWx0ZXJuYXRlIE5hbWUgaW4gdGhlIHNlcnZlciBjZXJ0aWZpY2F0ZSBmb3IgYW4gU1NMIGNvbm5lY3Rpb24gdG8gc3VjY2VlZC5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYClcbiAgICovXG4gIHRydXN0U2VydmVyQ2VydGlmaWNhdGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgc2VydmVyTmFtZT86IHN0cmluZztcbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRvIHJldHVybiByb3dzIGFzIGFycmF5cyBvciBrZXktdmFsdWUgY29sbGVjdGlvbnMuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKS5cbiAgICovXG4gIHVzZUNvbHVtbk5hbWVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBib29sZWFuIGRldGVybWluaW5nIHdoZXRoZXIgdG8gcGFzcyB0aW1lIHZhbHVlcyBpbiBVVEMgb3IgbG9jYWwgdGltZS5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYCkuXG4gICAqL1xuICB1c2VVVEM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgd29ya3N0YXRpb24gSUQgKFdTSUQpIG9mIHRoZSBjbGllbnQsIGRlZmF1bHQgb3MuaG9zdG5hbWUoKS5cbiAgICogVXNlZCBmb3IgaWRlbnRpZnlpbmcgYSBzcGVjaWZpYyBjbGllbnQgaW4gcHJvZmlsaW5nLCBsb2dnaW5nIG9yXG4gICAqIHRyYWNpbmcgY2xpZW50IGFjdGl2aXR5IGluIFNRTFNlcnZlci5cbiAgICpcbiAgICogVGhlIHZhbHVlIGlzIHJlcG9ydGVkIGJ5IHRoZSBUU1FMIGZ1bmN0aW9uIEhPU1RfTkFNRSgpLlxuICAgKi9cbiAgd29ya3N0YXRpb25JZD86IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cblxuaW50ZXJmYWNlIFJvdXRpbmdEYXRhIHtcbiAgc2VydmVyOiBzdHJpbmc7XG4gIHBvcnQ6IG51bWJlcjtcbiAgbG9naW43c2VydmVyOiBzdHJpbmc7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uLCBlcXVpdmFsZW50IHRvIGBQcm9taXNlLndpdGhSZXNvbHZlcnMoKWAuXG4gKlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgYHByb21pc2VgLCBgcmVzb2x2ZWAsIGFuZCBgcmVqZWN0YC5cbiAqL1xuZnVuY3Rpb24gd2l0aFJlc29sdmVyczxUPigpIHtcbiAgbGV0IHJlc29sdmU6ICh2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KSA9PiB2b2lkO1xuICBsZXQgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xuXG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZTxUPigocmVzLCByZWopID0+IHtcbiAgICByZXNvbHZlID0gcmVzO1xuICAgIHJlamVjdCA9IHJlajtcbiAgfSk7XG5cbiAgcmV0dXJuIHsgcHJvbWlzZSwgcmVzb2x2ZTogcmVzb2x2ZSEsIHJlamVjdDogcmVqZWN0ISB9O1xufVxuXG4vKipcbiAqIEEgW1tDb25uZWN0aW9uXV0gaW5zdGFuY2UgcmVwcmVzZW50cyBhIHNpbmdsZSBjb25uZWN0aW9uIHRvIGEgZGF0YWJhc2Ugc2VydmVyLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgQ29ubmVjdGlvbiA9IHJlcXVpcmUoJ3RlZGlvdXMnKS5Db25uZWN0aW9uO1xuICogdmFyIGNvbmZpZyA9IHtcbiAqICBcImF1dGhlbnRpY2F0aW9uXCI6IHtcbiAqICAgIC4uLixcbiAqICAgIFwib3B0aW9uc1wiOiB7Li4ufVxuICogIH0sXG4gKiAgXCJvcHRpb25zXCI6IHsuLi59XG4gKiB9O1xuICogdmFyIGNvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihjb25maWcpO1xuICogYGBgXG4gKlxuICogT25seSBvbmUgcmVxdWVzdCBhdCBhIHRpbWUgbWF5IGJlIGV4ZWN1dGVkIG9uIGEgY29ubmVjdGlvbi4gT25jZSBhIFtbUmVxdWVzdF1dXG4gKiBoYXMgYmVlbiBpbml0aWF0ZWQgKHdpdGggW1tDb25uZWN0aW9uLmNhbGxQcm9jZWR1cmVdXSwgW1tDb25uZWN0aW9uLmV4ZWNTcWxdXSxcbiAqIG9yIFtbQ29ubmVjdGlvbi5leGVjU3FsQmF0Y2hdXSksIGFub3RoZXIgc2hvdWxkIG5vdCBiZSBpbml0aWF0ZWQgdW50aWwgdGhlXG4gKiBbW1JlcXVlc3RdXSdzIGNvbXBsZXRpb24gY2FsbGJhY2sgaXMgY2FsbGVkLlxuICovXG5jbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGZlZEF1dGhSZXF1aXJlZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNvbmZpZzogSW50ZXJuYWxDb25uZWN0aW9uQ29uZmlnO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgc2VjdXJlQ29udGV4dE9wdGlvbnM6IFNlY3VyZUNvbnRleHRPcHRpb25zO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgaW5UcmFuc2FjdGlvbjogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHRyYW5zYWN0aW9uRGVzY3JpcHRvcnM6IEJ1ZmZlcltdO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgdHJhbnNhY3Rpb25EZXB0aDogbnVtYmVyO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgaXNTcWxCYXRjaDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGN1clRyYW5zaWVudFJldHJ5Q291bnQ6IG51bWJlcjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHRyYW5zaWVudEVycm9yTG9va3VwOiBUcmFuc2llbnRFcnJvckxvb2t1cDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNsb3NlZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGxvZ2luRXJyb3I6IHVuZGVmaW5lZCB8IEFnZ3JlZ2F0ZUVycm9yIHwgQ29ubmVjdGlvbkVycm9yO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgZGVidWc6IERlYnVnO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgbnRsbXBhY2tldDogdW5kZWZpbmVkIHwgYW55O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgbnRsbXBhY2tldEJ1ZmZlcjogdW5kZWZpbmVkIHwgQnVmZmVyO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBTVEFURToge1xuICAgIElOSVRJQUxJWkVEOiBTdGF0ZTtcbiAgICBDT05ORUNUSU5HOiBTdGF0ZTtcbiAgICBTRU5UX1BSRUxPR0lOOiBTdGF0ZTtcbiAgICBSRVJPVVRJTkc6IFN0YXRlO1xuICAgIFRSQU5TSUVOVF9GQUlMVVJFX1JFVFJZOiBTdGF0ZTtcbiAgICBTRU5UX1RMU1NTTE5FR09USUFUSU9OOiBTdGF0ZTtcbiAgICBTRU5UX0xPR0lON19XSVRIX1NUQU5EQVJEX0xPR0lOOiBTdGF0ZTtcbiAgICBTRU5UX0xPR0lON19XSVRIX05UTE06IFN0YXRlO1xuICAgIFNFTlRfTE9HSU43X1dJVEhfRkVEQVVUSDogU3RhdGU7XG4gICAgTE9HR0VEX0lOX1NFTkRJTkdfSU5JVElBTF9TUUw6IFN0YXRlO1xuICAgIExPR0dFRF9JTjogU3RhdGU7XG4gICAgU0VOVF9DTElFTlRfUkVRVUVTVDogU3RhdGU7XG4gICAgU0VOVF9BVFRFTlRJT046IFN0YXRlO1xuICAgIEZJTkFMOiBTdGF0ZTtcbiAgfTtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgcm91dGluZ0RhdGE6IHVuZGVmaW5lZCB8IFJvdXRpbmdEYXRhO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBtZXNzYWdlSW86IE1lc3NhZ2VJTztcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHN0YXRlOiBTdGF0ZTtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJlc2V0Q29ubmVjdGlvbk9uTmV4dFJlcXVlc3Q6IHVuZGVmaW5lZCB8IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJlcXVlc3Q6IHVuZGVmaW5lZCB8IFJlcXVlc3QgfCBCdWxrTG9hZDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHByb2NSZXR1cm5TdGF0dXNWYWx1ZTogdW5kZWZpbmVkIHwgYW55O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgc29ja2V0OiB1bmRlZmluZWQgfCBuZXQuU29ja2V0O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgbWVzc2FnZUJ1ZmZlcjogQnVmZmVyO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBjYW5jZWxUaW1lcjogdW5kZWZpbmVkIHwgTm9kZUpTLlRpbWVvdXQ7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSByZXF1ZXN0VGltZXI6IHVuZGVmaW5lZCB8IE5vZGVKUy5UaW1lb3V0O1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBfY2FuY2VsQWZ0ZXJSZXF1ZXN0U2VudDogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgZGF0YWJhc2VDb2xsYXRpb246IENvbGxhdGlvbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgX29uU29ja2V0Q2xvc2U6IChoYWRFcnJvcjogYm9vbGVhbikgPT4gdm9pZDtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgX29uU29ja2V0RXJyb3I6IChlcnI6IEVycm9yKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBfb25Tb2NrZXRFbmQ6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIE5vdGU6IGJlIGF3YXJlIG9mIHRoZSBkaWZmZXJlbnQgb3B0aW9ucyBmaWVsZDpcbiAgICogMS4gY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnNcbiAgICogMi4gY29uZmlnLm9wdGlvbnNcbiAgICpcbiAgICogYGBganNcbiAgICogY29uc3QgeyBDb25uZWN0aW9uIH0gPSByZXF1aXJlKCd0ZWRpb3VzJyk7XG4gICAqXG4gICAqIGNvbnN0IGNvbmZpZyA9IHtcbiAgICogIFwiYXV0aGVudGljYXRpb25cIjoge1xuICAgKiAgICAuLi4sXG4gICAqICAgIFwib3B0aW9uc1wiOiB7Li4ufVxuICAgKiAgfSxcbiAgICogIFwib3B0aW9uc1wiOiB7Li4ufVxuICAgKiB9O1xuICAgKlxuICAgKiBjb25zdCBjb25uZWN0aW9uID0gbmV3IENvbm5lY3Rpb24oY29uZmlnKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWdcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29ubmVjdGlvbkNvbmZpZ3VyYXRpb24pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHR5cGVvZiBjb25maWcgIT09ICdvYmplY3QnIHx8IGNvbmZpZyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnXCIgYXJndW1lbnQgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgb2YgdHlwZSBPYmplY3QuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb25maWcuc2VydmVyICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLnNlcnZlclwiIHByb3BlcnR5IGlzIHJlcXVpcmVkIGFuZCBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgIH1cblxuICAgIHRoaXMuZmVkQXV0aFJlcXVpcmVkID0gZmFsc2U7XG5cbiAgICBsZXQgYXV0aGVudGljYXRpb246IENvbm5lY3Rpb25BdXRoZW50aWNhdGlvbjtcbiAgICBpZiAoY29uZmlnLmF1dGhlbnRpY2F0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uZmlnLmF1dGhlbnRpY2F0aW9uICE9PSAnb2JqZWN0JyB8fCBjb25maWcuYXV0aGVudGljYXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIE9iamVjdC4nKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdHlwZSA9IGNvbmZpZy5hdXRoZW50aWNhdGlvbi50eXBlO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zID09PSB1bmRlZmluZWQgPyB7fSA6IGNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zO1xuXG4gICAgICBpZiAodHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi50eXBlXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUgIT09ICdkZWZhdWx0JyAmJiB0eXBlICE9PSAnbnRsbScgJiYgdHlwZSAhPT0gJ3Rva2VuLWNyZWRlbnRpYWwnICYmIHR5cGUgIT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXBhc3N3b3JkJyAmJiB0eXBlICE9PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1hY2Nlc3MtdG9rZW4nICYmIHR5cGUgIT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS12bScgJiYgdHlwZSAhPT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLWFwcC1zZXJ2aWNlJyAmJiB0eXBlICE9PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1zZXJ2aWNlLXByaW5jaXBhbC1zZWNyZXQnICYmIHR5cGUgIT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWRlZmF1bHQnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcInR5cGVcIiBwcm9wZXJ0eSBtdXN0IG9uZSBvZiBcImRlZmF1bHRcIiwgXCJudGxtXCIsIFwidG9rZW4tY3JlZGVudGlhbFwiLCBcImF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmRcIiwgXCJhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWFjY2Vzcy10b2tlblwiLCBcImF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdFwiLCBcImF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtXCIgb3IgXCJhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZVwiIG9yIFwiYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1zZXJ2aWNlLXByaW5jaXBhbC1zZWNyZXRcIi4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0JyB8fCBvcHRpb25zID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIG9iamVjdC4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUgPT09ICdudGxtJykge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZG9tYWluICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLmRvbWFpblwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy51c2VyTmFtZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLnVzZXJOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLnVzZXJOYW1lXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLnBhc3N3b3JkICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMucGFzc3dvcmQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMucGFzc3dvcmRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0aGVudGljYXRpb24gPSB7XG4gICAgICAgICAgdHlwZTogJ250bG0nLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHVzZXJOYW1lOiBvcHRpb25zLnVzZXJOYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IG9wdGlvbnMucGFzc3dvcmQsXG4gICAgICAgICAgICBkb21haW46IG9wdGlvbnMuZG9tYWluICYmIG9wdGlvbnMuZG9tYWluLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0b2tlbi1jcmVkZW50aWFsJykge1xuICAgICAgICBpZiAoIWlzVG9rZW5DcmVkZW50aWFsKG9wdGlvbnMuY3JlZGVudGlhbCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5jcmVkZW50aWFsXCIgcHJvcGVydHkgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGUgdG9rZW4gY3JlZGVudGlhbCBjbGFzcy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uID0ge1xuICAgICAgICAgIHR5cGU6ICd0b2tlbi1jcmVkZW50aWFsJyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjcmVkZW50aWFsOiBvcHRpb25zLmNyZWRlbnRpYWxcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXBhc3N3b3JkJykge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xpZW50SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50SWRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMudXNlck5hbWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy51c2VyTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy51c2VyTmFtZVwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5wYXNzd29yZCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLnBhc3N3b3JkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLnBhc3N3b3JkXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLnRlbmFudElkICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMudGVuYW50SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudGVuYW50SWRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0aGVudGljYXRpb24gPSB7XG4gICAgICAgICAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmQnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHVzZXJOYW1lOiBvcHRpb25zLnVzZXJOYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IG9wdGlvbnMucGFzc3dvcmQsXG4gICAgICAgICAgICB0ZW5hbnRJZDogb3B0aW9ucy50ZW5hbnRJZCxcbiAgICAgICAgICAgIGNsaWVudElkOiBvcHRpb25zLmNsaWVudElkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1hY2Nlc3MtdG9rZW4nKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy50b2tlbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy50b2tlblwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1hY2Nlc3MtdG9rZW4nLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHRva2VuOiBvcHRpb25zLnRva2VuXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktdm0nKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNsaWVudElkICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMuY2xpZW50SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50SWRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0aGVudGljYXRpb24gPSB7XG4gICAgICAgICAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtJyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjbGllbnRJZDogb3B0aW9ucy5jbGllbnRJZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCcpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY2xpZW50SWQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5jbGllbnRJZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgYXV0aGVudGljYXRpb24gPSB7XG4gICAgICAgICAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCcsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2xpZW50SWQ6IG9wdGlvbnMuY2xpZW50SWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZScpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY2xpZW50SWQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5jbGllbnRJZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktYXBwLXNlcnZpY2UnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNsaWVudElkOiBvcHRpb25zLmNsaWVudElkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1zZXJ2aWNlLXByaW5jaXBhbC1zZWNyZXQnKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jbGllbnRJZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xpZW50U2VjcmV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLmNsaWVudFNlY3JldFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMudGVuYW50SWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudGVuYW50SWRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0aGVudGljYXRpb24gPSB7XG4gICAgICAgICAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3Rvcnktc2VydmljZS1wcmluY2lwYWwtc2VjcmV0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjbGllbnRJZDogb3B0aW9ucy5jbGllbnRJZCxcbiAgICAgICAgICAgIGNsaWVudFNlY3JldDogb3B0aW9ucy5jbGllbnRTZWNyZXQsXG4gICAgICAgICAgICB0ZW5hbnRJZDogb3B0aW9ucy50ZW5hbnRJZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcHRpb25zLnVzZXJOYW1lICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMudXNlck5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudXNlck5hbWVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucGFzc3dvcmQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5wYXNzd29yZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5wYXNzd29yZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnZGVmYXVsdCcsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdXNlck5hbWU6IG9wdGlvbnMudXNlck5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogb3B0aW9ucy5wYXNzd29yZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXV0aGVudGljYXRpb24gPSB7XG4gICAgICAgIHR5cGU6ICdkZWZhdWx0JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHVzZXJOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgcGFzc3dvcmQ6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgc2VydmVyOiBjb25maWcuc2VydmVyLFxuICAgICAgYXV0aGVudGljYXRpb246IGF1dGhlbnRpY2F0aW9uLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBhYm9ydFRyYW5zYWN0aW9uT25FcnJvcjogZmFsc2UsXG4gICAgICAgIGFwcE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgY2FtZWxDYXNlQ29sdW1uczogZmFsc2UsXG4gICAgICAgIGNhbmNlbFRpbWVvdXQ6IERFRkFVTFRfQ0FOQ0VMX1RJTUVPVVQsXG4gICAgICAgIGNvbHVtbkVuY3J5cHRpb25LZXlDYWNoZVRUTDogMiAqIDYwICogNjAgKiAxMDAwLCAgLy8gVW5pdHM6IG1pbGxpc2Vjb25kc1xuICAgICAgICBjb2x1bW5FbmNyeXB0aW9uU2V0dGluZzogZmFsc2UsXG4gICAgICAgIGNvbHVtbk5hbWVSZXBsYWNlcjogdW5kZWZpbmVkLFxuICAgICAgICBjb25uZWN0aW9uUmV0cnlJbnRlcnZhbDogREVGQVVMVF9DT05ORUNUX1JFVFJZX0lOVEVSVkFMLFxuICAgICAgICBjb25uZWN0VGltZW91dDogREVGQVVMVF9DT05ORUNUX1RJTUVPVVQsXG4gICAgICAgIGNvbm5lY3RvcjogdW5kZWZpbmVkLFxuICAgICAgICBjb25uZWN0aW9uSXNvbGF0aW9uTGV2ZWw6IElTT0xBVElPTl9MRVZFTC5SRUFEX0NPTU1JVFRFRCxcbiAgICAgICAgY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzOiB7fSxcbiAgICAgICAgZGF0YWJhc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgZGF0ZWZpcnN0OiBERUZBVUxUX0RBVEVGSVJTVCxcbiAgICAgICAgZGF0ZUZvcm1hdDogREVGQVVMVF9EQVRFRk9STUFULFxuICAgICAgICBkZWJ1Zzoge1xuICAgICAgICAgIGRhdGE6IGZhbHNlLFxuICAgICAgICAgIHBhY2tldDogZmFsc2UsXG4gICAgICAgICAgcGF5bG9hZDogZmFsc2UsXG4gICAgICAgICAgdG9rZW46IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGVuYWJsZUFuc2lOdWxsOiB0cnVlLFxuICAgICAgICBlbmFibGVBbnNpTnVsbERlZmF1bHQ6IHRydWUsXG4gICAgICAgIGVuYWJsZUFuc2lQYWRkaW5nOiB0cnVlLFxuICAgICAgICBlbmFibGVBbnNpV2FybmluZ3M6IHRydWUsXG4gICAgICAgIGVuYWJsZUFyaXRoQWJvcnQ6IHRydWUsXG4gICAgICAgIGVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsOiB0cnVlLFxuICAgICAgICBlbmFibGVDdXJzb3JDbG9zZU9uQ29tbWl0OiBudWxsLFxuICAgICAgICBlbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9uczogZmFsc2UsXG4gICAgICAgIGVuYWJsZU51bWVyaWNSb3VuZGFib3J0OiBmYWxzZSxcbiAgICAgICAgZW5hYmxlUXVvdGVkSWRlbnRpZmllcjogdHJ1ZSxcbiAgICAgICAgZW5jcnlwdDogdHJ1ZSxcbiAgICAgICAgZmFsbGJhY2tUb0RlZmF1bHREYjogZmFsc2UsXG4gICAgICAgIGVuY3J5cHRpb25LZXlTdG9yZVByb3ZpZGVyczogdW5kZWZpbmVkLFxuICAgICAgICBpbnN0YW5jZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgaXNvbGF0aW9uTGV2ZWw6IElTT0xBVElPTl9MRVZFTC5SRUFEX0NPTU1JVFRFRCxcbiAgICAgICAgbGFuZ3VhZ2U6IERFRkFVTFRfTEFOR1VBR0UsXG4gICAgICAgIGxvY2FsQWRkcmVzczogdW5kZWZpbmVkLFxuICAgICAgICBtYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnM6IDMsXG4gICAgICAgIG11bHRpU3VibmV0RmFpbG92ZXI6IGZhbHNlLFxuICAgICAgICBwYWNrZXRTaXplOiBERUZBVUxUX1BBQ0tFVF9TSVpFLFxuICAgICAgICBwb3J0OiBERUZBVUxUX1BPUlQsXG4gICAgICAgIHJlYWRPbmx5SW50ZW50OiBmYWxzZSxcbiAgICAgICAgcmVxdWVzdFRpbWVvdXQ6IERFRkFVTFRfQ0xJRU5UX1JFUVVFU1RfVElNRU9VVCxcbiAgICAgICAgcm93Q29sbGVjdGlvbk9uRG9uZTogZmFsc2UsXG4gICAgICAgIHJvd0NvbGxlY3Rpb25PblJlcXVlc3RDb21wbGV0aW9uOiBmYWxzZSxcbiAgICAgICAgc2VydmVyTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBzZXJ2ZXJTdXBwb3J0c0NvbHVtbkVuY3J5cHRpb246IGZhbHNlLFxuICAgICAgICB0ZHNWZXJzaW9uOiBERUZBVUxUX1REU19WRVJTSU9OLFxuICAgICAgICB0ZXh0c2l6ZTogREVGQVVMVF9URVhUU0laRSxcbiAgICAgICAgdHJ1c3RlZFNlcnZlck5hbWVBRTogdW5kZWZpbmVkLFxuICAgICAgICB0cnVzdFNlcnZlckNlcnRpZmljYXRlOiBmYWxzZSxcbiAgICAgICAgdXNlQ29sdW1uTmFtZXM6IGZhbHNlLFxuICAgICAgICB1c2VVVEM6IHRydWUsXG4gICAgICAgIHdvcmtzdGF0aW9uSWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgbG93ZXJDYXNlR3VpZHM6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChjb25maWcub3B0aW9ucykge1xuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnBvcnQgJiYgY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUG9ydCBhbmQgaW5zdGFuY2VOYW1lIGFyZSBtdXR1YWxseSBleGNsdXNpdmUsIGJ1dCAnICsgY29uZmlnLm9wdGlvbnMucG9ydCArICcgYW5kICcgKyBjb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWUgKyAnIHByb3ZpZGVkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5hYm9ydFRyYW5zYWN0aW9uT25FcnJvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuYWJvcnRUcmFuc2FjdGlvbk9uRXJyb3IgIT09ICdib29sZWFuJyAmJiBjb25maWcub3B0aW9ucy5hYm9ydFRyYW5zYWN0aW9uT25FcnJvciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmFib3J0VHJhbnNhY3Rpb25PbkVycm9yXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZyBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5hYm9ydFRyYW5zYWN0aW9uT25FcnJvciA9IGNvbmZpZy5vcHRpb25zLmFib3J0VHJhbnNhY3Rpb25PbkVycm9yO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuYXBwTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuYXBwTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5hcHBOYW1lXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuYXBwTmFtZSA9IGNvbmZpZy5vcHRpb25zLmFwcE5hbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5jYW1lbENhc2VDb2x1bW5zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5jYW1lbENhc2VDb2x1bW5zICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5jYW1lbENhc2VDb2x1bW5zXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmNhbWVsQ2FzZUNvbHVtbnMgPSBjb25maWcub3B0aW9ucy5jYW1lbENhc2VDb2x1bW5zO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuY2FuY2VsVGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuY2FuY2VsVGltZW91dCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5jYW5jZWxUaW1lb3V0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIG51bWJlci4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuY2FuY2VsVGltZW91dCA9IGNvbmZpZy5vcHRpb25zLmNhbmNlbFRpbWVvdXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5jb2x1bW5OYW1lUmVwbGFjZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5jb2x1bW5OYW1lUmVwbGFjZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5jYW5jZWxUaW1lb3V0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGZ1bmN0aW9uLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5jb2x1bW5OYW1lUmVwbGFjZXIgPSBjb25maWcub3B0aW9ucy5jb2x1bW5OYW1lUmVwbGFjZXI7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5jb25uZWN0aW9uSXNvbGF0aW9uTGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhc3NlcnRWYWxpZElzb2xhdGlvbkxldmVsKGNvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25Jc29sYXRpb25MZXZlbCwgJ2NvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25Jc29sYXRpb25MZXZlbCcpO1xuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvbklzb2xhdGlvbkxldmVsID0gY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvbklzb2xhdGlvbkxldmVsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuY29ubmVjdFRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmNvbm5lY3RUaW1lb3V0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmNvbm5lY3RUaW1lb3V0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIG51bWJlci4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdFRpbWVvdXQgPSBjb25maWcub3B0aW9ucy5jb25uZWN0VGltZW91dDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmNvbm5lY3RvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuY29ubmVjdG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuY29ubmVjdG9yXCIgcHJvcGVydHkgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5jb25uZWN0b3IgPSBjb25maWcub3B0aW9ucy5jb25uZWN0b3I7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5jcnlwdG9DcmVkZW50aWFsc0RldGFpbHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmNyeXB0b0NyZWRlbnRpYWxzRGV0YWlscyAhPT0gJ29iamVjdCcgfHwgY29uZmlnLm9wdGlvbnMuY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzID09PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIE9iamVjdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzID0gY29uZmlnLm9wdGlvbnMuY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZGF0YWJhc2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmRhdGFiYXNlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRhdGFiYXNlXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZGF0YWJhc2UgPSBjb25maWcub3B0aW9ucy5kYXRhYmFzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZGF0ZWZpcnN0ICE9PSAnbnVtYmVyJyAmJiBjb25maWcub3B0aW9ucy5kYXRlZmlyc3QgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5kYXRlZmlyc3RcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdCAhPT0gbnVsbCAmJiAoY29uZmlnLm9wdGlvbnMuZGF0ZWZpcnN0IDwgMSB8fCBjb25maWcub3B0aW9ucy5kYXRlZmlyc3QgPiA3KSkge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5kYXRlZmlyc3RcIiBwcm9wZXJ0eSBtdXN0IGJlID49IDEgYW5kIDw9IDcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZGF0ZWZpcnN0ID0gY29uZmlnLm9wdGlvbnMuZGF0ZWZpcnN0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZGF0ZUZvcm1hdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZGF0ZUZvcm1hdCAhPT0gJ3N0cmluZycgJiYgY29uZmlnLm9wdGlvbnMuZGF0ZUZvcm1hdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRhdGVGb3JtYXRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmRhdGVGb3JtYXQgPSBjb25maWcub3B0aW9ucy5kYXRlRm9ybWF0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZGVidWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmRlYnVnLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZGVidWcuZGF0YSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5kZWJ1Zy5kYXRhXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5kZWJ1Zy5kYXRhID0gY29uZmlnLm9wdGlvbnMuZGVidWcuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcub3B0aW9ucy5kZWJ1Zy5wYWNrZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZGVidWcucGFja2V0ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRlYnVnLnBhY2tldFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZGVidWcucGFja2V0ID0gY29uZmlnLm9wdGlvbnMuZGVidWcucGFja2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmRlYnVnLnBheWxvYWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZGVidWcucGF5bG9hZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5kZWJ1Zy5wYXlsb2FkXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5kZWJ1Zy5wYXlsb2FkID0gY29uZmlnLm9wdGlvbnMuZGVidWcucGF5bG9hZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcub3B0aW9ucy5kZWJ1Zy50b2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5kZWJ1Zy50b2tlbiAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5kZWJ1Zy50b2tlblwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZGVidWcudG9rZW4gPSBjb25maWcub3B0aW9ucy5kZWJ1Zy50b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGwgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5lbmFibGVBbnNpTnVsbFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmFibGVBbnNpTnVsbERlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdCAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdCA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lQYWRkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVBbnNpUGFkZGluZyAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lQYWRkaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVBhZGRpbmdcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBbnNpUGFkZGluZyA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lQYWRkaW5nO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVdhcm5pbmdzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVBbnNpV2FybmluZ3MgIT09ICdib29sZWFuJyAmJiBjb25maWcub3B0aW9ucy5lbmFibGVBbnNpV2FybmluZ3MgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5lbmFibGVBbnNpV2FybmluZ3NcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBbnNpV2FybmluZ3MgPSBjb25maWcub3B0aW9ucy5lbmFibGVBbnNpV2FybmluZ3M7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmFibGVBcml0aEFib3J0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVBcml0aEFib3J0ICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlQXJpdGhBYm9ydCAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmVuYWJsZUFyaXRoQWJvcnRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBcml0aEFib3J0ID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlQXJpdGhBYm9ydDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVDb25jYXROdWxsWWllbGRzTnVsbCAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZW5hYmxlQ29uY2F0TnVsbFlpZWxkc051bGxcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVDb25jYXROdWxsWWllbGRzTnVsbCA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdCAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZUN1cnNvckNsb3NlT25Db21taXQgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5lbmFibGVDdXJzb3JDbG9zZU9uQ29tbWl0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4gb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdCA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZUN1cnNvckNsb3NlT25Db21taXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZW5hYmxlSW1wbGljaXRUcmFuc2FjdGlvbnMgIT09ICdib29sZWFuJyAmJiBjb25maWcub3B0aW9ucy5lbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucyAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4gb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlSW1wbGljaXRUcmFuc2FjdGlvbnMgPSBjb25maWcub3B0aW9ucy5lbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmVuYWJsZU51bWVyaWNSb3VuZGFib3J0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVOdW1lcmljUm91bmRhYm9ydCAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZU51bWVyaWNSb3VuZGFib3J0ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVOdW1lcmljUm91bmRhYm9ydCA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZU51bWVyaWNSb3VuZGFib3J0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5hYmxlUXVvdGVkSWRlbnRpZmllciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZW5hYmxlUXVvdGVkSWRlbnRpZmllciAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZVF1b3RlZElkZW50aWZpZXIgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5lbmFibGVRdW90ZWRJZGVudGlmaWVyXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4gb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlUXVvdGVkSWRlbnRpZmllciA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZVF1b3RlZElkZW50aWZpZXI7XG4gICAgICB9XG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5jcnlwdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZW5jcnlwdCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmVuY3J5cHQgIT09ICdzdHJpY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJlbmNyeXB0XCIgcHJvcGVydHkgbXVzdCBiZSBzZXQgdG8gXCJzdHJpY3RcIiwgb3Igb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZW5jcnlwdCA9IGNvbmZpZy5vcHRpb25zLmVuY3J5cHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5mYWxsYmFja1RvRGVmYXVsdERiICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5mYWxsYmFja1RvRGVmYXVsdERiICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5mYWxsYmFja1RvRGVmYXVsdERiXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmZhbGxiYWNrVG9EZWZhdWx0RGIgPSBjb25maWcub3B0aW9ucy5mYWxsYmFja1RvRGVmYXVsdERiO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lID0gY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lO1xuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnBvcnQgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5pc29sYXRpb25MZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFzc2VydFZhbGlkSXNvbGF0aW9uTGV2ZWwoY29uZmlnLm9wdGlvbnMuaXNvbGF0aW9uTGV2ZWwsICdjb25maWcub3B0aW9ucy5pc29sYXRpb25MZXZlbCcpO1xuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuaXNvbGF0aW9uTGV2ZWwgPSBjb25maWcub3B0aW9ucy5pc29sYXRpb25MZXZlbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmxhbmd1YWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5sYW5ndWFnZSAhPT0gJ3N0cmluZycgJiYgY29uZmlnLm9wdGlvbnMubGFuZ3VhZ2UgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5sYW5ndWFnZVwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcgb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMubGFuZ3VhZ2UgPSBjb25maWcub3B0aW9ucy5sYW5ndWFnZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmxvY2FsQWRkcmVzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMubG9jYWxBZGRyZXNzICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmxvY2FsQWRkcmVzc1wiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmxvY2FsQWRkcmVzcyA9IGNvbmZpZy5vcHRpb25zLmxvY2FsQWRkcmVzcztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLm11bHRpU3VibmV0RmFpbG92ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLm11bHRpU3VibmV0RmFpbG92ZXIgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLm11bHRpU3VibmV0RmFpbG92ZXJcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMubXVsdGlTdWJuZXRGYWlsb3ZlciA9IGNvbmZpZy5vcHRpb25zLm11bHRpU3VibmV0RmFpbG92ZXI7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5wYWNrZXRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5wYWNrZXRTaXplICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnBhY2tldFNpemVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5wYWNrZXRTaXplID0gY29uZmlnLm9wdGlvbnMucGFja2V0U2l6ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnBvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnBvcnQgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMucG9ydFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMucG9ydCA8PSAwIHx8IGNvbmZpZy5vcHRpb25zLnBvcnQgPj0gNjU1MzYpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMucG9ydFwiIHByb3BlcnR5IG11c3QgYmUgPiAwIGFuZCA8IDY1NTM2Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnBvcnQgPSBjb25maWcub3B0aW9ucy5wb3J0O1xuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmluc3RhbmNlTmFtZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnJlYWRPbmx5SW50ZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5yZWFkT25seUludGVudCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMucmVhZE9ubHlJbnRlbnRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMucmVhZE9ubHlJbnRlbnQgPSBjb25maWcub3B0aW9ucy5yZWFkT25seUludGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnJlcXVlc3RUaW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5yZXF1ZXN0VGltZW91dCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5yZXF1ZXN0VGltZW91dFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnJlcXVlc3RUaW1lb3V0ID0gY29uZmlnLm9wdGlvbnMucmVxdWVzdFRpbWVvdXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5tYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLm1heFJldHJpZXNPblRyYW5zaWVudEVycm9ycyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5tYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnNcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLm1heFJldHJpZXNPblRyYW5zaWVudEVycm9ycyA8IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5tYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnNcIiBwcm9wZXJ0eSBtdXN0IGJlIGVxdWFsIG9yIGdyZWF0ZXIgdGhhbiAwLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5tYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnMgPSBjb25maWcub3B0aW9ucy5tYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5jb25uZWN0aW9uUmV0cnlJbnRlcnZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvblJldHJ5SW50ZXJ2YWwgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvblJldHJ5SW50ZXJ2YWxcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25SZXRyeUludGVydmFsIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5jb25uZWN0aW9uUmV0cnlJbnRlcnZhbFwiIHByb3BlcnR5IG11c3QgYmUgZ3JlYXRlciB0aGFuIDAuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25SZXRyeUludGVydmFsID0gY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvblJldHJ5SW50ZXJ2YWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25Eb25lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25Eb25lICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25Eb25lXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmUgPSBjb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25Eb25lO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMucm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PblJlcXVlc3RDb21wbGV0aW9uICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25SZXF1ZXN0Q29tcGxldGlvblwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25SZXF1ZXN0Q29tcGxldGlvbiA9IGNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PblJlcXVlc3RDb21wbGV0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy50ZHNWZXJzaW9uXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiA9IGNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb247XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy50ZXh0c2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMudGV4dHNpemUgIT09ICdudW1iZXInICYmIGNvbmZpZy5vcHRpb25zLnRleHRzaXplICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMudGV4dHNpemVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMudGV4dHNpemUgPiAyMTQ3NDgzNjQ3KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMudGV4dHNpemVcIiBjYW5cXCd0IGJlIGdyZWF0ZXIgdGhhbiAyMTQ3NDgzNjQ3LicpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5vcHRpb25zLnRleHRzaXplIDwgLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy50ZXh0c2l6ZVwiIGNhblxcJ3QgYmUgc21hbGxlciB0aGFuIC0xLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy50ZXh0c2l6ZSA9IGNvbmZpZy5vcHRpb25zLnRleHRzaXplIHwgMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnRydXN0U2VydmVyQ2VydGlmaWNhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnRydXN0U2VydmVyQ2VydGlmaWNhdGUgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnRydXN0U2VydmVyQ2VydGlmaWNhdGVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMudHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZSA9IGNvbmZpZy5vcHRpb25zLnRydXN0U2VydmVyQ2VydGlmaWNhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnNlcnZlck5hbWVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuc2VydmVyTmFtZSA9IGNvbmZpZy5vcHRpb25zLnNlcnZlck5hbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy51c2VDb2x1bW5OYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMudXNlQ29sdW1uTmFtZXMgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnVzZUNvbHVtbk5hbWVzXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnVzZUNvbHVtbk5hbWVzID0gY29uZmlnLm9wdGlvbnMudXNlQ29sdW1uTmFtZXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy51c2VVVEMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnVzZVVUQyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMudXNlVVRDXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnVzZVVUQyA9IGNvbmZpZy5vcHRpb25zLnVzZVVUQztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLndvcmtzdGF0aW9uSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLndvcmtzdGF0aW9uSWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMud29ya3N0YXRpb25JZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLndvcmtzdGF0aW9uSWQgPSBjb25maWcub3B0aW9ucy53b3Jrc3RhdGlvbklkO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMubG93ZXJDYXNlR3VpZHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmxvd2VyQ2FzZUd1aWRzICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5sb3dlckNhc2VHdWlkc1wiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5sb3dlckNhc2VHdWlkcyA9IGNvbmZpZy5vcHRpb25zLmxvd2VyQ2FzZUd1aWRzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2VjdXJlQ29udGV4dE9wdGlvbnMgPSB0aGlzLmNvbmZpZy5vcHRpb25zLmNyeXB0b0NyZWRlbnRpYWxzRGV0YWlscztcbiAgICBpZiAodGhpcy5zZWN1cmVDb250ZXh0T3B0aW9ucy5zZWN1cmVPcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIElmIHRoZSBjYWxsZXIgaGFzIG5vdCBzcGVjaWZpZWQgdGhlaXIgb3duIGBzZWN1cmVPcHRpb25zYCxcbiAgICAgIC8vIHdlIHNldCBgU1NMX09QX0RPTlRfSU5TRVJUX0VNUFRZX0ZSQUdNRU5UU2AgaGVyZS5cbiAgICAgIC8vIE9sZGVyIFNRTCBTZXJ2ZXIgaW5zdGFuY2VzIHJ1bm5pbmcgb24gb2xkZXIgV2luZG93cyB2ZXJzaW9ucyBoYXZlXG4gICAgICAvLyB0cm91YmxlIHdpdGggdGhlIEJFQVNUIHdvcmthcm91bmQgaW4gT3BlblNTTC5cbiAgICAgIC8vIEFzIEJFQVNUIGlzIGEgYnJvd3NlciBzcGVjaWZpYyBleHBsb2l0LCB3ZSBjYW4ganVzdCBkaXNhYmxlIHRoaXMgb3B0aW9uIGhlcmUuXG4gICAgICB0aGlzLnNlY3VyZUNvbnRleHRPcHRpb25zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnNlY3VyZUNvbnRleHRPcHRpb25zLCB7XG4gICAgICAgIHNlY3VyZU9wdGlvbnM6IHtcbiAgICAgICAgICB2YWx1ZTogY29uc3RhbnRzLlNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFNcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1ZyA9IHRoaXMuY3JlYXRlRGVidWcoKTtcbiAgICB0aGlzLmluVHJhbnNhY3Rpb24gPSBmYWxzZTtcbiAgICB0aGlzLnRyYW5zYWN0aW9uRGVzY3JpcHRvcnMgPSBbQnVmZmVyLmZyb20oWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdKV07XG5cbiAgICAvLyAnYmVnaW5UcmFuc2FjdGlvbicsICdjb21taXRUcmFuc2FjdGlvbicgYW5kICdyb2xsYmFja1RyYW5zYWN0aW9uJ1xuICAgIC8vIGV2ZW50cyBhcmUgdXRpbGl6ZWQgdG8gbWFpbnRhaW4gaW5UcmFuc2FjdGlvbiBwcm9wZXJ0eSBzdGF0ZSB3aGljaCBpblxuICAgIC8vIHR1cm4gaXMgdXNlZCBpbiBtYW5hZ2luZyB0cmFuc2FjdGlvbnMuIFRoZXNlIGV2ZW50cyBhcmUgb25seSBmaXJlZCBmb3JcbiAgICAvLyBURFMgdmVyc2lvbiA3LjIgYW5kIGJleW9uZC4gVGhlIHByb3BlcnRpZXMgYmVsb3cgYXJlIHVzZWQgdG8gZW11bGF0ZVxuICAgIC8vIGVxdWl2YWxlbnQgYmVoYXZpb3IgZm9yIFREUyB2ZXJzaW9ucyBiZWZvcmUgNy4yLlxuICAgIHRoaXMudHJhbnNhY3Rpb25EZXB0aCA9IDA7XG4gICAgdGhpcy5pc1NxbEJhdGNoID0gZmFsc2U7XG4gICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICB0aGlzLm1lc3NhZ2VCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMCk7XG5cbiAgICB0aGlzLmN1clRyYW5zaWVudFJldHJ5Q291bnQgPSAwO1xuICAgIHRoaXMudHJhbnNpZW50RXJyb3JMb29rdXAgPSBuZXcgVHJhbnNpZW50RXJyb3JMb29rdXAoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB0aGlzLlNUQVRFLklOSVRJQUxJWkVEO1xuXG4gICAgdGhpcy5fY2FuY2VsQWZ0ZXJSZXF1ZXN0U2VudCA9ICgpID0+IHtcbiAgICAgIHRoaXMubWVzc2FnZUlvLnNlbmRNZXNzYWdlKFRZUEUuQVRURU5USU9OKTtcbiAgICAgIHRoaXMuY3JlYXRlQ2FuY2VsVGltZXIoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fb25Tb2NrZXRDbG9zZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0Q2xvc2UoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fb25Tb2NrZXRFbmQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNvY2tldEVuZCgpO1xuICAgIH07XG5cbiAgICB0aGlzLl9vblNvY2tldEVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3NvY2tldEVycm9yJywgZXJyb3IpO1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnJvcikpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXG4gIGNvbm5lY3QoY29ubmVjdExpc3RlbmVyPzogKGVycj86IEVycm9yKSA9PiB2b2lkKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgIT09IHRoaXMuU1RBVEUuSU5JVElBTElaRUQpIHtcbiAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uRXJyb3IoJ2AuY29ubmVjdGAgY2FuIG5vdCBiZSBjYWxsZWQgb24gYSBDb25uZWN0aW9uIGluIGAnICsgdGhpcy5zdGF0ZS5uYW1lICsgJ2Agc3RhdGUuJyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbm5lY3RMaXN0ZW5lcikge1xuICAgICAgY29uc3Qgb25Db25uZWN0ID0gKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgIGNvbm5lY3RMaXN0ZW5lcihlcnIpO1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgb25FcnJvciA9IChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Nvbm5lY3QnLCBvbkNvbm5lY3QpO1xuICAgICAgICBjb25uZWN0TGlzdGVuZXIoZXJyKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMub25jZSgnY29ubmVjdCcsIG9uQ29ubmVjdCk7XG4gICAgICB0aGlzLm9uY2UoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgfVxuXG4gICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5DT05ORUNUSU5HKTtcbiAgICB0aGlzLmluaXRpYWxpc2VDb25uZWN0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdjb25uZWN0Jyk7XG4gICAgICB9KTtcbiAgICB9LCAoZXJyKSA9PiB7XG4gICAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLkZJTkFMKTtcbiAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnY29ubmVjdCcsIGVycik7XG4gICAgICB9KTtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2VuZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHNlcnZlciBoYXMgcmVwb3J0ZWQgdGhhdCB0aGUgY2hhcnNldCBoYXMgY2hhbmdlZC5cbiAgICovXG4gIG9uKGV2ZW50OiAnY2hhcnNldENoYW5nZScsIGxpc3RlbmVyOiAoY2hhcnNldDogc3RyaW5nKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBUaGUgYXR0ZW1wdCB0byBjb25uZWN0IGFuZCB2YWxpZGF0ZSBoYXMgY29tcGxldGVkLlxuICAgKi9cbiAgb24oXG4gICAgZXZlbnQ6ICdjb25uZWN0JyxcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZXJyIElmIHN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQsIHdpbGwgYmUgZmFsc2V5LiBJZiB0aGVyZSB3YXMgYVxuICAgICAqICAgcHJvYmxlbSAod2l0aCBlaXRoZXIgY29ubmVjdGluZyBvciB2YWxpZGF0aW9uKSwgd2lsbCBiZSBhbiBbW0Vycm9yXV0gb2JqZWN0LlxuICAgICAqL1xuICAgIGxpc3RlbmVyOiAoZXJyOiBFcnJvciB8IHVuZGVmaW5lZCkgPT4gdm9pZFxuICApOiB0aGlzXG5cbiAgLyoqXG4gICAqIFRoZSBzZXJ2ZXIgaGFzIHJlcG9ydGVkIHRoYXQgdGhlIGFjdGl2ZSBkYXRhYmFzZSBoYXMgY2hhbmdlZC5cbiAgICogVGhpcyBtYXkgYmUgYXMgYSByZXN1bHQgb2YgYSBzdWNjZXNzZnVsIGxvZ2luLCBvciBhIGB1c2VgIHN0YXRlbWVudC5cbiAgICovXG4gIG9uKGV2ZW50OiAnZGF0YWJhc2VDaGFuZ2UnLCBsaXN0ZW5lcjogKGRhdGFiYXNlTmFtZTogc3RyaW5nKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBBIGRlYnVnIG1lc3NhZ2UgaXMgYXZhaWxhYmxlLiBJdCBtYXkgYmUgbG9nZ2VkIG9yIGlnbm9yZWQuXG4gICAqL1xuICBvbihldmVudDogJ2RlYnVnJywgbGlzdGVuZXI6IChtZXNzYWdlVGV4dDogc3RyaW5nKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBlcnJvciBvY2N1cnMuXG4gICAqL1xuICBvbihldmVudDogJ2Vycm9yJywgbGlzdGVuZXI6IChlcnI6IEVycm9yKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBUaGUgc2VydmVyIGhhcyBpc3N1ZWQgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICovXG4gIG9uKGV2ZW50OiAnZXJyb3JNZXNzYWdlJywgbGlzdGVuZXI6IChtZXNzYWdlOiBpbXBvcnQoJy4vdG9rZW4vdG9rZW4nKS5FcnJvck1lc3NhZ2VUb2tlbikgPT4gdm9pZCk6IHRoaXNcblxuICAvKipcbiAgICogVGhlIGNvbm5lY3Rpb24gaGFzIGVuZGVkLlxuICAgKlxuICAgKiBUaGlzIG1heSBiZSBhcyBhIHJlc3VsdCBvZiB0aGUgY2xpZW50IGNhbGxpbmcgW1tjbG9zZV1dLCB0aGUgc2VydmVyXG4gICAqIGNsb3NpbmcgdGhlIGNvbm5lY3Rpb24sIG9yIGEgbmV0d29yayBlcnJvci5cbiAgICovXG4gIG9uKGV2ZW50OiAnZW5kJywgbGlzdGVuZXI6ICgpID0+IHZvaWQpOiB0aGlzXG5cbiAgLyoqXG4gICAqIFRoZSBzZXJ2ZXIgaGFzIGlzc3VlZCBhbiBpbmZvcm1hdGlvbiBtZXNzYWdlLlxuICAgKi9cbiAgb24oZXZlbnQ6ICdpbmZvTWVzc2FnZScsIGxpc3RlbmVyOiAobWVzc2FnZTogaW1wb3J0KCcuL3Rva2VuL3Rva2VuJykuSW5mb01lc3NhZ2VUb2tlbikgPT4gdm9pZCk6IHRoaXNcblxuICAvKipcbiAgICogVGhlIHNlcnZlciBoYXMgcmVwb3J0ZWQgdGhhdCB0aGUgbGFuZ3VhZ2UgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBvbihldmVudDogJ2xhbmd1YWdlQ2hhbmdlJywgbGlzdGVuZXI6IChsYW5ndWFnZU5hbWU6IHN0cmluZykgPT4gdm9pZCk6IHRoaXNcblxuICAvKipcbiAgICogVGhlIGNvbm5lY3Rpb24gd2FzIHJlc2V0LlxuICAgKi9cbiAgb24oZXZlbnQ6ICdyZXNldENvbm5lY3Rpb24nLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHRoaXNcblxuICAvKipcbiAgICogQSBzZWN1cmUgY29ubmVjdGlvbiBoYXMgYmVlbiBlc3RhYmxpc2hlZC5cbiAgICovXG4gIG9uKGV2ZW50OiAnc2VjdXJlJywgbGlzdGVuZXI6IChjbGVhcnRleHQ6IGltcG9ydCgndGxzJykuVExTU29ja2V0KSA9PiB2b2lkKTogdGhpc1xuXG4gIG9uKGV2ZW50OiBzdHJpbmcgfCBzeW1ib2wsIGxpc3RlbmVyOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQpIHtcbiAgICByZXR1cm4gc3VwZXIub24oZXZlbnQsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2NoYXJzZXRDaGFuZ2UnLCBjaGFyc2V0OiBzdHJpbmcpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2Nvbm5lY3QnLCBlcnJvcj86IEVycm9yKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdkYXRhYmFzZUNoYW5nZScsIGRhdGFiYXNlTmFtZTogc3RyaW5nKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdkZWJ1ZycsIG1lc3NhZ2VUZXh0OiBzdHJpbmcpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2Vycm9yJywgZXJyb3I6IEVycm9yKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdlcnJvck1lc3NhZ2UnLCBtZXNzYWdlOiBpbXBvcnQoJy4vdG9rZW4vdG9rZW4nKS5FcnJvck1lc3NhZ2VUb2tlbik6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnZW5kJyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnaW5mb01lc3NhZ2UnLCBtZXNzYWdlOiBpbXBvcnQoJy4vdG9rZW4vdG9rZW4nKS5JbmZvTWVzc2FnZVRva2VuKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdsYW5ndWFnZUNoYW5nZScsIGxhbmd1YWdlTmFtZTogc3RyaW5nKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdzZWN1cmUnLCBjbGVhcnRleHQ6IGltcG9ydCgndGxzJykuVExTU29ja2V0KTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdyZXJvdXRpbmcnKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdyZXNldENvbm5lY3Rpb24nKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdyZXRyeScpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ3JvbGxiYWNrVHJhbnNhY3Rpb24nKTogYm9vbGVhblxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZyB8IHN5bWJvbCwgLi4uYXJnczogYW55W10pIHtcbiAgICByZXR1cm4gc3VwZXIuZW1pdChldmVudCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBkYXRhYmFzZS5cbiAgICpcbiAgICogVGhlIFtbRXZlbnRfZW5kXV0gd2lsbCBiZSBlbWl0dGVkIG9uY2UgdGhlIGNvbm5lY3Rpb24gaGFzIGJlZW4gY2xvc2VkLlxuICAgKi9cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5GSU5BTCk7XG4gICAgdGhpcy5jbGVhbnVwQ29ubmVjdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhc3luYyBpbml0aWFsaXNlQ29ubmVjdGlvbigpIHtcbiAgICBjb25zdCB0aW1lb3V0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblxuICAgIGNvbnN0IGNvbm5lY3RUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgaG9zdFBvc3RmaXggPSB0aGlzLmNvbmZpZy5vcHRpb25zLnBvcnQgPyBgOiR7dGhpcy5jb25maWcub3B0aW9ucy5wb3J0fWAgOiBgXFxcXCR7dGhpcy5jb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWV9YDtcbiAgICAgIC8vIElmIHdlIGhhdmUgcm91dGluZyBkYXRhIHN0b3JlZCwgdGhpcyBjb25uZWN0aW9uIGhhcyBiZWVuIHJlZGlyZWN0ZWRcbiAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMucm91dGluZ0RhdGEgPyB0aGlzLnJvdXRpbmdEYXRhLnNlcnZlciA6IHRoaXMuY29uZmlnLnNlcnZlcjtcbiAgICAgIGNvbnN0IHBvcnQgPSB0aGlzLnJvdXRpbmdEYXRhID8gYDoke3RoaXMucm91dGluZ0RhdGEucG9ydH1gIDogaG9zdFBvc3RmaXg7XG4gICAgICAvLyBHcmFiIHRoZSB0YXJnZXQgaG9zdCBmcm9tIHRoZSBjb25uZWN0aW9uIGNvbmZpZ3VyYXRpb24sIGFuZCBmcm9tIGEgcmVkaXJlY3QgbWVzc2FnZVxuICAgICAgLy8gb3RoZXJ3aXNlLCBsZWF2ZSB0aGUgbWVzc2FnZSBlbXB0eS5cbiAgICAgIGNvbnN0IHJvdXRpbmdNZXNzYWdlID0gdGhpcy5yb3V0aW5nRGF0YSA/IGAgKHJlZGlyZWN0ZWQgZnJvbSAke3RoaXMuY29uZmlnLnNlcnZlcn0ke2hvc3RQb3N0Zml4fSlgIDogJyc7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYEZhaWxlZCB0byBjb25uZWN0IHRvICR7c2VydmVyfSR7cG9ydH0ke3JvdXRpbmdNZXNzYWdlfSBpbiAke3RoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdFRpbWVvdXR9bXNgO1xuICAgICAgdGhpcy5kZWJ1Zy5sb2cobWVzc2FnZSk7XG5cbiAgICAgIHRpbWVvdXRDb250cm9sbGVyLmFib3J0KG5ldyBDb25uZWN0aW9uRXJyb3IobWVzc2FnZSwgJ0VUSU1FT1VUJykpO1xuICAgIH0sIHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdFRpbWVvdXQpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCBzaWduYWwgPSB0aW1lb3V0Q29udHJvbGxlci5zaWduYWw7XG5cbiAgICAgIGxldCBwb3J0ID0gdGhpcy5jb25maWcub3B0aW9ucy5wb3J0O1xuXG4gICAgICBpZiAoIXBvcnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwb3J0ID0gYXdhaXQgaW5zdGFuY2VMb29rdXAoe1xuICAgICAgICAgICAgc2VydmVyOiB0aGlzLmNvbmZpZy5zZXJ2ZXIsXG4gICAgICAgICAgICBpbnN0YW5jZU5hbWU6IHRoaXMuY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lISxcbiAgICAgICAgICAgIHRpbWVvdXQ6IHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdFRpbWVvdXQsXG4gICAgICAgICAgICBzaWduYWw6IHNpZ25hbFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgICAgICAgdGhyb3cgbmV3IENvbm5lY3Rpb25FcnJvcihlcnIubWVzc2FnZSwgJ0VJTlNUTE9PS1VQJywgeyBjYXVzZTogZXJyIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBzb2NrZXQ7XG4gICAgICB0cnkge1xuICAgICAgICBzb2NrZXQgPSBhd2FpdCB0aGlzLmNvbm5lY3RPblBvcnQocG9ydCwgdGhpcy5jb25maWcub3B0aW9ucy5tdWx0aVN1Ym5ldEZhaWxvdmVyLCBzaWduYWwsIHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdG9yKTtcbiAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgICAgIHRocm93IHRoaXMud3JhcFNvY2tldEVycm9yKGVycik7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnRyb2xsZXIuYWJvcnQodGhpcy53cmFwU29ja2V0RXJyb3IoZXJyKSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kZWJ1Zy5sb2coJ2Nvbm5lY3Rpb24gdG8gJyArIHRoaXMuY29uZmlnLnNlcnZlciArICc6JyArIHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydCArICcgY2xvc2VkJyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVidWcubG9nKCdzb2NrZXQgZW5kZWQnKTtcblxuICAgICAgICAgIGNvbnN0IGVycm9yOiBFcnJvcldpdGhDb2RlID0gbmV3IEVycm9yKCdzb2NrZXQgaGFuZyB1cCcpO1xuICAgICAgICAgIGVycm9yLmNvZGUgPSAnRUNPTk5SRVNFVCc7XG4gICAgICAgICAgY29udHJvbGxlci5hYm9ydCh0aGlzLndyYXBTb2NrZXRFcnJvcihlcnJvcikpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNvY2tldC5vbmNlKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICBzb2NrZXQub25jZSgnY2xvc2UnLCBvbkNsb3NlKTtcbiAgICAgICAgc29ja2V0Lm9uY2UoJ2VuZCcsIG9uRW5kKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHNpZ25hbCA9IEFib3J0U2lnbmFsLmFueShbc2lnbmFsLCBjb250cm9sbGVyLnNpZ25hbF0pO1xuXG4gICAgICAgICAgc29ja2V0LnNldEtlZXBBbGl2ZSh0cnVlLCBLRUVQX0FMSVZFX0lOSVRJQUxfREVMQVkpO1xuXG4gICAgICAgICAgdGhpcy5tZXNzYWdlSW8gPSBuZXcgTWVzc2FnZUlPKHNvY2tldCwgdGhpcy5jb25maWcub3B0aW9ucy5wYWNrZXRTaXplLCB0aGlzLmRlYnVnKTtcbiAgICAgICAgICB0aGlzLm1lc3NhZ2VJby5vbignc2VjdXJlJywgKGNsZWFydGV4dCkgPT4geyB0aGlzLmVtaXQoJ3NlY3VyZScsIGNsZWFydGV4dCk7IH0pO1xuXG4gICAgICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG5cbiAgICAgICAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGVidWcubG9nKCdjb25uZWN0ZWQgdG8gJyArIHRoaXMuY29uZmlnLnNlcnZlciArICc6JyArIHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydCk7XG5cbiAgICAgICAgICB0aGlzLnNlbmRQcmVMb2dpbigpO1xuXG4gICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5TRU5UX1BSRUxPR0lOKTtcbiAgICAgICAgICBjb25zdCBwcmVsb2dpblJlc3BvbnNlID0gYXdhaXQgdGhpcy5yZWFkUHJlbG9naW5SZXNwb25zZShzaWduYWwpO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGVyZm9ybVRsc05lZ290aWF0aW9uKHByZWxvZ2luUmVzcG9uc2UsIHNpZ25hbCk7XG5cbiAgICAgICAgICB0aGlzLnNlbmRMb2dpbjdQYWNrZXQoKTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGF1dGhlbnRpY2F0aW9uIH0gPSB0aGlzLmNvbmZpZztcbiAgICAgICAgICAgIHN3aXRjaCAoYXV0aGVudGljYXRpb24udHlwZSkge1xuICAgICAgICAgICAgICBjYXNlICd0b2tlbi1jcmVkZW50aWFsJzpcbiAgICAgICAgICAgICAgY2FzZSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZCc6XG4gICAgICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtJzpcbiAgICAgICAgICAgICAgY2FzZSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktYXBwLXNlcnZpY2UnOlxuICAgICAgICAgICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXNlcnZpY2UtcHJpbmNpcGFsLXNlY3JldCc6XG4gICAgICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCc6XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5TRU5UX0xPR0lON19XSVRIX0ZFREFVVEgpO1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGluZ0RhdGEgPSBhd2FpdCB0aGlzLnBlcmZvcm1TZW50TG9naW43V2l0aEZlZEF1dGgoc2lnbmFsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnbnRsbSc6XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5TRU5UX0xPR0lON19XSVRIX05UTE0pO1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGluZ0RhdGEgPSBhd2FpdCB0aGlzLnBlcmZvcm1TZW50TG9naW43V2l0aE5UTE1Mb2dpbihzaWduYWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9MT0dJTjdfV0lUSF9TVEFOREFSRF9MT0dJTik7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0aW5nRGF0YSA9IGF3YWl0IHRoaXMucGVyZm9ybVNlbnRMb2dpbjdXaXRoU3RhbmRhcmRMb2dpbihzaWduYWwpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICBpZiAoaXNUcmFuc2llbnRFcnJvcihlcnIpKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGVidWcubG9nKCdJbml0aWF0aW5nIHJldHJ5IG9uIHRyYW5zaWVudCBlcnJvcicpO1xuICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLlRSQU5TSUVOVF9GQUlMVVJFX1JFVFJZKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGVyZm9ybVRyYW5zaWVudEZhaWx1cmVSZXRyeSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgcm91dGluZyBkYXRhIGlzIHByZXNlbnQsIHdlIG5lZWQgdG8gcmUtcm91dGUgdGhlIGNvbm5lY3Rpb25cbiAgICAgICAgICBpZiAodGhpcy5yb3V0aW5nRGF0YSkge1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5SRVJPVVRJTkcpO1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGVyZm9ybVJlUm91dGluZygpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuTE9HR0VEX0lOX1NFTkRJTkdfSU5JVElBTF9TUUwpO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGVyZm9ybUxvZ2dlZEluU2VuZGluZ0luaXRpYWxTcWwoc2lnbmFsKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uQ2xvc2UpO1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25FbmQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc29ja2V0LmRlc3Ryb3koKTtcblxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIHNvY2tldC5vbignZXJyb3InLCB0aGlzLl9vblNvY2tldEVycm9yKTtcbiAgICAgIHNvY2tldC5vbignY2xvc2UnLCB0aGlzLl9vblNvY2tldENsb3NlKTtcbiAgICAgIHNvY2tldC5vbignZW5kJywgdGhpcy5fb25Tb2NrZXRFbmQpO1xuXG4gICAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLkxPR0dFRF9JTik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGNsZWFyVGltZW91dChjb25uZWN0VGltZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2xlYW51cENvbm5lY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmNsb3NlZCkge1xuICAgICAgdGhpcy5jbGVhclJlcXVlc3RUaW1lcigpO1xuICAgICAgdGhpcy5jbG9zZUNvbm5lY3Rpb24oKTtcblxuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMucmVxdWVzdDtcbiAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBSZXF1ZXN0RXJyb3IoJ0Nvbm5lY3Rpb24gY2xvc2VkIGJlZm9yZSByZXF1ZXN0IGNvbXBsZXRlZC4nLCAnRUNMT1NFJyk7XG4gICAgICAgIHJlcXVlc3QuY2FsbGJhY2soZXJyKTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVEZWJ1ZygpIHtcbiAgICBjb25zdCBkZWJ1ZyA9IG5ldyBEZWJ1Zyh0aGlzLmNvbmZpZy5vcHRpb25zLmRlYnVnKTtcbiAgICBkZWJ1Zy5vbignZGVidWcnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdkZWJ1ZycsIG1lc3NhZ2UpO1xuICAgIH0pO1xuICAgIHJldHVybiBkZWJ1ZztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY3JlYXRlVG9rZW5TdHJlYW1QYXJzZXIobWVzc2FnZTogTWVzc2FnZSwgaGFuZGxlcjogVG9rZW5IYW5kbGVyKSB7XG4gICAgcmV0dXJuIG5ldyBUb2tlblN0cmVhbVBhcnNlcihtZXNzYWdlLCB0aGlzLmRlYnVnLCBoYW5kbGVyLCB0aGlzLmNvbmZpZy5vcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIHdyYXBXaXRoVGxzKHNvY2tldDogbmV0LlNvY2tldCwgc2lnbmFsOiBBYm9ydFNpZ25hbCk6IFByb21pc2U8dGxzLlRMU1NvY2tldD4ge1xuICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgY29uc3Qgc2VjdXJlQ29udGV4dCA9IHRscy5jcmVhdGVTZWN1cmVDb250ZXh0KHRoaXMuc2VjdXJlQ29udGV4dE9wdGlvbnMpO1xuICAgIC8vIElmIGNvbm5lY3QgdG8gYW4gaXAgYWRkcmVzcyBkaXJlY3RseSxcbiAgICAvLyBuZWVkIHRvIHNldCB0aGUgc2VydmVybmFtZSB0byBhbiBlbXB0eSBzdHJpbmdcbiAgICAvLyBpZiB0aGUgdXNlciBoYXMgbm90IGdpdmVuIGEgc2VydmVybmFtZSBleHBsaWNpdGx5XG4gICAgY29uc3Qgc2VydmVyTmFtZSA9ICFuZXQuaXNJUCh0aGlzLmNvbmZpZy5zZXJ2ZXIpID8gdGhpcy5jb25maWcuc2VydmVyIDogJyc7XG4gICAgY29uc3QgZW5jcnlwdE9wdGlvbnMgPSB7XG4gICAgICBob3N0OiB0aGlzLmNvbmZpZy5zZXJ2ZXIsXG4gICAgICBzb2NrZXQ6IHNvY2tldCxcbiAgICAgIEFMUE5Qcm90b2NvbHM6IFsndGRzLzguMCddLFxuICAgICAgc2VjdXJlQ29udGV4dDogc2VjdXJlQ29udGV4dCxcbiAgICAgIHNlcnZlcm5hbWU6IHRoaXMuY29uZmlnLm9wdGlvbnMuc2VydmVyTmFtZSA/IHRoaXMuY29uZmlnLm9wdGlvbnMuc2VydmVyTmFtZSA6IHNlcnZlck5hbWUsXG4gICAgfTtcblxuICAgIGNvbnN0IHsgcHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0IH0gPSB3aXRoUmVzb2x2ZXJzPHRscy5UTFNTb2NrZXQ+KCk7XG4gICAgY29uc3QgZW5jcnlwdHNvY2tldCA9IHRscy5jb25uZWN0KGVuY3J5cHRPcHRpb25zKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4geyByZWplY3Qoc2lnbmFsLnJlYXNvbik7IH07XG4gICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSByZWplY3Q7XG4gICAgICAgIGNvbnN0IG9uQ29ubmVjdCA9ICgpID0+IHsgcmVzb2x2ZShlbmNyeXB0c29ja2V0KTsgfTtcblxuICAgICAgICBlbmNyeXB0c29ja2V0Lm9uY2UoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgIGVuY3J5cHRzb2NrZXQub25jZSgnc2VjdXJlQ29ubmVjdCcsIG9uQ29ubmVjdCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBlbmNyeXB0c29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICAgIGVuY3J5cHRzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Nvbm5lY3QnLCBvbkNvbm5lY3QpO1xuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgZW5jcnlwdHNvY2tldC5kZXN0cm95KCk7XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBhc3luYyBjb25uZWN0T25Qb3J0KHBvcnQ6IG51bWJlciwgbXVsdGlTdWJuZXRGYWlsb3ZlcjogYm9vbGVhbiwgc2lnbmFsOiBBYm9ydFNpZ25hbCwgY3VzdG9tQ29ubmVjdG9yPzogKCkgPT4gUHJvbWlzZTxuZXQuU29ja2V0Pikge1xuICAgIGNvbnN0IGNvbm5lY3RPcHRzID0ge1xuICAgICAgaG9zdDogdGhpcy5yb3V0aW5nRGF0YSA/IHRoaXMucm91dGluZ0RhdGEuc2VydmVyIDogdGhpcy5jb25maWcuc2VydmVyLFxuICAgICAgcG9ydDogdGhpcy5yb3V0aW5nRGF0YSA/IHRoaXMucm91dGluZ0RhdGEucG9ydCA6IHBvcnQsXG4gICAgICBsb2NhbEFkZHJlc3M6IHRoaXMuY29uZmlnLm9wdGlvbnMubG9jYWxBZGRyZXNzXG4gICAgfTtcblxuICAgIGNvbnN0IGNvbm5lY3QgPSBjdXN0b21Db25uZWN0b3IgfHwgKG11bHRpU3VibmV0RmFpbG92ZXIgPyBjb25uZWN0SW5QYXJhbGxlbCA6IGNvbm5lY3RJblNlcXVlbmNlKTtcblxuICAgIGxldCBzb2NrZXQgPSBhd2FpdCBjb25uZWN0KGNvbm5lY3RPcHRzLCBkbnMubG9va3VwLCBzaWduYWwpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5jcnlwdCA9PT0gJ3N0cmljdCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFdyYXAgdGhlIHNvY2tldCB3aXRoIFRMUyBmb3IgVERTIDguMFxuICAgICAgICBzb2NrZXQgPSBhd2FpdCB0aGlzLndyYXBXaXRoVGxzKHNvY2tldCwgc2lnbmFsKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzb2NrZXQuZW5kKCk7XG5cbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb2NrZXQ7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNsb3NlQ29ubmVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgIHRoaXMuc29ja2V0LmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNyZWF0ZUNhbmNlbFRpbWVyKCkge1xuICAgIHRoaXMuY2xlYXJDYW5jZWxUaW1lcigpO1xuICAgIGNvbnN0IHRpbWVvdXQgPSB0aGlzLmNvbmZpZy5vcHRpb25zLmNhbmNlbFRpbWVvdXQ7XG4gICAgaWYgKHRpbWVvdXQgPiAwKSB7XG4gICAgICB0aGlzLmNhbmNlbFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FuY2VsVGltZW91dCgpO1xuICAgICAgfSwgdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVSZXF1ZXN0VGltZXIoKSB7XG4gICAgdGhpcy5jbGVhclJlcXVlc3RUaW1lcigpOyAvLyByZWxlYXNlIG9sZCB0aW1lciwganVzdCB0byBiZSBzYWZlXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMucmVxdWVzdCBhcyBSZXF1ZXN0O1xuICAgIGNvbnN0IHRpbWVvdXQgPSAocmVxdWVzdC50aW1lb3V0ICE9PSB1bmRlZmluZWQpID8gcmVxdWVzdC50aW1lb3V0IDogdGhpcy5jb25maWcub3B0aW9ucy5yZXF1ZXN0VGltZW91dDtcbiAgICBpZiAodGltZW91dCkge1xuICAgICAgdGhpcy5yZXF1ZXN0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0VGltZW91dCgpO1xuICAgICAgfSwgdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxUaW1lb3V0KCkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBgRmFpbGVkIHRvIGNhbmNlbCByZXF1ZXN0IGluICR7dGhpcy5jb25maWcub3B0aW9ucy5jYW5jZWxUaW1lb3V0fW1zYDtcbiAgICB0aGlzLmRlYnVnLmxvZyhtZXNzYWdlKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3NvY2tldEVycm9yJywgbmV3IENvbm5lY3Rpb25FcnJvcihtZXNzYWdlLCAnRVRJTUVPVVQnKSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlcXVlc3RUaW1lb3V0KCkge1xuICAgIHRoaXMucmVxdWVzdFRpbWVyID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLnJlcXVlc3QhO1xuICAgIHJlcXVlc3QuY2FuY2VsKCk7XG4gICAgY29uc3QgdGltZW91dCA9IChyZXF1ZXN0LnRpbWVvdXQgIT09IHVuZGVmaW5lZCkgPyByZXF1ZXN0LnRpbWVvdXQgOiB0aGlzLmNvbmZpZy5vcHRpb25zLnJlcXVlc3RUaW1lb3V0O1xuICAgIGNvbnN0IG1lc3NhZ2UgPSAnVGltZW91dDogUmVxdWVzdCBmYWlsZWQgdG8gY29tcGxldGUgaW4gJyArIHRpbWVvdXQgKyAnbXMnO1xuICAgIHJlcXVlc3QuZXJyb3IgPSBuZXcgUmVxdWVzdEVycm9yKG1lc3NhZ2UsICdFVElNRU9VVCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjbGVhckNhbmNlbFRpbWVyKCkge1xuICAgIGlmICh0aGlzLmNhbmNlbFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jYW5jZWxUaW1lcik7XG4gICAgICB0aGlzLmNhbmNlbFRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2xlYXJSZXF1ZXN0VGltZXIoKSB7XG4gICAgaWYgKHRoaXMucmVxdWVzdFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5yZXF1ZXN0VGltZXIpO1xuICAgICAgdGhpcy5yZXF1ZXN0VGltZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmFuc2l0aW9uVG8obmV3U3RhdGU6IFN0YXRlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IG5ld1N0YXRlKSB7XG4gICAgICB0aGlzLmRlYnVnLmxvZygnU3RhdGUgaXMgYWxyZWFkeSAnICsgbmV3U3RhdGUubmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS5leGl0KSB7XG4gICAgICB0aGlzLnN0YXRlLmV4aXQuY2FsbCh0aGlzLCBuZXdTdGF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ1N0YXRlIGNoYW5nZTogJyArICh0aGlzLnN0YXRlID8gdGhpcy5zdGF0ZS5uYW1lIDogJ3VuZGVmaW5lZCcpICsgJyAtPiAnICsgbmV3U3RhdGUubmFtZSk7XG4gICAgdGhpcy5zdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuZW50ZXIpIHtcbiAgICAgIHRoaXMuc3RhdGUuZW50ZXIuYXBwbHkodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRFdmVudEhhbmRsZXI8VCBleHRlbmRzIGtleW9mIFN0YXRlWydldmVudHMnXT4oZXZlbnROYW1lOiBUKTogTm9uTnVsbGFibGU8U3RhdGVbJ2V2ZW50cyddW1RdPiB7XG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuc3RhdGUuZXZlbnRzW2V2ZW50TmFtZV07XG5cbiAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZXZlbnQgJyR7ZXZlbnROYW1lfScgaW4gc3RhdGUgJyR7dGhpcy5zdGF0ZS5uYW1lfSdgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlciE7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRpc3BhdGNoRXZlbnQ8VCBleHRlbmRzIGtleW9mIFN0YXRlWydldmVudHMnXT4oZXZlbnROYW1lOiBULCAuLi5hcmdzOiBQYXJhbWV0ZXJzPE5vbk51bGxhYmxlPFN0YXRlWydldmVudHMnXVtUXT4+KSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuc3RhdGUuZXZlbnRzW2V2ZW50TmFtZV0gYXMgKCh0aGlzOiBDb25uZWN0aW9uLCAuLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoYE5vIGV2ZW50ICcke2V2ZW50TmFtZX0nIGluIHN0YXRlICcke3RoaXMuc3RhdGUubmFtZX0nYCkpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgd3JhcFNvY2tldEVycm9yKGVycm9yOiBFcnJvcik6IENvbm5lY3Rpb25FcnJvciB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IHRoaXMuU1RBVEUuQ09OTkVDVElORyB8fCB0aGlzLnN0YXRlID09PSB0aGlzLlNUQVRFLlNFTlRfVExTU1NMTkVHT1RJQVRJT04pIHtcbiAgICAgIGNvbnN0IGhvc3RQb3N0Zml4ID0gdGhpcy5jb25maWcub3B0aW9ucy5wb3J0ID8gYDoke3RoaXMuY29uZmlnLm9wdGlvbnMucG9ydH1gIDogYFxcXFwke3RoaXMuY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lfWA7XG4gICAgICAvLyBJZiB3ZSBoYXZlIHJvdXRpbmcgZGF0YSBzdG9yZWQsIHRoaXMgY29ubmVjdGlvbiBoYXMgYmVlbiByZWRpcmVjdGVkXG4gICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnJvdXRpbmdEYXRhID8gdGhpcy5yb3V0aW5nRGF0YS5zZXJ2ZXIgOiB0aGlzLmNvbmZpZy5zZXJ2ZXI7XG4gICAgICBjb25zdCBwb3J0ID0gdGhpcy5yb3V0aW5nRGF0YSA/IGA6JHt0aGlzLnJvdXRpbmdEYXRhLnBvcnR9YCA6IGhvc3RQb3N0Zml4O1xuICAgICAgLy8gR3JhYiB0aGUgdGFyZ2V0IGhvc3QgZnJvbSB0aGUgY29ubmVjdGlvbiBjb25maWd1cmF0aW9uLCBhbmQgZnJvbSBhIHJlZGlyZWN0IG1lc3NhZ2VcbiAgICAgIC8vIG90aGVyd2lzZSwgbGVhdmUgdGhlIG1lc3NhZ2UgZW1wdHkuXG4gICAgICBjb25zdCByb3V0aW5nTWVzc2FnZSA9IHRoaXMucm91dGluZ0RhdGEgPyBgIChyZWRpcmVjdGVkIGZyb20gJHt0aGlzLmNvbmZpZy5zZXJ2ZXJ9JHtob3N0UG9zdGZpeH0pYCA6ICcnO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGBGYWlsZWQgdG8gY29ubmVjdCB0byAke3NlcnZlcn0ke3BvcnR9JHtyb3V0aW5nTWVzc2FnZX0gLSAke2Vycm9yLm1lc3NhZ2V9YDtcblxuICAgICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uRXJyb3IobWVzc2FnZSwgJ0VTT0NLRVQnLCB7IGNhdXNlOiBlcnJvciB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGBDb25uZWN0aW9uIGxvc3QgLSAke2Vycm9yLm1lc3NhZ2V9YDtcbiAgICAgIHJldHVybiBuZXcgQ29ubmVjdGlvbkVycm9yKG1lc3NhZ2UsICdFU09DS0VUJywgeyBjYXVzZTogZXJyb3IgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXRFbmQoKSB7XG4gICAgdGhpcy5kZWJ1Zy5sb2coJ3NvY2tldCBlbmRlZCcpO1xuICAgIGlmICh0aGlzLnN0YXRlICE9PSB0aGlzLlNUQVRFLkZJTkFMKSB7XG4gICAgICBjb25zdCBlcnJvcjogRXJyb3JXaXRoQ29kZSA9IG5ldyBFcnJvcignc29ja2V0IGhhbmcgdXAnKTtcbiAgICAgIGVycm9yLmNvZGUgPSAnRUNPTk5SRVNFVCc7XG5cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnc29ja2V0RXJyb3InLCBlcnJvcik7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIHRoaXMud3JhcFNvY2tldEVycm9yKGVycm9yKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNvY2tldENsb3NlKCkge1xuICAgIHRoaXMuZGVidWcubG9nKCdjb25uZWN0aW9uIHRvICcgKyB0aGlzLmNvbmZpZy5zZXJ2ZXIgKyAnOicgKyB0aGlzLmNvbmZpZy5vcHRpb25zLnBvcnQgKyAnIGNsb3NlZCcpO1xuICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuRklOQUwpO1xuICAgIHRoaXMuY2xlYW51cENvbm5lY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VuZFByZUxvZ2luKCkge1xuICAgIGNvbnN0IFssIG1ham9yLCBtaW5vciwgYnVpbGRdID0gL14oXFxkKylcXC4oXFxkKylcXC4oXFxkKykvLmV4ZWModmVyc2lvbikgPz8gWycwLjAuMCcsICcwJywgJzAnLCAnMCddO1xuICAgIGNvbnN0IHBheWxvYWQgPSBuZXcgUHJlbG9naW5QYXlsb2FkKHtcbiAgICAgIC8vIElmIGVuY3J5cHQgc2V0dGluZyBpcyBzZXQgdG8gJ3N0cmljdCcsIHRoZW4gd2Ugc2hvdWxkIGhhdmUgYWxyZWFkeSBkb25lIHRoZSBlbmNyeXB0aW9uIGJlZm9yZSBjYWxsaW5nXG4gICAgICAvLyB0aGlzIGZ1bmN0aW9uLiBUaGVyZWZvcmUsIHRoZSBlbmNyeXB0IHdpbGwgYmUgc2V0IHRvIGZhbHNlIGhlcmUuXG4gICAgICAvLyBPdGhlcndpc2UsIHdlIHdpbGwgc2V0IGVuY3J5cHQgaGVyZSBiYXNlZCBvbiB0aGUgZW5jcnlwdCBCb29sZWFuIHZhbHVlIGZyb20gdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAgICBlbmNyeXB0OiB0eXBlb2YgdGhpcy5jb25maWcub3B0aW9ucy5lbmNyeXB0ID09PSAnYm9vbGVhbicgJiYgdGhpcy5jb25maWcub3B0aW9ucy5lbmNyeXB0LFxuICAgICAgdmVyc2lvbjogeyBtYWpvcjogTnVtYmVyKG1ham9yKSwgbWlub3I6IE51bWJlcihtaW5vciksIGJ1aWxkOiBOdW1iZXIoYnVpbGQpLCBzdWJidWlsZDogMCB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm1lc3NhZ2VJby5zZW5kTWVzc2FnZShUWVBFLlBSRUxPR0lOLCBwYXlsb2FkLmRhdGEpO1xuICAgIHRoaXMuZGVidWcucGF5bG9hZChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYXlsb2FkLnRvU3RyaW5nKCcgICcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZW5kTG9naW43UGFja2V0KCkge1xuICAgIGNvbnN0IHBheWxvYWQgPSBuZXcgTG9naW43UGF5bG9hZCh7XG4gICAgICB0ZHNWZXJzaW9uOiB2ZXJzaW9uc1t0aGlzLmNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb25dLFxuICAgICAgcGFja2V0U2l6ZTogdGhpcy5jb25maWcub3B0aW9ucy5wYWNrZXRTaXplLFxuICAgICAgY2xpZW50UHJvZ1ZlcjogMCxcbiAgICAgIGNsaWVudFBpZDogcHJvY2Vzcy5waWQsXG4gICAgICBjb25uZWN0aW9uSWQ6IDAsXG4gICAgICBjbGllbnRUaW1lWm9uZTogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxuICAgICAgY2xpZW50TGNpZDogMHgwMDAwMDQwOVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBhdXRoZW50aWNhdGlvbiB9ID0gdGhpcy5jb25maWc7XG4gICAgc3dpdGNoIChhdXRoZW50aWNhdGlvbi50eXBlKSB7XG4gICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXBhc3N3b3JkJzpcbiAgICAgICAgcGF5bG9hZC5mZWRBdXRoID0ge1xuICAgICAgICAgIHR5cGU6ICdBREFMJyxcbiAgICAgICAgICBlY2hvOiB0aGlzLmZlZEF1dGhSZXF1aXJlZCxcbiAgICAgICAgICB3b3JrZmxvdzogJ2RlZmF1bHQnXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWFjY2Vzcy10b2tlbic6XG4gICAgICAgIHBheWxvYWQuZmVkQXV0aCA9IHtcbiAgICAgICAgICB0eXBlOiAnU0VDVVJJVFlUT0tFTicsXG4gICAgICAgICAgZWNobzogdGhpcy5mZWRBdXRoUmVxdWlyZWQsXG4gICAgICAgICAgZmVkQXV0aFRva2VuOiBhdXRoZW50aWNhdGlvbi5vcHRpb25zLnRva2VuXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0b2tlbi1jcmVkZW50aWFsJzpcbiAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtJzpcbiAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCc6XG4gICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZSc6XG4gICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXNlcnZpY2UtcHJpbmNpcGFsLXNlY3JldCc6XG4gICAgICAgIHBheWxvYWQuZmVkQXV0aCA9IHtcbiAgICAgICAgICB0eXBlOiAnQURBTCcsXG4gICAgICAgICAgZWNobzogdGhpcy5mZWRBdXRoUmVxdWlyZWQsXG4gICAgICAgICAgd29ya2Zsb3c6ICdpbnRlZ3JhdGVkJ1xuICAgICAgICB9O1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbnRsbSc6XG4gICAgICAgIHBheWxvYWQuc3NwaSA9IGNyZWF0ZU5UTE1SZXF1ZXN0KHsgZG9tYWluOiBhdXRoZW50aWNhdGlvbi5vcHRpb25zLmRvbWFpbiB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHBheWxvYWQudXNlck5hbWUgPSBhdXRoZW50aWNhdGlvbi5vcHRpb25zLnVzZXJOYW1lO1xuICAgICAgICBwYXlsb2FkLnBhc3N3b3JkID0gYXV0aGVudGljYXRpb24ub3B0aW9ucy5wYXNzd29yZDtcbiAgICB9XG5cbiAgICBwYXlsb2FkLmhvc3RuYW1lID0gdGhpcy5jb25maWcub3B0aW9ucy53b3Jrc3RhdGlvbklkIHx8IG9zLmhvc3RuYW1lKCk7XG4gICAgcGF5bG9hZC5zZXJ2ZXJOYW1lID0gdGhpcy5yb3V0aW5nRGF0YSA/IHRoaXMucm91dGluZ0RhdGEubG9naW43c2VydmVyIDogdGhpcy5jb25maWcuc2VydmVyO1xuICAgIHBheWxvYWQuYXBwTmFtZSA9IHRoaXMuY29uZmlnLm9wdGlvbnMuYXBwTmFtZSB8fCAnVGVkaW91cyc7XG4gICAgcGF5bG9hZC5saWJyYXJ5TmFtZSA9IGxpYnJhcnlOYW1lO1xuICAgIHBheWxvYWQubGFuZ3VhZ2UgPSB0aGlzLmNvbmZpZy5vcHRpb25zLmxhbmd1YWdlO1xuICAgIHBheWxvYWQuZGF0YWJhc2UgPSB0aGlzLmNvbmZpZy5vcHRpb25zLmRhdGFiYXNlO1xuICAgIHBheWxvYWQuY2xpZW50SWQgPSBCdWZmZXIuZnJvbShbMSwgMiwgMywgNCwgNSwgNl0pO1xuXG4gICAgcGF5bG9hZC5yZWFkT25seUludGVudCA9IHRoaXMuY29uZmlnLm9wdGlvbnMucmVhZE9ubHlJbnRlbnQ7XG4gICAgcGF5bG9hZC5pbml0RGJGYXRhbCA9ICF0aGlzLmNvbmZpZy5vcHRpb25zLmZhbGxiYWNrVG9EZWZhdWx0RGI7XG5cbiAgICB0aGlzLnJvdXRpbmdEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubWVzc2FnZUlvLnNlbmRNZXNzYWdlKFRZUEUuTE9HSU43LCBwYXlsb2FkLnRvQnVmZmVyKCkpO1xuXG4gICAgdGhpcy5kZWJ1Zy5wYXlsb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBheWxvYWQudG9TdHJpbmcoJyAgJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbmRGZWRBdXRoVG9rZW5NZXNzYWdlKHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhY2Nlc3NUb2tlbkxlbiA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHRva2VuLCAndWNzMicpO1xuICAgIGNvbnN0IGRhdGEgPSBCdWZmZXIuYWxsb2MoOCArIGFjY2Vzc1Rva2VuTGVuKTtcbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBvZmZzZXQgPSBkYXRhLndyaXRlVUludDMyTEUoYWNjZXNzVG9rZW5MZW4gKyA0LCBvZmZzZXQpO1xuICAgIG9mZnNldCA9IGRhdGEud3JpdGVVSW50MzJMRShhY2Nlc3NUb2tlbkxlbiwgb2Zmc2V0KTtcbiAgICBkYXRhLndyaXRlKHRva2VuLCBvZmZzZXQsICd1Y3MyJyk7XG4gICAgdGhpcy5tZXNzYWdlSW8uc2VuZE1lc3NhZ2UoVFlQRS5GRURBVVRIX1RPS0VOLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VuZEluaXRpYWxTcWwoKSB7XG4gICAgY29uc3QgcGF5bG9hZCA9IG5ldyBTcWxCYXRjaFBheWxvYWQodGhpcy5nZXRJbml0aWFsU3FsKCksIHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpLCB0aGlzLmNvbmZpZy5vcHRpb25zKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSh7IHR5cGU6IFRZUEUuU1FMX0JBVENIIH0pO1xuICAgIHRoaXMubWVzc2FnZUlvLm91dGdvaW5nTWVzc2FnZVN0cmVhbS53cml0ZShtZXNzYWdlKTtcbiAgICBSZWFkYWJsZS5mcm9tKHBheWxvYWQpLnBpcGUobWVzc2FnZSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldEluaXRpYWxTcWwoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGwgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGFuc2lfbnVsbHMgb24nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGwgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBhbnNpX251bGxzIG9mZicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdCA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgYW5zaV9udWxsX2RmbHRfb24gb24nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGxEZWZhdWx0ID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgYW5zaV9udWxsX2RmbHRfb24gb2ZmJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVBhZGRpbmcgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGFuc2lfcGFkZGluZyBvbicpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBbnNpUGFkZGluZyA9PT0gZmFsc2UpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGFuc2lfcGFkZGluZyBvZmYnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBbnNpV2FybmluZ3MgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGFuc2lfd2FybmluZ3Mgb24nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVdhcm5pbmdzID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgYW5zaV93YXJuaW5ncyBvZmYnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBcml0aEFib3J0ID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBhcml0aGFib3J0IG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFyaXRoQWJvcnQgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBhcml0aGFib3J0IG9mZicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBjb25jYXRfbnVsbF95aWVsZHNfbnVsbCBvbicpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVDb25jYXROdWxsWWllbGRzTnVsbCA9PT0gZmFsc2UpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGNvbmNhdF9udWxsX3lpZWxkc19udWxsIG9mZicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUN1cnNvckNsb3NlT25Db21taXQgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGN1cnNvcl9jbG9zZV9vbl9jb21taXQgb24nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdCA9PT0gZmFsc2UpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGN1cnNvcl9jbG9zZV9vbl9jb21taXQgb2ZmJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZGF0ZWZpcnN0ICE9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLnB1c2goYHNldCBkYXRlZmlyc3QgJHt0aGlzLmNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdH1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5kYXRlRm9ybWF0ICE9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLnB1c2goYHNldCBkYXRlZm9ybWF0ICR7dGhpcy5jb25maWcub3B0aW9ucy5kYXRlRm9ybWF0fWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBpbXBsaWNpdF90cmFuc2FjdGlvbnMgb24nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlSW1wbGljaXRUcmFuc2FjdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBpbXBsaWNpdF90cmFuc2FjdGlvbnMgb2ZmJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMubGFuZ3VhZ2UgIT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMucHVzaChgc2V0IGxhbmd1YWdlICR7dGhpcy5jb25maWcub3B0aW9ucy5sYW5ndWFnZX1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVOdW1lcmljUm91bmRhYm9ydCA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgbnVtZXJpY19yb3VuZGFib3J0IG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZU51bWVyaWNSb3VuZGFib3J0ID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgbnVtZXJpY19yb3VuZGFib3J0IG9mZicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZVF1b3RlZElkZW50aWZpZXIgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IHF1b3RlZF9pZGVudGlmaWVyIG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZVF1b3RlZElkZW50aWZpZXIgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBxdW90ZWRfaWRlbnRpZmllciBvZmYnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy50ZXh0c2l6ZSAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5wdXNoKGBzZXQgdGV4dHNpemUgJHt0aGlzLmNvbmZpZy5vcHRpb25zLnRleHRzaXplfWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25Jc29sYXRpb25MZXZlbCAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5wdXNoKGBzZXQgdHJhbnNhY3Rpb24gaXNvbGF0aW9uIGxldmVsICR7dGhpcy5nZXRJc29sYXRpb25MZXZlbFRleHQodGhpcy5jb25maWcub3B0aW9ucy5jb25uZWN0aW9uSXNvbGF0aW9uTGV2ZWwpfWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmFib3J0VHJhbnNhY3Rpb25PbkVycm9yID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCB4YWN0X2Fib3J0IG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmFib3J0VHJhbnNhY3Rpb25PbkVycm9yID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgeGFjdF9hYm9ydCBvZmYnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucy5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHRoZSBTUUwgYmF0Y2ggcmVwcmVzZW50ZWQgYnkgW1tSZXF1ZXN0XV0uXG4gICAqIFRoZXJlIGlzIG5vIHBhcmFtIHN1cHBvcnQsIGFuZCB1bmxpa2UgW1tSZXF1ZXN0LmV4ZWNTcWxdXSxcbiAgICogaXQgaXMgbm90IGxpa2VseSB0aGF0IFNRTCBTZXJ2ZXIgd2lsbCByZXVzZSB0aGUgZXhlY3V0aW9uIHBsYW4gaXQgZ2VuZXJhdGVzIGZvciB0aGUgU1FMLlxuICAgKlxuICAgKiBJbiBhbG1vc3QgYWxsIGNhc2VzLCBbW1JlcXVlc3QuZXhlY1NxbF1dIHdpbGwgYmUgYSBiZXR0ZXIgY2hvaWNlLlxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdCBBIFtbUmVxdWVzdF1dIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHJlcXVlc3QuXG4gICAqL1xuICBleGVjU3FsQmF0Y2gocmVxdWVzdDogUmVxdWVzdCkge1xuICAgIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5TUUxfQkFUQ0gsIG5ldyBTcWxCYXRjaFBheWxvYWQocmVxdWVzdC5zcWxUZXh0T3JQcm9jZWR1cmUhLCB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSwgdGhpcy5jb25maWcub3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqICBFeGVjdXRlIHRoZSBTUUwgcmVwcmVzZW50ZWQgYnkgW1tSZXF1ZXN0XV0uXG4gICAqXG4gICAqIEFzIGBzcF9leGVjdXRlc3FsYCBpcyB1c2VkIHRvIGV4ZWN1dGUgdGhlIFNRTCwgaWYgdGhlIHNhbWUgU1FMIGlzIGV4ZWN1dGVkIG11bHRpcGxlcyB0aW1lc1xuICAgKiB1c2luZyB0aGlzIGZ1bmN0aW9uLCB0aGUgU1FMIFNlcnZlciBxdWVyeSBvcHRpbWl6ZXIgaXMgbGlrZWx5IHRvIHJldXNlIHRoZSBleGVjdXRpb24gcGxhbiBpdCBnZW5lcmF0ZXNcbiAgICogZm9yIHRoZSBmaXJzdCBleGVjdXRpb24uIFRoaXMgbWF5IGFsc28gcmVzdWx0IGluIFNRTCBzZXJ2ZXIgdHJlYXRpbmcgdGhlIHJlcXVlc3QgbGlrZSBhIHN0b3JlZCBwcm9jZWR1cmVcbiAgICogd2hpY2ggY2FuIHJlc3VsdCBpbiB0aGUgW1tFdmVudF9kb25lSW5Qcm9jXV0gb3IgW1tFdmVudF9kb25lUHJvY11dIGV2ZW50cyBiZWluZyBlbWl0dGVkIGluc3RlYWQgb2YgdGhlXG4gICAqIFtbRXZlbnRfZG9uZV1dIGV2ZW50IHlvdSBtaWdodCBleHBlY3QuIFVzaW5nIFtbZXhlY1NxbEJhdGNoXV0gd2lsbCBwcmV2ZW50IHRoaXMgZnJvbSBvY2N1cnJpbmcgYnV0IG1heSBoYXZlIGEgbmVnYXRpdmUgcGVyZm9ybWFuY2UgaW1wYWN0LlxuICAgKlxuICAgKiBCZXdhcmUgb2YgdGhlIHdheSB0aGF0IHNjb3BpbmcgcnVsZXMgYXBwbHksIGFuZCBob3cgdGhleSBtYXkgW2FmZmVjdCBsb2NhbCB0ZW1wIHRhYmxlc10oaHR0cDovL3dlYmxvZ3Muc3FsdGVhbS5jb20vbWxhZGVucC9hcmNoaXZlLzIwMDYvMTEvMDMvMTcxOTcuYXNweClcbiAgICogSWYgeW91J3JlIHJ1bm5pbmcgaW4gdG8gc2NvcGluZyBpc3N1ZXMsIHRoZW4gW1tleGVjU3FsQmF0Y2hdXSBtYXkgYmUgYSBiZXR0ZXIgY2hvaWNlLlxuICAgKiBTZWUgYWxzbyBbaXNzdWUgIzI0XShodHRwczovL2dpdGh1Yi5jb20vcGVraW0vdGVkaW91cy9pc3N1ZXMvMjQpXG4gICAqXG4gICAqIEBwYXJhbSByZXF1ZXN0IEEgW1tSZXF1ZXN0XV0gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGV4ZWNTcWwocmVxdWVzdDogUmVxdWVzdCkge1xuICAgIHRyeSB7XG4gICAgICByZXF1ZXN0LnZhbGlkYXRlUGFyYW1ldGVycyh0aGlzLmRhdGFiYXNlQ29sbGF0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICByZXF1ZXN0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmRlYnVnLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgcmVxdWVzdC5jYWxsYmFjayhlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmFtZXRlcnM6IFBhcmFtZXRlcltdID0gW107XG5cbiAgICBwYXJhbWV0ZXJzLnB1c2goe1xuICAgICAgdHlwZTogVFlQRVMuTlZhckNoYXIsXG4gICAgICBuYW1lOiAnc3RhdGVtZW50JyxcbiAgICAgIHZhbHVlOiByZXF1ZXN0LnNxbFRleHRPclByb2NlZHVyZSxcbiAgICAgIG91dHB1dDogZmFsc2UsXG4gICAgICBsZW5ndGg6IHVuZGVmaW5lZCxcbiAgICAgIHByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgc2NhbGU6IHVuZGVmaW5lZFxuICAgIH0pO1xuXG4gICAgaWYgKHJlcXVlc3QucGFyYW1ldGVycy5sZW5ndGgpIHtcbiAgICAgIHBhcmFtZXRlcnMucHVzaCh7XG4gICAgICAgIHR5cGU6IFRZUEVTLk5WYXJDaGFyLFxuICAgICAgICBuYW1lOiAncGFyYW1zJyxcbiAgICAgICAgdmFsdWU6IHJlcXVlc3QubWFrZVBhcmFtc1BhcmFtZXRlcihyZXF1ZXN0LnBhcmFtZXRlcnMpLFxuICAgICAgICBvdXRwdXQ6IGZhbHNlLFxuICAgICAgICBsZW5ndGg6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHNjYWxlOiB1bmRlZmluZWRcbiAgICAgIH0pO1xuXG4gICAgICBwYXJhbWV0ZXJzLnB1c2goLi4ucmVxdWVzdC5wYXJhbWV0ZXJzKTtcbiAgICB9XG5cbiAgICB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuUlBDX1JFUVVFU1QsIG5ldyBScGNSZXF1ZXN0UGF5bG9hZChQcm9jZWR1cmVzLlNwX0V4ZWN1dGVTcWwsIHBhcmFtZXRlcnMsIHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpLCB0aGlzLmNvbmZpZy5vcHRpb25zLCB0aGlzLmRhdGFiYXNlQ29sbGF0aW9uKSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBCdWxrTG9hZCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHRhYmxlIFRoZSBuYW1lIG9mIHRoZSB0YWJsZSB0byBidWxrLWluc2VydCBpbnRvLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBBIHNldCBvZiBidWxrIGxvYWQgb3B0aW9ucy5cbiAgICovXG4gIG5ld0J1bGtMb2FkKHRhYmxlOiBzdHJpbmcsIGNhbGxiYWNrOiBCdWxrTG9hZENhbGxiYWNrKTogQnVsa0xvYWRcbiAgbmV3QnVsa0xvYWQodGFibGU6IHN0cmluZywgb3B0aW9uczogQnVsa0xvYWRPcHRpb25zLCBjYWxsYmFjazogQnVsa0xvYWRDYWxsYmFjayk6IEJ1bGtMb2FkXG4gIG5ld0J1bGtMb2FkKHRhYmxlOiBzdHJpbmcsIGNhbGxiYWNrT3JPcHRpb25zOiBCdWxrTG9hZE9wdGlvbnMgfCBCdWxrTG9hZENhbGxiYWNrLCBjYWxsYmFjaz86IEJ1bGtMb2FkQ2FsbGJhY2spIHtcbiAgICBsZXQgb3B0aW9uczogQnVsa0xvYWRPcHRpb25zO1xuXG4gICAgaWYgKGNhbGxiYWNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2tPck9wdGlvbnMgYXMgQnVsa0xvYWRDYWxsYmFjaztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucyA9IGNhbGxiYWNrT3JPcHRpb25zIGFzIEJ1bGtMb2FkT3B0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcIm9wdGlvbnNcIiBhcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEJ1bGtMb2FkKHRhYmxlLCB0aGlzLmRhdGFiYXNlQ29sbGF0aW9uLCB0aGlzLmNvbmZpZy5vcHRpb25zLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIFtbQnVsa0xvYWRdXS5cbiAgICpcbiAgICogYGBganNcbiAgICogLy8gV2Ugd2FudCB0byBwZXJmb3JtIGEgYnVsayBsb2FkIGludG8gYSB0YWJsZSB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICAgKiAvLyBDUkVBVEUgVEFCTEUgZW1wbG95ZWVzIChmaXJzdF9uYW1lIG52YXJjaGFyKDI1NSksIGxhc3RfbmFtZSBudmFyY2hhcigyNTUpLCBkYXlfb2ZfYmlydGggZGF0ZSk7XG4gICAqXG4gICAqIGNvbnN0IGJ1bGtMb2FkID0gY29ubmVjdGlvbi5uZXdCdWxrTG9hZCgnZW1wbG95ZWVzJywgKGVyciwgcm93Q291bnQpID0+IHtcbiAgICogICAvLyAuLi5cbiAgICogfSk7XG4gICAqXG4gICAqIC8vIEZpcnN0LCB3ZSBuZWVkIHRvIHNwZWNpZnkgdGhlIGNvbHVtbnMgdGhhdCB3ZSB3YW50IHRvIHdyaXRlIHRvLFxuICAgKiAvLyBhbmQgdGhlaXIgZGVmaW5pdGlvbnMuIFRoZXNlIGRlZmluaXRpb25zIG11c3QgbWF0Y2ggdGhlIGFjdHVhbCB0YWJsZSxcbiAgICogLy8gb3RoZXJ3aXNlIHRoZSBidWxrIGxvYWQgd2lsbCBmYWlsLlxuICAgKiBidWxrTG9hZC5hZGRDb2x1bW4oJ2ZpcnN0X25hbWUnLCBUWVBFUy5OVmFyY2hhciwgeyBudWxsYWJsZTogZmFsc2UgfSk7XG4gICAqIGJ1bGtMb2FkLmFkZENvbHVtbignbGFzdF9uYW1lJywgVFlQRVMuTlZhcmNoYXIsIHsgbnVsbGFibGU6IGZhbHNlIH0pO1xuICAgKiBidWxrTG9hZC5hZGRDb2x1bW4oJ2RhdGVfb2ZfYmlydGgnLCBUWVBFUy5EYXRlLCB7IG51bGxhYmxlOiBmYWxzZSB9KTtcbiAgICpcbiAgICogLy8gRXhlY3V0ZSBhIGJ1bGsgbG9hZCB3aXRoIGEgcHJlZGVmaW5lZCBsaXN0IG9mIHJvd3MuXG4gICAqIC8vXG4gICAqIC8vIE5vdGUgdGhhdCB0aGVzZSByb3dzIGFyZSBoZWxkIGluIG1lbW9yeSB1bnRpbCB0aGVcbiAgICogLy8gYnVsayBsb2FkIHdhcyBwZXJmb3JtZWQsIHNvIGlmIHlvdSBuZWVkIHRvIHdyaXRlIGEgbGFyZ2VcbiAgICogLy8gbnVtYmVyIG9mIHJvd3MgKGUuZy4gYnkgcmVhZGluZyBmcm9tIGEgQ1NWIGZpbGUpLFxuICAgKiAvLyBwYXNzaW5nIGFuIGBBc3luY0l0ZXJhYmxlYCBpcyBhZHZpc2FibGUgdG8ga2VlcCBtZW1vcnkgdXNhZ2UgbG93LlxuICAgKiBjb25uZWN0aW9uLmV4ZWNCdWxrTG9hZChidWxrTG9hZCwgW1xuICAgKiAgIHsgJ2ZpcnN0X25hbWUnOiAnU3RldmUnLCAnbGFzdF9uYW1lJzogJ0pvYnMnLCAnZGF5X29mX2JpcnRoJzogbmV3IERhdGUoJzAyLTI0LTE5NTUnKSB9LFxuICAgKiAgIHsgJ2ZpcnN0X25hbWUnOiAnQmlsbCcsICdsYXN0X25hbWUnOiAnR2F0ZXMnLCAnZGF5X29mX2JpcnRoJzogbmV3IERhdGUoJzEwLTI4LTE5NTUnKSB9XG4gICAqIF0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGJ1bGtMb2FkIEEgcHJldmlvdXNseSBjcmVhdGVkIFtbQnVsa0xvYWRdXS5cbiAgICogQHBhcmFtIHJvd3MgQSBbW0l0ZXJhYmxlXV0gb3IgW1tBc3luY0l0ZXJhYmxlXV0gdGhhdCBjb250YWlucyB0aGUgcm93cyB0aGF0IHNob3VsZCBiZSBidWxrIGxvYWRlZC5cbiAgICovXG4gIGV4ZWNCdWxrTG9hZChidWxrTG9hZDogQnVsa0xvYWQsIHJvd3M6IEFzeW5jSXRlcmFibGU8dW5rbm93bltdIHwgeyBbY29sdW1uTmFtZTogc3RyaW5nXTogdW5rbm93biB9PiB8IEl0ZXJhYmxlPHVua25vd25bXSB8IHsgW2NvbHVtbk5hbWU6IHN0cmluZ106IHVua25vd24gfT4pOiB2b2lkXG5cbiAgZXhlY0J1bGtMb2FkKGJ1bGtMb2FkOiBCdWxrTG9hZCwgcm93cz86IEFzeW5jSXRlcmFibGU8dW5rbm93bltdIHwgeyBbY29sdW1uTmFtZTogc3RyaW5nXTogdW5rbm93biB9PiB8IEl0ZXJhYmxlPHVua25vd25bXSB8IHsgW2NvbHVtbk5hbWU6IHN0cmluZ106IHVua25vd24gfT4pIHtcbiAgICBidWxrTG9hZC5leGVjdXRpb25TdGFydGVkID0gdHJ1ZTtcblxuICAgIGlmIChyb3dzKSB7XG4gICAgICBpZiAoYnVsa0xvYWQuc3RyZWFtaW5nTW9kZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb25uZWN0aW9uLmV4ZWNCdWxrTG9hZCBjYW4ndCBiZSBjYWxsZWQgd2l0aCBhIEJ1bGtMb2FkIHRoYXQgd2FzIHB1dCBpbiBzdHJlYW1pbmcgbW9kZS5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChidWxrTG9hZC5maXJzdFJvd1dyaXR0ZW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29ubmVjdGlvbi5leGVjQnVsa0xvYWQgY2FuJ3QgYmUgY2FsbGVkIHdpdGggYSBCdWxrTG9hZCB0aGF0IGFscmVhZHkgaGFzIHJvd3Mgd3JpdHRlbiB0byBpdC5cIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvd1N0cmVhbSA9IFJlYWRhYmxlLmZyb20ocm93cyk7XG5cbiAgICAgIC8vIERlc3Ryb3kgdGhlIHBhY2tldCB0cmFuc2Zvcm0gaWYgYW4gZXJyb3IgaGFwcGVucyBpbiB0aGUgcm93IHN0cmVhbSxcbiAgICAgIC8vIGUuZy4gaWYgYW4gZXJyb3IgaXMgdGhyb3duIGZyb20gd2l0aGluIGEgZ2VuZXJhdG9yIG9yIHN0cmVhbS5cbiAgICAgIHJvd1N0cmVhbS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgIGJ1bGtMb2FkLnJvd1RvUGFja2V0VHJhbnNmb3JtLmRlc3Ryb3koZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBEZXN0cm95IHRoZSByb3cgc3RyZWFtIGlmIGFuIGVycm9yIGhhcHBlbnMgaW4gdGhlIHBhY2tldCB0cmFuc2Zvcm0sXG4gICAgICAvLyBlLmcuIGlmIHRoZSBidWxrIGxvYWQgaXMgY2FuY2VsbGVkLlxuICAgICAgYnVsa0xvYWQucm93VG9QYWNrZXRUcmFuc2Zvcm0ub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICByb3dTdHJlYW0uZGVzdHJveShlcnIpO1xuICAgICAgfSk7XG5cbiAgICAgIHJvd1N0cmVhbS5waXBlKGJ1bGtMb2FkLnJvd1RvUGFja2V0VHJhbnNmb3JtKTtcbiAgICB9IGVsc2UgaWYgKCFidWxrTG9hZC5zdHJlYW1pbmdNb2RlKSB7XG4gICAgICAvLyBJZiB0aGUgYnVsa2xvYWQgd2FzIG5vdCBwdXQgaW50byBzdHJlYW1pbmcgbW9kZSBieSB0aGUgdXNlcixcbiAgICAgIC8vIHdlIGVuZCB0aGUgcm93VG9QYWNrZXRUcmFuc2Zvcm0gaGVyZSBmb3IgdGhlbS5cbiAgICAgIC8vXG4gICAgICAvLyBJZiBpdCB3YXMgcHV0IGludG8gc3RyZWFtaW5nIG1vZGUsIGl0J3MgdGhlIHVzZXIncyByZXNwb25zaWJpbGl0eVxuICAgICAgLy8gdG8gZW5kIHRoZSBzdHJlYW0uXG4gICAgICBidWxrTG9hZC5yb3dUb1BhY2tldFRyYW5zZm9ybS5lbmQoKTtcbiAgICB9XG5cbiAgICBjb25zdCBvbkNhbmNlbCA9ICgpID0+IHtcbiAgICAgIHJlcXVlc3QuY2FuY2VsKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBheWxvYWQgPSBuZXcgQnVsa0xvYWRQYXlsb2FkKGJ1bGtMb2FkKTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChidWxrTG9hZC5nZXRCdWxrSW5zZXJ0U3FsKCksIChlcnJvcjogKEVycm9yICYgeyBjb2RlPzogc3RyaW5nIH0pIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4ge1xuICAgICAgYnVsa0xvYWQucmVtb3ZlTGlzdGVuZXIoJ2NhbmNlbCcsIG9uQ2FuY2VsKTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvci5jb2RlID09PSAnVU5LTk9XTicpIHtcbiAgICAgICAgICBlcnJvci5tZXNzYWdlICs9ICcgVGhpcyBpcyBsaWtlbHkgYmVjYXVzZSB0aGUgc2NoZW1hIG9mIHRoZSBCdWxrTG9hZCBkb2VzIG5vdCBtYXRjaCB0aGUgc2NoZW1hIG9mIHRoZSB0YWJsZSB5b3UgYXJlIGF0dGVtcHRpbmcgdG8gaW5zZXJ0IGludG8uJztcbiAgICAgICAgfVxuICAgICAgICBidWxrTG9hZC5lcnJvciA9IGVycm9yO1xuICAgICAgICBidWxrTG9hZC5jYWxsYmFjayhlcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tYWtlUmVxdWVzdChidWxrTG9hZCwgVFlQRS5CVUxLX0xPQUQsIHBheWxvYWQpO1xuICAgIH0pO1xuXG4gICAgYnVsa0xvYWQub25jZSgnY2FuY2VsJywgb25DYW5jZWwpO1xuXG4gICAgdGhpcy5leGVjU3FsQmF0Y2gocmVxdWVzdCk7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZSB0aGUgU1FMIHJlcHJlc2VudGVkIGJ5IHRoZSByZXF1ZXN0LlxuICAgKlxuICAgKiBUaGUgcmVxdWVzdCBjYW4gdGhlbiBiZSB1c2VkIGluIHN1YnNlcXVlbnQgY2FsbHMgdG9cbiAgICogW1tleGVjdXRlXV0gYW5kIFtbdW5wcmVwYXJlXV1cbiAgICpcbiAgICogQHBhcmFtIHJlcXVlc3QgQSBbW1JlcXVlc3RdXSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSByZXF1ZXN0LlxuICAgKiAgIFBhcmFtZXRlcnMgb25seSByZXF1aXJlIGEgbmFtZSBhbmQgdHlwZS4gUGFyYW1ldGVyIHZhbHVlcyBhcmUgaWdub3JlZC5cbiAgICovXG4gIHByZXBhcmUocmVxdWVzdDogUmVxdWVzdCkge1xuICAgIGNvbnN0IHBhcmFtZXRlcnM6IFBhcmFtZXRlcltdID0gW107XG5cbiAgICBwYXJhbWV0ZXJzLnB1c2goe1xuICAgICAgdHlwZTogVFlQRVMuSW50LFxuICAgICAgbmFtZTogJ2hhbmRsZScsXG4gICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgb3V0cHV0OiB0cnVlLFxuICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICBwcmVjaXNpb246IHVuZGVmaW5lZCxcbiAgICAgIHNjYWxlOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIHBhcmFtZXRlcnMucHVzaCh7XG4gICAgICB0eXBlOiBUWVBFUy5OVmFyQ2hhcixcbiAgICAgIG5hbWU6ICdwYXJhbXMnLFxuICAgICAgdmFsdWU6IHJlcXVlc3QucGFyYW1ldGVycy5sZW5ndGggPyByZXF1ZXN0Lm1ha2VQYXJhbXNQYXJhbWV0ZXIocmVxdWVzdC5wYXJhbWV0ZXJzKSA6IG51bGwsXG4gICAgICBvdXRwdXQ6IGZhbHNlLFxuICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICBwcmVjaXNpb246IHVuZGVmaW5lZCxcbiAgICAgIHNjYWxlOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIHBhcmFtZXRlcnMucHVzaCh7XG4gICAgICB0eXBlOiBUWVBFUy5OVmFyQ2hhcixcbiAgICAgIG5hbWU6ICdzdG10JyxcbiAgICAgIHZhbHVlOiByZXF1ZXN0LnNxbFRleHRPclByb2NlZHVyZSxcbiAgICAgIG91dHB1dDogZmFsc2UsXG4gICAgICBsZW5ndGg6IHVuZGVmaW5lZCxcbiAgICAgIHByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgc2NhbGU6IHVuZGVmaW5lZFxuICAgIH0pO1xuXG4gICAgcmVxdWVzdC5wcmVwYXJpbmcgPSB0cnVlO1xuXG4gICAgLy8gVE9ETzogV2UgbmVlZCB0byBjbGVhbiB1cCB0aGlzIGV2ZW50IGhhbmRsZXIsIG90aGVyd2lzZSB0aGlzIGxlYWtzIG1lbW9yeVxuICAgIHJlcXVlc3Qub24oJ3JldHVyblZhbHVlJywgKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xuICAgICAgaWYgKG5hbWUgPT09ICdoYW5kbGUnKSB7XG4gICAgICAgIHJlcXVlc3QuaGFuZGxlID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0LmVycm9yID0gbmV3IFJlcXVlc3RFcnJvcihgVGVkaW91cyA+IFVuZXhwZWN0ZWQgb3V0cHV0IHBhcmFtZXRlciAke25hbWV9IGZyb20gc3BfcHJlcGFyZWApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5tYWtlUmVxdWVzdChyZXF1ZXN0LCBUWVBFLlJQQ19SRVFVRVNULCBuZXcgUnBjUmVxdWVzdFBheWxvYWQoUHJvY2VkdXJlcy5TcF9QcmVwYXJlLCBwYXJhbWV0ZXJzLCB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSwgdGhpcy5jb25maWcub3B0aW9ucywgdGhpcy5kYXRhYmFzZUNvbGxhdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2UgdGhlIFNRTCBTZXJ2ZXIgcmVzb3VyY2VzIGFzc29jaWF0ZWQgd2l0aCBhIHByZXZpb3VzbHkgcHJlcGFyZWQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHJlcXVlc3QgQSBbW1JlcXVlc3RdXSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSByZXF1ZXN0LlxuICAgKiAgIFBhcmFtZXRlcnMgb25seSByZXF1aXJlIGEgbmFtZSBhbmQgdHlwZS5cbiAgICogICBQYXJhbWV0ZXIgdmFsdWVzIGFyZSBpZ25vcmVkLlxuICAgKi9cbiAgdW5wcmVwYXJlKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgICBjb25zdCBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJbXSA9IFtdO1xuXG4gICAgcGFyYW1ldGVycy5wdXNoKHtcbiAgICAgIHR5cGU6IFRZUEVTLkludCxcbiAgICAgIG5hbWU6ICdoYW5kbGUnLFxuICAgICAgLy8gVE9ETzogQWJvcnQgaWYgYHJlcXVlc3QuaGFuZGxlYCBpcyBub3Qgc2V0XG4gICAgICB2YWx1ZTogcmVxdWVzdC5oYW5kbGUsXG4gICAgICBvdXRwdXQ6IGZhbHNlLFxuICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICBwcmVjaXNpb246IHVuZGVmaW5lZCxcbiAgICAgIHNjYWxlOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5SUENfUkVRVUVTVCwgbmV3IFJwY1JlcXVlc3RQYXlsb2FkKFByb2NlZHVyZXMuU3BfVW5wcmVwYXJlLCBwYXJhbWV0ZXJzLCB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSwgdGhpcy5jb25maWcub3B0aW9ucywgdGhpcy5kYXRhYmFzZUNvbGxhdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgcHJldmlvdXNseSBwcmVwYXJlZCBTUUwsIHVzaW5nIHRoZSBzdXBwbGllZCBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdCBBIHByZXZpb3VzbHkgcHJlcGFyZWQgW1tSZXF1ZXN0XV0uXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJzICBBbiBvYmplY3Qgd2hvc2UgbmFtZXMgY29ycmVzcG9uZCB0byB0aGUgbmFtZXMgb2ZcbiAgICogICBwYXJhbWV0ZXJzIHRoYXQgd2VyZSBhZGRlZCB0byB0aGUgW1tSZXF1ZXN0XV0gYmVmb3JlIGl0IHdhcyBwcmVwYXJlZC5cbiAgICogICBUaGUgb2JqZWN0J3MgdmFsdWVzIGFyZSBwYXNzZWQgYXMgdGhlIHBhcmFtZXRlcnMnIHZhbHVlcyB3aGVuIHRoZVxuICAgKiAgIHJlcXVlc3QgaXMgZXhlY3V0ZWQuXG4gICAqL1xuICBleGVjdXRlKHJlcXVlc3Q6IFJlcXVlc3QsIHBhcmFtZXRlcnM/OiB7IFtrZXk6IHN0cmluZ106IHVua25vd24gfSkge1xuICAgIGNvbnN0IGV4ZWN1dGVQYXJhbWV0ZXJzOiBQYXJhbWV0ZXJbXSA9IFtdO1xuXG4gICAgZXhlY3V0ZVBhcmFtZXRlcnMucHVzaCh7XG4gICAgICB0eXBlOiBUWVBFUy5JbnQsXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIC8vIFRPRE86IEFib3J0IGlmIGByZXF1ZXN0LmhhbmRsZWAgaXMgbm90IHNldFxuICAgICAgdmFsdWU6IHJlcXVlc3QuaGFuZGxlLFxuICAgICAgb3V0cHV0OiBmYWxzZSxcbiAgICAgIGxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICBzY2FsZTogdW5kZWZpbmVkXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHJlcXVlc3QucGFyYW1ldGVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSByZXF1ZXN0LnBhcmFtZXRlcnNbaV07XG5cbiAgICAgICAgZXhlY3V0ZVBhcmFtZXRlcnMucHVzaCh7XG4gICAgICAgICAgLi4ucGFyYW1ldGVyLFxuICAgICAgICAgIHZhbHVlOiBwYXJhbWV0ZXIudHlwZS52YWxpZGF0ZShwYXJhbWV0ZXJzID8gcGFyYW1ldGVyc1twYXJhbWV0ZXIubmFtZV0gOiBudWxsLCB0aGlzLmRhdGFiYXNlQ29sbGF0aW9uKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICByZXF1ZXN0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmRlYnVnLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgcmVxdWVzdC5jYWxsYmFjayhlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5SUENfUkVRVUVTVCwgbmV3IFJwY1JlcXVlc3RQYXlsb2FkKFByb2NlZHVyZXMuU3BfRXhlY3V0ZSwgZXhlY3V0ZVBhcmFtZXRlcnMsIHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpLCB0aGlzLmNvbmZpZy5vcHRpb25zLCB0aGlzLmRhdGFiYXNlQ29sbGF0aW9uKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBhIHN0b3JlZCBwcm9jZWR1cmUgcmVwcmVzZW50ZWQgYnkgW1tSZXF1ZXN0XV0uXG4gICAqXG4gICAqIEBwYXJhbSByZXF1ZXN0IEEgW1tSZXF1ZXN0XV0gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcmVxdWVzdC5cbiAgICovXG4gIGNhbGxQcm9jZWR1cmUocmVxdWVzdDogUmVxdWVzdCkge1xuICAgIHRyeSB7XG4gICAgICByZXF1ZXN0LnZhbGlkYXRlUGFyYW1ldGVycyh0aGlzLmRhdGFiYXNlQ29sbGF0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICByZXF1ZXN0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmRlYnVnLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgcmVxdWVzdC5jYWxsYmFjayhlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5SUENfUkVRVUVTVCwgbmV3IFJwY1JlcXVlc3RQYXlsb2FkKHJlcXVlc3Quc3FsVGV4dE9yUHJvY2VkdXJlISwgcmVxdWVzdC5wYXJhbWV0ZXJzLCB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSwgdGhpcy5jb25maWcub3B0aW9ucywgdGhpcy5kYXRhYmFzZUNvbGxhdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IGEgdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKiBAcGFyYW0gbmFtZSBBIHN0cmluZyByZXByZXNlbnRpbmcgYSBuYW1lIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSB0cmFuc2FjdGlvbi5cbiAgICogICBPcHRpb25hbCwgYW5kIGRlZmF1bHRzIHRvIGFuIGVtcHR5IHN0cmluZy4gUmVxdWlyZWQgd2hlbiBgaXNvbGF0aW9uTGV2ZWxgXG4gICAqICAgaXMgcHJlc2VudC5cbiAgICogQHBhcmFtIGlzb2xhdGlvbkxldmVsIFRoZSBpc29sYXRpb24gbGV2ZWwgdGhhdCB0aGUgdHJhbnNhY3Rpb24gaXMgdG8gYmUgcnVuIHdpdGguXG4gICAqXG4gICAqICAgVGhlIGlzb2xhdGlvbiBsZXZlbHMgYXJlIGF2YWlsYWJsZSBmcm9tIGByZXF1aXJlKCd0ZWRpb3VzJykuSVNPTEFUSU9OX0xFVkVMYC5cbiAgICogICAqIGBSRUFEX1VOQ09NTUlUVEVEYFxuICAgKiAgICogYFJFQURfQ09NTUlUVEVEYFxuICAgKiAgICogYFJFUEVBVEFCTEVfUkVBRGBcbiAgICogICAqIGBTRVJJQUxJWkFCTEVgXG4gICAqICAgKiBgU05BUFNIT1RgXG4gICAqXG4gICAqICAgT3B0aW9uYWwsIGFuZCBkZWZhdWx0cyB0byB0aGUgQ29ubmVjdGlvbidzIGlzb2xhdGlvbiBsZXZlbC5cbiAgICovXG4gIGJlZ2luVHJhbnNhY3Rpb24oY2FsbGJhY2s6IEJlZ2luVHJhbnNhY3Rpb25DYWxsYmFjaywgbmFtZSA9ICcnLCBpc29sYXRpb25MZXZlbCA9IHRoaXMuY29uZmlnLm9wdGlvbnMuaXNvbGF0aW9uTGV2ZWwpIHtcbiAgICBhc3NlcnRWYWxpZElzb2xhdGlvbkxldmVsKGlzb2xhdGlvbkxldmVsLCAnaXNvbGF0aW9uTGV2ZWwnKTtcblxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKG5hbWUsIGlzb2xhdGlvbkxldmVsKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb24gPCAnN18yJykge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1NxbEJhdGNoKG5ldyBSZXF1ZXN0KCdTRVQgVFJBTlNBQ1RJT04gSVNPTEFUSU9OIExFVkVMICcgKyAodHJhbnNhY3Rpb24uaXNvbGF0aW9uTGV2ZWxUb1RTUUwoKSkgKyAnO0JFR0lOIFRSQU4gJyArIHRyYW5zYWN0aW9uLm5hbWUsIChlcnIpID0+IHtcbiAgICAgICAgdGhpcy50cmFuc2FjdGlvbkRlcHRoKys7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zYWN0aW9uRGVwdGggPT09IDEpIHtcbiAgICAgICAgICB0aGlzLmluVHJhbnNhY3Rpb24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVuZGVmaW5lZCwgKGVycikgPT4ge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuVFJBTlNBQ1RJT05fTUFOQUdFUiwgdHJhbnNhY3Rpb24uYmVnaW5QYXlsb2FkKHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tbWl0IGEgdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFRoZXJlIHNob3VsZCBiZSBhbiBhY3RpdmUgdHJhbnNhY3Rpb24gLSB0aGF0IGlzLCBbW2JlZ2luVHJhbnNhY3Rpb25dXVxuICAgKiBzaG91bGQgaGF2ZSBiZWVuIHByZXZpb3VzbHkgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHBhcmFtIG5hbWUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgbmFtZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgdHJhbnNhY3Rpb24uXG4gICAqICAgT3B0aW9uYWwsIGFuZCBkZWZhdWx0cyB0byBhbiBlbXB0eSBzdHJpbmcuIFJlcXVpcmVkIHdoZW4gYGlzb2xhdGlvbkxldmVsYGlzIHByZXNlbnQuXG4gICAqL1xuICBjb21taXRUcmFuc2FjdGlvbihjYWxsYmFjazogQ29tbWl0VHJhbnNhY3Rpb25DYWxsYmFjaywgbmFtZSA9ICcnKSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24obmFtZSk7XG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjU3FsQmF0Y2gobmV3IFJlcXVlc3QoJ0NPTU1JVCBUUkFOICcgKyB0cmFuc2FjdGlvbi5uYW1lLCAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25EZXB0aC0tO1xuICAgICAgICBpZiAodGhpcy50cmFuc2FjdGlvbkRlcHRoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5pblRyYW5zYWN0aW9uID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodW5kZWZpbmVkLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5UUkFOU0FDVElPTl9NQU5BR0VSLCB0cmFuc2FjdGlvbi5jb21taXRQYXlsb2FkKHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpKSk7XG4gIH1cblxuICAvKipcbiAgICogUm9sbGJhY2sgYSB0cmFuc2FjdGlvbi5cbiAgICpcbiAgICogVGhlcmUgc2hvdWxkIGJlIGFuIGFjdGl2ZSB0cmFuc2FjdGlvbiAtIHRoYXQgaXMsIFtbYmVnaW5UcmFuc2FjdGlvbl1dXG4gICAqIHNob3VsZCBoYXZlIGJlZW4gcHJldmlvdXNseSBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKiBAcGFyYW0gbmFtZSBBIHN0cmluZyByZXByZXNlbnRpbmcgYSBuYW1lIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSB0cmFuc2FjdGlvbi5cbiAgICogICBPcHRpb25hbCwgYW5kIGRlZmF1bHRzIHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICogICBSZXF1aXJlZCB3aGVuIGBpc29sYXRpb25MZXZlbGAgaXMgcHJlc2VudC5cbiAgICovXG4gIHJvbGxiYWNrVHJhbnNhY3Rpb24oY2FsbGJhY2s6IFJvbGxiYWNrVHJhbnNhY3Rpb25DYWxsYmFjaywgbmFtZSA9ICcnKSB7XG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24obmFtZSk7XG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInKSB7XG4gICAgICByZXR1cm4gdGhpcy5leGVjU3FsQmF0Y2gobmV3IFJlcXVlc3QoJ1JPTExCQUNLIFRSQU4gJyArIHRyYW5zYWN0aW9uLm5hbWUsIChlcnIpID0+IHtcbiAgICAgICAgdGhpcy50cmFuc2FjdGlvbkRlcHRoLS07XG4gICAgICAgIGlmICh0aGlzLnRyYW5zYWN0aW9uRGVwdGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLmluVHJhbnNhY3Rpb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodW5kZWZpbmVkLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5UUkFOU0FDVElPTl9NQU5BR0VSLCB0cmFuc2FjdGlvbi5yb2xsYmFja1BheWxvYWQodGhpcy5jdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYSBzYXZlcG9pbnQgd2l0aGluIGEgdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFRoZXJlIHNob3VsZCBiZSBhbiBhY3RpdmUgdHJhbnNhY3Rpb24gLSB0aGF0IGlzLCBbW2JlZ2luVHJhbnNhY3Rpb25dXVxuICAgKiBzaG91bGQgaGF2ZSBiZWVuIHByZXZpb3VzbHkgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHBhcmFtIG5hbWUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgbmFtZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgdHJhbnNhY3Rpb24uXFxcbiAgICogICBPcHRpb25hbCwgYW5kIGRlZmF1bHRzIHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICogICBSZXF1aXJlZCB3aGVuIGBpc29sYXRpb25MZXZlbGAgaXMgcHJlc2VudC5cbiAgICovXG4gIHNhdmVUcmFuc2FjdGlvbihjYWxsYmFjazogU2F2ZVRyYW5zYWN0aW9uQ2FsbGJhY2ssIG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKG5hbWUpO1xuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb24gPCAnN18yJykge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1NxbEJhdGNoKG5ldyBSZXF1ZXN0KCdTQVZFIFRSQU4gJyArIHRyYW5zYWN0aW9uLm5hbWUsIChlcnIpID0+IHtcbiAgICAgICAgdGhpcy50cmFuc2FjdGlvbkRlcHRoKys7XG4gICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1bmRlZmluZWQsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcy5tYWtlUmVxdWVzdChyZXF1ZXN0LCBUWVBFLlRSQU5TQUNUSU9OX01BTkFHRVIsIHRyYW5zYWN0aW9uLnNhdmVQYXlsb2FkKHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpKSk7XG4gIH1cblxuICAvKipcbiAgICogUnVuIHRoZSBnaXZlbiBjYWxsYmFjayBhZnRlciBzdGFydGluZyBhIHRyYW5zYWN0aW9uLCBhbmQgY29tbWl0IG9yXG4gICAqIHJvbGxiYWNrIHRoZSB0cmFuc2FjdGlvbiBhZnRlcndhcmRzLlxuICAgKlxuICAgKiBUaGlzIGlzIGEgaGVscGVyIHRoYXQgZW1wbG95cyBbW2JlZ2luVHJhbnNhY3Rpb25dXSwgW1tjb21taXRUcmFuc2FjdGlvbl1dLFxuICAgKiBbW3JvbGxiYWNrVHJhbnNhY3Rpb25dXSwgYW5kIFtbc2F2ZVRyYW5zYWN0aW9uXV0gdG8gZ3JlYXRseSBzaW1wbGlmeSB0aGVcbiAgICogdXNlIG9mIGRhdGFiYXNlIHRyYW5zYWN0aW9ucyBhbmQgYXV0b21hdGljYWxseSBoYW5kbGUgdHJhbnNhY3Rpb24gbmVzdGluZy5cbiAgICpcbiAgICogQHBhcmFtIGNiXG4gICAqIEBwYXJhbSBpc29sYXRpb25MZXZlbFxuICAgKiAgIFRoZSBpc29sYXRpb24gbGV2ZWwgdGhhdCB0aGUgdHJhbnNhY3Rpb24gaXMgdG8gYmUgcnVuIHdpdGguXG4gICAqXG4gICAqICAgVGhlIGlzb2xhdGlvbiBsZXZlbHMgYXJlIGF2YWlsYWJsZSBmcm9tIGByZXF1aXJlKCd0ZWRpb3VzJykuSVNPTEFUSU9OX0xFVkVMYC5cbiAgICogICAqIGBSRUFEX1VOQ09NTUlUVEVEYFxuICAgKiAgICogYFJFQURfQ09NTUlUVEVEYFxuICAgKiAgICogYFJFUEVBVEFCTEVfUkVBRGBcbiAgICogICAqIGBTRVJJQUxJWkFCTEVgXG4gICAqICAgKiBgU05BUFNIT1RgXG4gICAqXG4gICAqICAgT3B0aW9uYWwsIGFuZCBkZWZhdWx0cyB0byB0aGUgQ29ubmVjdGlvbidzIGlzb2xhdGlvbiBsZXZlbC5cbiAgICovXG4gIHRyYW5zYWN0aW9uKGNiOiAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQsIHR4RG9uZT86IDxUIGV4dGVuZHMgVHJhbnNhY3Rpb25Eb25lQ2FsbGJhY2s+KGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCBkb25lOiBULCAuLi5hcmdzOiBDYWxsYmFja1BhcmFtZXRlcnM8VD4pID0+IHZvaWQpID0+IHZvaWQsIGlzb2xhdGlvbkxldmVsPzogdHlwZW9mIElTT0xBVElPTl9MRVZFTFtrZXlvZiB0eXBlb2YgSVNPTEFUSU9OX0xFVkVMXSkge1xuICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BjYmAgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgY29uc3QgdXNlU2F2ZXBvaW50ID0gdGhpcy5pblRyYW5zYWN0aW9uO1xuICAgIGNvbnN0IG5hbWUgPSAnX3RlZGlvdXNfJyArIChjcnlwdG8ucmFuZG9tQnl0ZXMoMTApLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgY29uc3QgdHhEb25lOiA8VCBleHRlbmRzIFRyYW5zYWN0aW9uRG9uZUNhbGxiYWNrPihlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgZG9uZTogVCwgLi4uYXJnczogQ2FsbGJhY2tQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkID0gKGVyciwgZG9uZSwgLi4uYXJncykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zYWN0aW9uICYmIHRoaXMuc3RhdGUgPT09IHRoaXMuU1RBVEUuTE9HR0VEX0lOKSB7XG4gICAgICAgICAgdGhpcy5yb2xsYmFja1RyYW5zYWN0aW9uKCh0eEVycikgPT4ge1xuICAgICAgICAgICAgZG9uZSh0eEVyciB8fCBlcnIsIC4uLmFyZ3MpO1xuICAgICAgICAgIH0sIG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbmUoZXJyLCAuLi5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh1c2VTYXZlcG9pbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInKSB7XG4gICAgICAgICAgdGhpcy50cmFuc2FjdGlvbkRlcHRoLS07XG4gICAgICAgIH1cbiAgICAgICAgZG9uZShudWxsLCAuLi5hcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tbWl0VHJhbnNhY3Rpb24oKHR4RXJyKSA9PiB7XG4gICAgICAgICAgZG9uZSh0eEVyciwgLi4uYXJncyk7XG4gICAgICAgIH0sIG5hbWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodXNlU2F2ZXBvaW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5zYXZlVHJhbnNhY3Rpb24oKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNvbGF0aW9uTGV2ZWwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5leGVjU3FsQmF0Y2gobmV3IFJlcXVlc3QoJ1NFVCB0cmFuc2FjdGlvbiBpc29sYXRpb24gbGV2ZWwgJyArIHRoaXMuZ2V0SXNvbGF0aW9uTGV2ZWxUZXh0KGlzb2xhdGlvbkxldmVsKSwgKGVycikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNiKGVyciwgdHhEb25lKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHR4RG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5iZWdpblRyYW5zYWN0aW9uKChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNiKG51bGwsIHR4RG9uZSk7XG4gICAgICB9LCBuYW1lLCBpc29sYXRpb25MZXZlbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBtYWtlUmVxdWVzdChyZXF1ZXN0OiBSZXF1ZXN0IHwgQnVsa0xvYWQsIHBhY2tldFR5cGU6IG51bWJlciwgcGF5bG9hZDogKEl0ZXJhYmxlPEJ1ZmZlcj4gfCBBc3luY0l0ZXJhYmxlPEJ1ZmZlcj4pICYgeyB0b1N0cmluZzogKGluZGVudD86IHN0cmluZykgPT4gc3RyaW5nIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZSAhPT0gdGhpcy5TVEFURS5MT0dHRURfSU4pIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnUmVxdWVzdHMgY2FuIG9ubHkgYmUgbWFkZSBpbiB0aGUgJyArIHRoaXMuU1RBVEUuTE9HR0VEX0lOLm5hbWUgKyAnIHN0YXRlLCBub3QgdGhlICcgKyB0aGlzLnN0YXRlLm5hbWUgKyAnIHN0YXRlJztcbiAgICAgIHRoaXMuZGVidWcubG9nKG1lc3NhZ2UpO1xuICAgICAgcmVxdWVzdC5jYWxsYmFjayhuZXcgUmVxdWVzdEVycm9yKG1lc3NhZ2UsICdFSU5WQUxJRFNUQVRFJykpO1xuICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHJlcXVlc3QuY2FsbGJhY2sobmV3IFJlcXVlc3RFcnJvcignQ2FuY2VsZWQuJywgJ0VDQU5DRUwnKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBhY2tldFR5cGUgPT09IFRZUEUuU1FMX0JBVENIKSB7XG4gICAgICAgIHRoaXMuaXNTcWxCYXRjaCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlzU3FsQmF0Y2ggPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgIHJlcXVlc3QuY29ubmVjdGlvbiEgPSB0aGlzO1xuICAgICAgcmVxdWVzdC5yb3dDb3VudCEgPSAwO1xuICAgICAgcmVxdWVzdC5yb3dzISA9IFtdO1xuICAgICAgcmVxdWVzdC5yc3QhID0gW107XG5cbiAgICAgIGNvbnN0IG9uQ2FuY2VsID0gKCkgPT4ge1xuICAgICAgICBwYXlsb2FkU3RyZWFtLnVucGlwZShtZXNzYWdlKTtcbiAgICAgICAgcGF5bG9hZFN0cmVhbS5kZXN0cm95KG5ldyBSZXF1ZXN0RXJyb3IoJ0NhbmNlbGVkLicsICdFQ0FOQ0VMJykpO1xuXG4gICAgICAgIC8vIHNldCB0aGUgaWdub3JlIGJpdCBhbmQgZW5kIHRoZSBtZXNzYWdlLlxuICAgICAgICBtZXNzYWdlLmlnbm9yZSA9IHRydWU7XG4gICAgICAgIG1lc3NhZ2UuZW5kKCk7XG5cbiAgICAgICAgaWYgKHJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0ICYmIHJlcXVlc3QucGF1c2VkKSB7XG4gICAgICAgICAgLy8gcmVzdW1lIHRoZSByZXF1ZXN0IGlmIGl0IHdhcyBwYXVzZWQgc28gd2UgY2FuIHJlYWQgdGhlIHJlbWFpbmluZyB0b2tlbnNcbiAgICAgICAgICByZXF1ZXN0LnJlc3VtZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uY2UoJ2NhbmNlbCcsIG9uQ2FuY2VsKTtcblxuICAgICAgdGhpcy5jcmVhdGVSZXF1ZXN0VGltZXIoKTtcblxuICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKHsgdHlwZTogcGFja2V0VHlwZSwgcmVzZXRDb25uZWN0aW9uOiB0aGlzLnJlc2V0Q29ubmVjdGlvbk9uTmV4dFJlcXVlc3QgfSk7XG4gICAgICB0aGlzLm1lc3NhZ2VJby5vdXRnb2luZ01lc3NhZ2VTdHJlYW0ud3JpdGUobWVzc2FnZSk7XG4gICAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLlNFTlRfQ0xJRU5UX1JFUVVFU1QpO1xuXG4gICAgICBtZXNzYWdlLm9uY2UoJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgcmVxdWVzdC5yZW1vdmVMaXN0ZW5lcignY2FuY2VsJywgb25DYW5jZWwpO1xuICAgICAgICByZXF1ZXN0Lm9uY2UoJ2NhbmNlbCcsIHRoaXMuX2NhbmNlbEFmdGVyUmVxdWVzdFNlbnQpO1xuXG4gICAgICAgIHRoaXMucmVzZXRDb25uZWN0aW9uT25OZXh0UmVxdWVzdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRlYnVnLnBheWxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHBheWxvYWQhLnRvU3RyaW5nKCcgICcpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBwYXlsb2FkU3RyZWFtID0gUmVhZGFibGUuZnJvbShwYXlsb2FkKTtcbiAgICAgIHBheWxvYWRTdHJlYW0ub25jZSgnZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgcGF5bG9hZFN0cmVhbS51bnBpcGUobWVzc2FnZSk7XG5cbiAgICAgICAgLy8gT25seSBzZXQgYSByZXF1ZXN0IGVycm9yIGlmIG5vIGVycm9yIHdhcyBzZXQgeWV0LlxuICAgICAgICByZXF1ZXN0LmVycm9yID8/PSBlcnJvcjtcblxuICAgICAgICBtZXNzYWdlLmlnbm9yZSA9IHRydWU7XG4gICAgICAgIG1lc3NhZ2UuZW5kKCk7XG4gICAgICB9KTtcbiAgICAgIHBheWxvYWRTdHJlYW0ucGlwZShtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGN1cnJlbnRseSBleGVjdXRlZCByZXF1ZXN0LlxuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIGlmICghdGhpcy5yZXF1ZXN0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdC5jYW5jZWwoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgY29ubmVjdGlvbiB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cbiAgICogQ2FuIGJlIHVzZWZ1bCBmb3IgY29ubmVjdGlvbiBwb29sIGltcGxlbWVudGF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqL1xuICByZXNldChjYWxsYmFjazogUmVzZXRDYWxsYmFjaykge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh0aGlzLmdldEluaXRpYWxTcWwoKSwgKGVycikgPT4ge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInKSB7XG4gICAgICAgIHRoaXMuaW5UcmFuc2FjdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc2V0Q29ubmVjdGlvbk9uTmV4dFJlcXVlc3QgPSB0cnVlO1xuICAgIHRoaXMuZXhlY1NxbEJhdGNoKHJlcXVlc3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zYWN0aW9uRGVzY3JpcHRvcnNbdGhpcy50cmFuc2FjdGlvbkRlc2NyaXB0b3JzLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRJc29sYXRpb25MZXZlbFRleHQoaXNvbGF0aW9uTGV2ZWw6IHR5cGVvZiBJU09MQVRJT05fTEVWRUxba2V5b2YgdHlwZW9mIElTT0xBVElPTl9MRVZFTF0pIHtcbiAgICBzd2l0Y2ggKGlzb2xhdGlvbkxldmVsKSB7XG4gICAgICBjYXNlIElTT0xBVElPTl9MRVZFTC5SRUFEX1VOQ09NTUlUVEVEOlxuICAgICAgICByZXR1cm4gJ3JlYWQgdW5jb21taXR0ZWQnO1xuICAgICAgY2FzZSBJU09MQVRJT05fTEVWRUwuUkVQRUFUQUJMRV9SRUFEOlxuICAgICAgICByZXR1cm4gJ3JlcGVhdGFibGUgcmVhZCc7XG4gICAgICBjYXNlIElTT0xBVElPTl9MRVZFTC5TRVJJQUxJWkFCTEU6XG4gICAgICAgIHJldHVybiAnc2VyaWFsaXphYmxlJztcbiAgICAgIGNhc2UgSVNPTEFUSU9OX0xFVkVMLlNOQVBTSE9UOlxuICAgICAgICByZXR1cm4gJ3NuYXBzaG90JztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAncmVhZCBjb21taXR0ZWQnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybVRsc05lZ290aWF0aW9uKHByZWxvZ2luUGF5bG9hZDogUHJlbG9naW5QYXlsb2FkLCBzaWduYWw6IEFib3J0U2lnbmFsKSB7XG4gICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICBjb25zdCB7IHByb21pc2U6IHNpZ25hbEFib3J0ZWQsIHJlamVjdCB9ID0gd2l0aFJlc29sdmVyczxuZXZlcj4oKTtcblxuICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7IHJlamVjdChzaWduYWwucmVhc29uKTsgfTtcbiAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHByZWxvZ2luUGF5bG9hZC5mZWRBdXRoUmVxdWlyZWQgPT09IDEpIHtcbiAgICAgICAgdGhpcy5mZWRBdXRoUmVxdWlyZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCdzdHJpY3QnICE9PSB0aGlzLmNvbmZpZy5vcHRpb25zLmVuY3J5cHQgJiYgKHByZWxvZ2luUGF5bG9hZC5lbmNyeXB0aW9uU3RyaW5nID09PSAnT04nIHx8IHByZWxvZ2luUGF5bG9hZC5lbmNyeXB0aW9uU3RyaW5nID09PSAnUkVRJykpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5vcHRpb25zLmVuY3J5cHQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQ29ubmVjdGlvbkVycm9yKFwiU2VydmVyIHJlcXVpcmVzIGVuY3J5cHRpb24sIHNldCAnZW5jcnlwdCcgY29uZmlnIG9wdGlvbiB0byB0cnVlLlwiLCAnRUVOQ1JZUFQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9UTFNTU0xORUdPVElBVElPTik7XG4gICAgICAgIGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgdGhpcy5tZXNzYWdlSW8uc3RhcnRUbHModGhpcy5zZWN1cmVDb250ZXh0T3B0aW9ucywgdGhpcy5jb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lID8gdGhpcy5jb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lIDogdGhpcy5yb3V0aW5nRGF0YT8uc2VydmVyID8/IHRoaXMuY29uZmlnLnNlcnZlciwgdGhpcy5jb25maWcub3B0aW9ucy50cnVzdFNlcnZlckNlcnRpZmljYXRlKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlYWRQcmVsb2dpblJlc3BvbnNlKHNpZ25hbDogQWJvcnRTaWduYWwpOiBQcm9taXNlPFByZWxvZ2luUGF5bG9hZD4ge1xuICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgbGV0IG1lc3NhZ2VCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMCk7XG5cbiAgICBjb25zdCB7IHByb21pc2U6IHNpZ25hbEFib3J0ZWQsIHJlamVjdCB9ID0gd2l0aFJlc29sdmVyczxuZXZlcj4oKTtcblxuICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7IHJlamVjdChzaWduYWwucmVhc29uKTsgfTtcbiAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgIHRoaXMubWVzc2FnZUlvLnJlYWRNZXNzYWdlKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHRocm93IHRoaXMud3JhcFNvY2tldEVycm9yKGVycik7XG4gICAgICAgIH0pLFxuICAgICAgICBzaWduYWxBYm9ydGVkXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgaXRlcmF0b3IgPSBtZXNzYWdlW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSgpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBhd2FpdCBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgaXRlcmF0b3IubmV4dCgpLFxuICAgICAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1lc3NhZ2VCdWZmZXIgPSBCdWZmZXIuY29uY2F0KFttZXNzYWdlQnVmZmVyLCB2YWx1ZV0pO1xuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgYXdhaXQgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlbG9naW5QYXlsb2FkID0gbmV3IFByZWxvZ2luUGF5bG9hZChtZXNzYWdlQnVmZmVyKTtcbiAgICB0aGlzLmRlYnVnLnBheWxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcHJlbG9naW5QYXlsb2FkLnRvU3RyaW5nKCcgICcpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcmVsb2dpblBheWxvYWQ7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFzeW5jIHBlcmZvcm1SZVJvdXRpbmcoKSB7XG4gICAgdGhpcy5zb2NrZXQhLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHRoaXMuX29uU29ja2V0RXJyb3IpO1xuICAgIHRoaXMuc29ja2V0IS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9vblNvY2tldENsb3NlKTtcbiAgICB0aGlzLnNvY2tldCEucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIHRoaXMuX29uU29ja2V0RW5kKTtcbiAgICB0aGlzLnNvY2tldCEuZGVzdHJveSgpO1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2Nvbm5lY3Rpb24gdG8gJyArIHRoaXMuY29uZmlnLnNlcnZlciArICc6JyArIHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydCArICcgY2xvc2VkJyk7XG5cbiAgICB0aGlzLmVtaXQoJ3Jlcm91dGluZycpO1xuICAgIHRoaXMuZGVidWcubG9nKCdSZXJvdXRpbmcgdG8gJyArIHRoaXMucm91dGluZ0RhdGEhLnNlcnZlciArICc6JyArIHRoaXMucm91dGluZ0RhdGEhLnBvcnQpO1xuXG4gICAgLy8gQXR0ZW1wdCBjb25uZWN0aW5nIHRvIHRoZSByZXJvdXRpbmcgdGFyZ2V0XG4gICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5DT05ORUNUSU5HKTtcbiAgICBhd2FpdCB0aGlzLmluaXRpYWxpc2VDb25uZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFzeW5jIHBlcmZvcm1UcmFuc2llbnRGYWlsdXJlUmV0cnkoKSB7XG4gICAgdGhpcy5jdXJUcmFuc2llbnRSZXRyeUNvdW50Kys7XG5cbiAgICB0aGlzLnNvY2tldCEucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5fb25Tb2NrZXRFcnJvcik7XG4gICAgdGhpcy5zb2NrZXQhLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIHRoaXMuX29uU29ja2V0Q2xvc2UpO1xuICAgIHRoaXMuc29ja2V0IS5yZW1vdmVMaXN0ZW5lcignZW5kJywgdGhpcy5fb25Tb2NrZXRFbmQpO1xuICAgIHRoaXMuc29ja2V0IS5kZXN0cm95KCk7XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnY29ubmVjdGlvbiB0byAnICsgdGhpcy5jb25maWcuc2VydmVyICsgJzonICsgdGhpcy5jb25maWcub3B0aW9ucy5wb3J0ICsgJyBjbG9zZWQnKTtcblxuICAgIGNvbnN0IHNlcnZlciA9IHRoaXMucm91dGluZ0RhdGEgPyB0aGlzLnJvdXRpbmdEYXRhLnNlcnZlciA6IHRoaXMuY29uZmlnLnNlcnZlcjtcbiAgICBjb25zdCBwb3J0ID0gdGhpcy5yb3V0aW5nRGF0YSA/IHRoaXMucm91dGluZ0RhdGEucG9ydCA6IHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydDtcbiAgICB0aGlzLmRlYnVnLmxvZygnUmV0cnkgYWZ0ZXIgdHJhbnNpZW50IGZhaWx1cmUgY29ubmVjdGluZyB0byAnICsgc2VydmVyICsgJzonICsgcG9ydCk7XG5cbiAgICBjb25zdCB7IHByb21pc2UsIHJlc29sdmUgfSA9IHdpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvblJldHJ5SW50ZXJ2YWwpO1xuICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICB0aGlzLmVtaXQoJ3JldHJ5Jyk7XG4gICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5DT05ORUNUSU5HKTtcbiAgICBhd2FpdCB0aGlzLmluaXRpYWxpc2VDb25uZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFzeW5jIHBlcmZvcm1TZW50TG9naW43V2l0aFN0YW5kYXJkTG9naW4oc2lnbmFsOiBBYm9ydFNpZ25hbCk6IFByb21pc2U8Um91dGluZ0RhdGEgfCB1bmRlZmluZWQ+IHtcbiAgICBzaWduYWwudGhyb3dJZkFib3J0ZWQoKTtcblxuICAgIGNvbnN0IHsgcHJvbWlzZTogc2lnbmFsQWJvcnRlZCwgcmVqZWN0IH0gPSB3aXRoUmVzb2x2ZXJzPG5ldmVyPigpO1xuXG4gICAgY29uc3Qgb25BYm9ydCA9ICgpID0+IHsgcmVqZWN0KHNpZ25hbC5yZWFzb24pOyB9O1xuICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgdGhpcy5tZXNzYWdlSW8ucmVhZE1lc3NhZ2UoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgdGhyb3cgdGhpcy53cmFwU29ja2V0RXJyb3IoZXJyKTtcbiAgICAgICAgfSksXG4gICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IExvZ2luN1Rva2VuSGFuZGxlcih0aGlzKTtcbiAgICAgIGNvbnN0IHRva2VuU3RyZWFtUGFyc2VyID0gdGhpcy5jcmVhdGVUb2tlblN0cmVhbVBhcnNlcihtZXNzYWdlLCBoYW5kbGVyKTtcbiAgICAgIGF3YWl0IG9uY2UodG9rZW5TdHJlYW1QYXJzZXIsICdlbmQnKTtcblxuICAgICAgaWYgKGhhbmRsZXIubG9naW5BY2tSZWNlaXZlZCkge1xuICAgICAgICByZXR1cm4gaGFuZGxlci5yb3V0aW5nRGF0YTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2dpbkVycm9yKSB7XG4gICAgICAgIHRocm93IHRoaXMubG9naW5FcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uRXJyb3IoJ0xvZ2luIGZhaWxlZC4nLCAnRUxPR0lOJyk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubG9naW5FcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybVNlbnRMb2dpbjdXaXRoTlRMTUxvZ2luKHNpZ25hbDogQWJvcnRTaWduYWwpOiBQcm9taXNlPFJvdXRpbmdEYXRhIHwgdW5kZWZpbmVkPiB7XG4gICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICBjb25zdCB7IHByb21pc2U6IHNpZ25hbEFib3J0ZWQsIHJlamVjdCB9ID0gd2l0aFJlc29sdmVyczxuZXZlcj4oKTtcblxuICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7IHJlamVjdChzaWduYWwucmVhc29uKTsgfTtcbiAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICB0cnkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgdGhpcy5tZXNzYWdlSW8ucmVhZE1lc3NhZ2UoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgICAgXSk7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBMb2dpbjdUb2tlbkhhbmRsZXIodGhpcyk7XG4gICAgICAgIGNvbnN0IHRva2VuU3RyZWFtUGFyc2VyID0gdGhpcy5jcmVhdGVUb2tlblN0cmVhbVBhcnNlcihtZXNzYWdlLCBoYW5kbGVyKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICBvbmNlKHRva2VuU3RyZWFtUGFyc2VyLCAnZW5kJyksXG4gICAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgICBdKTtcblxuICAgICAgICBpZiAoaGFuZGxlci5sb2dpbkFja1JlY2VpdmVkKSB7XG4gICAgICAgICAgcmV0dXJuIGhhbmRsZXIucm91dGluZ0RhdGE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udGxtcGFja2V0KSB7XG4gICAgICAgICAgY29uc3QgYXV0aGVudGljYXRpb24gPSB0aGlzLmNvbmZpZy5hdXRoZW50aWNhdGlvbiBhcyBOdGxtQXV0aGVudGljYXRpb247XG5cbiAgICAgICAgICBjb25zdCBwYXlsb2FkID0gbmV3IE5UTE1SZXNwb25zZVBheWxvYWQoe1xuICAgICAgICAgICAgZG9tYWluOiBhdXRoZW50aWNhdGlvbi5vcHRpb25zLmRvbWFpbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBhdXRoZW50aWNhdGlvbi5vcHRpb25zLnVzZXJOYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMucGFzc3dvcmQsXG4gICAgICAgICAgICBudGxtcGFja2V0OiB0aGlzLm50bG1wYWNrZXRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMubWVzc2FnZUlvLnNlbmRNZXNzYWdlKFRZUEUuTlRMTUFVVEhfUEtULCBwYXlsb2FkLmRhdGEpO1xuICAgICAgICAgIHRoaXMuZGVidWcucGF5bG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkLnRvU3RyaW5nKCcgICcpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5udGxtcGFja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubG9naW5FcnJvcikge1xuICAgICAgICAgIHRocm93IHRoaXMubG9naW5FcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQ29ubmVjdGlvbkVycm9yKCdMb2dpbiBmYWlsZWQuJywgJ0VMT0dJTicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubG9naW5FcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybVNlbnRMb2dpbjdXaXRoRmVkQXV0aChzaWduYWw6IEFib3J0U2lnbmFsKTogUHJvbWlzZTxSb3V0aW5nRGF0YSB8IHVuZGVmaW5lZD4ge1xuICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgY29uc3QgeyBwcm9taXNlOiBzaWduYWxBYm9ydGVkLCByZWplY3QgfSA9IHdpdGhSZXNvbHZlcnM8bmV2ZXI+KCk7XG5cbiAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4geyByZWplY3Qoc2lnbmFsLnJlYXNvbik7IH07XG4gICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBQcm9taXNlLnJhY2UoW1xuICAgICAgICB0aGlzLm1lc3NhZ2VJby5yZWFkTWVzc2FnZSgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICB0aHJvdyB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpO1xuICAgICAgICB9KSxcbiAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgTG9naW43VG9rZW5IYW5kbGVyKHRoaXMpO1xuICAgICAgY29uc3QgdG9rZW5TdHJlYW1QYXJzZXIgPSB0aGlzLmNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIGhhbmRsZXIpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgb25jZSh0b2tlblN0cmVhbVBhcnNlciwgJ2VuZCcpLFxuICAgICAgICBzaWduYWxBYm9ydGVkXG4gICAgICBdKTtcblxuICAgICAgaWYgKGhhbmRsZXIubG9naW5BY2tSZWNlaXZlZCkge1xuICAgICAgICByZXR1cm4gaGFuZGxlci5yb3V0aW5nRGF0YTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVkQXV0aEluZm9Ub2tlbiA9IGhhbmRsZXIuZmVkQXV0aEluZm9Ub2tlbjtcblxuICAgICAgaWYgKGZlZEF1dGhJbmZvVG9rZW4gJiYgZmVkQXV0aEluZm9Ub2tlbi5zdHN1cmwgJiYgZmVkQXV0aEluZm9Ub2tlbi5zcG4pIHtcbiAgICAgICAgLyoqIEZlZGVyYXRlZCBhdXRoZW50aWNhdGlvbiBjb25maWdhdGlvbi4gKi9cbiAgICAgICAgY29uc3QgYXV0aGVudGljYXRpb24gPSB0aGlzLmNvbmZpZy5hdXRoZW50aWNhdGlvbiBhcyBUb2tlbkNyZWRlbnRpYWxBdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5UGFzc3dvcmRBdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpVm1BdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpQXBwU2VydmljZUF1dGhlbnRpY2F0aW9uIHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlTZXJ2aWNlUHJpbmNpcGFsU2VjcmV0IHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlEZWZhdWx0QXV0aGVudGljYXRpb247XG4gICAgICAgIC8qKiBQZXJtaXNzaW9uIHNjb3BlIHRvIHBhc3MgdG8gRW50cmEgSUQgd2hlbiByZXF1ZXN0aW5nIGFuIGF1dGhlbnRpY2F0aW9uIHRva2VuLiAqL1xuICAgICAgICBjb25zdCB0b2tlblNjb3BlID0gbmV3IFVSTCgnLy5kZWZhdWx0JywgZmVkQXV0aEluZm9Ub2tlbi5zcG4pLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgLyoqIEluc3RhbmNlIG9mIHRoZSB0b2tlbiBjcmVkZW50aWFsIHRvIHVzZSB0byBhdXRoZW50aWNhdGUgdG8gdGhlIHJlc291cmNlLiAqL1xuICAgICAgICBsZXQgY3JlZGVudGlhbHM6IFRva2VuQ3JlZGVudGlhbDtcblxuICAgICAgICBzd2l0Y2ggKGF1dGhlbnRpY2F0aW9uLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICd0b2tlbi1jcmVkZW50aWFsJzpcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0gYXV0aGVudGljYXRpb24ub3B0aW9ucy5jcmVkZW50aWFsO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZCc6XG4gICAgICAgICAgICBjcmVkZW50aWFscyA9IG5ldyBVc2VybmFtZVBhc3N3b3JkQ3JlZGVudGlhbChcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy50ZW5hbnRJZCA/PyAnY29tbW9uJyxcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy51c2VyTmFtZSxcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy5wYXNzd29yZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtJzpcbiAgICAgICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZSc6XG4gICAgICAgICAgICBjb25zdCBtc2lBcmdzID0gYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZCA/IFthdXRoZW50aWNhdGlvbi5vcHRpb25zLmNsaWVudElkLCB7fV0gOiBbe31dO1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSBuZXcgTWFuYWdlZElkZW50aXR5Q3JlZGVudGlhbCguLi5tc2lBcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCc6XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZCA/IHsgbWFuYWdlZElkZW50aXR5Q2xpZW50SWQ6IGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50SWQgfSA6IHt9O1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSBuZXcgRGVmYXVsdEF6dXJlQ3JlZGVudGlhbChhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3Rvcnktc2VydmljZS1wcmluY2lwYWwtc2VjcmV0JzpcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0gbmV3IENsaWVudFNlY3JldENyZWRlbnRpYWwoXG4gICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudGVuYW50SWQsXG4gICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50SWQsXG4gICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50U2VjcmV0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvKiogQWNjZXNzIHRva2VuIHJldHJpZXZlZCBmcm9tIEVudHJhIElEIGZvciB0aGUgY29uZmlndXJlZCBwZXJtaXNzaW9uIHNjb3BlKHMpLiAqL1xuICAgICAgICBsZXQgdG9rZW5SZXNwb25zZTogQWNjZXNzVG9rZW4gfCBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdG9rZW5SZXNwb25zZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgICBjcmVkZW50aWFscy5nZXRUb2tlbih0b2tlblNjb3BlKSxcbiAgICAgICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgICAgICBdKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICAgICAgICB0aHJvdyBuZXcgQWdncmVnYXRlRXJyb3IoXG4gICAgICAgICAgICBbbmV3IENvbm5lY3Rpb25FcnJvcignU2VjdXJpdHkgdG9rZW4gY291bGQgbm90IGJlIGF1dGhlbnRpY2F0ZWQgb3IgYXV0aG9yaXplZC4nLCAnRUZFREFVVEgnKSwgZXJyXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUeXBlIGd1YXJkIHRoZSB0b2tlbiB2YWx1ZSBzbyB0aGF0IGl0IGlzIG5ldmVyIG51bGwuXG4gICAgICAgIGlmICh0b2tlblJlc3BvbnNlID09PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZUVycm9yKFxuICAgICAgICAgICAgW25ldyBDb25uZWN0aW9uRXJyb3IoJ1NlY3VyaXR5IHRva2VuIGNvdWxkIG5vdCBiZSBhdXRoZW50aWNhdGVkIG9yIGF1dGhvcml6ZWQuJywgJ0VGRURBVVRIJyldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VuZEZlZEF1dGhUb2tlbk1lc3NhZ2UodG9rZW5SZXNwb25zZS50b2tlbik7XG4gICAgICAgIC8vIHNlbnQgdGhlIGZlZEF1dGggdG9rZW4gbWVzc2FnZSwgdGhlIHJlc3QgaXMgc2ltaWxhciB0byBzdGFuZGFyZCBsb2dpbiA3XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9MT0dJTjdfV0lUSF9TVEFOREFSRF9MT0dJTik7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBlcmZvcm1TZW50TG9naW43V2l0aFN0YW5kYXJkTG9naW4oc2lnbmFsKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2dpbkVycm9yKSB7XG4gICAgICAgIHRocm93IHRoaXMubG9naW5FcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uRXJyb3IoJ0xvZ2luIGZhaWxlZC4nLCAnRUxPR0lOJyk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubG9naW5FcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybUxvZ2dlZEluU2VuZGluZ0luaXRpYWxTcWwoc2lnbmFsOiBBYm9ydFNpZ25hbCkge1xuICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgY29uc3QgeyBwcm9taXNlOiBzaWduYWxBYm9ydGVkLCByZWplY3QgfSA9IHdpdGhSZXNvbHZlcnM8bmV2ZXI+KCk7XG5cbiAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4geyByZWplY3Qoc2lnbmFsLnJlYXNvbik7IH07XG4gICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc2VuZEluaXRpYWxTcWwoKTtcblxuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgIHRoaXMubWVzc2FnZUlvLnJlYWRNZXNzYWdlKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHRocm93IHRoaXMud3JhcFNvY2tldEVycm9yKGVycik7XG4gICAgICAgIH0pLFxuICAgICAgICBzaWduYWxBYm9ydGVkXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgdG9rZW5TdHJlYW1QYXJzZXIgPSB0aGlzLmNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIG5ldyBJbml0aWFsU3FsVG9rZW5IYW5kbGVyKHRoaXMpKTtcbiAgICAgIGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgIG9uY2UodG9rZW5TdHJlYW1QYXJzZXIsICdlbmQnKSxcbiAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgXSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpc1RyYW5zaWVudEVycm9yKGVycm9yOiBBZ2dyZWdhdGVFcnJvciB8IENvbm5lY3Rpb25FcnJvcik6IGJvb2xlYW4ge1xuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBBZ2dyZWdhdGVFcnJvcikge1xuICAgIGVycm9yID0gZXJyb3IuZXJyb3JzWzBdO1xuICB9XG4gIHJldHVybiAoZXJyb3IgaW5zdGFuY2VvZiBDb25uZWN0aW9uRXJyb3IpICYmICEhZXJyb3IuaXNUcmFuc2llbnQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbm5lY3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IENvbm5lY3Rpb247XG5cbkNvbm5lY3Rpb24ucHJvdG90eXBlLlNUQVRFID0ge1xuICBJTklUSUFMSVpFRDoge1xuICAgIG5hbWU6ICdJbml0aWFsaXplZCcsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBDT05ORUNUSU5HOiB7XG4gICAgbmFtZTogJ0Nvbm5lY3RpbmcnLFxuICAgIGV2ZW50czoge31cbiAgfSxcbiAgU0VOVF9QUkVMT0dJTjoge1xuICAgIG5hbWU6ICdTZW50UHJlbG9naW4nLFxuICAgIGV2ZW50czoge31cbiAgfSxcbiAgUkVST1VUSU5HOiB7XG4gICAgbmFtZTogJ1JlUm91dGluZycsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBUUkFOU0lFTlRfRkFJTFVSRV9SRVRSWToge1xuICAgIG5hbWU6ICdUUkFOU0lFTlRfRkFJTFVSRV9SRVRSWScsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBTRU5UX1RMU1NTTE5FR09USUFUSU9OOiB7XG4gICAgbmFtZTogJ1NlbnRUTFNTU0xOZWdvdGlhdGlvbicsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBTRU5UX0xPR0lON19XSVRIX1NUQU5EQVJEX0xPR0lOOiB7XG4gICAgbmFtZTogJ1NlbnRMb2dpbjdXaXRoU3RhbmRhcmRMb2dpbicsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBTRU5UX0xPR0lON19XSVRIX05UTE06IHtcbiAgICBuYW1lOiAnU2VudExvZ2luN1dpdGhOVExNTG9naW4nLFxuICAgIGV2ZW50czoge31cbiAgfSxcbiAgU0VOVF9MT0dJTjdfV0lUSF9GRURBVVRIOiB7XG4gICAgbmFtZTogJ1NlbnRMb2dpbjdXaXRoRmVkYXV0aCcsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBMT0dHRURfSU5fU0VORElOR19JTklUSUFMX1NRTDoge1xuICAgIG5hbWU6ICdMb2dnZWRJblNlbmRpbmdJbml0aWFsU3FsJyxcbiAgICBldmVudHM6IHt9XG4gIH0sXG4gIExPR0dFRF9JTjoge1xuICAgIG5hbWU6ICdMb2dnZWRJbicsXG4gICAgZXZlbnRzOiB7XG4gICAgICBzb2NrZXRFcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuRklOQUwpO1xuICAgICAgICB0aGlzLmNsZWFudXBDb25uZWN0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTRU5UX0NMSUVOVF9SRVFVRVNUOiB7XG4gICAgbmFtZTogJ1NlbnRDbGllbnRSZXF1ZXN0JyxcbiAgICBlbnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgbWVzc2FnZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtZXNzYWdlID0gYXdhaXQgdGhpcy5tZXNzYWdlSW8ucmVhZE1lc3NhZ2UoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3NvY2tldEVycm9yJywgZXJyKTtcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVxdWVzdCB0aW1lciBpcyBzdG9wcGVkIG9uIGZpcnN0IGRhdGEgcGFja2FnZVxuICAgICAgICB0aGlzLmNsZWFyUmVxdWVzdFRpbWVyKCk7XG5cbiAgICAgICAgY29uc3QgdG9rZW5TdHJlYW1QYXJzZXIgPSB0aGlzLmNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIG5ldyBSZXF1ZXN0VG9rZW5IYW5kbGVyKHRoaXMsIHRoaXMucmVxdWVzdCEpKTtcblxuICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCB3YXMgY2FuY2VsZWQgYW5kIHdlIGhhdmUgYSBgY2FuY2VsVGltZXJgXG4gICAgICAgIC8vIGRlZmluZWQsIHdlIHNlbmQgYSBhdHRlbnRpb24gbWVzc2FnZSBhZnRlciB0aGVcbiAgICAgICAgLy8gcmVxdWVzdCBtZXNzYWdlIHdhcyBmdWxseSBzZW50IG9mZi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgYWxyZWFkeSBzdGFydGVkIGNvbnN1bWluZyB0aGUgY3VycmVudCBtZXNzYWdlXG4gICAgICAgIC8vIChidXQgYWxsIHRoZSB0b2tlbiBoYW5kbGVycyBzaG91bGQgYmUgbm8tb3BzKSwgYW5kXG4gICAgICAgIC8vIG5lZWQgdG8gZW5zdXJlIHRoZSBuZXh0IG1lc3NhZ2UgaXMgaGFuZGxlZCBieSB0aGVcbiAgICAgICAgLy8gYFNFTlRfQVRURU5USU9OYCBzdGF0ZS5cbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdD8uY2FuY2VsZWQgJiYgdGhpcy5jYW5jZWxUaW1lcikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLlNFTlRfQVRURU5USU9OKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9uUmVzdW1lID0gKCkgPT4ge1xuICAgICAgICAgIHRva2VuU3RyZWFtUGFyc2VyLnJlc3VtZSgpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvblBhdXNlID0gKCkgPT4ge1xuICAgICAgICAgIHRva2VuU3RyZWFtUGFyc2VyLnBhdXNlKCk7XG5cbiAgICAgICAgICB0aGlzLnJlcXVlc3Q/Lm9uY2UoJ3Jlc3VtZScsIG9uUmVzdW1lKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlcXVlc3Q/Lm9uKCdwYXVzZScsIG9uUGF1c2UpO1xuXG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0ICYmIHRoaXMucmVxdWVzdC5wYXVzZWQpIHtcbiAgICAgICAgICBvblBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvbkNhbmNlbCA9ICgpID0+IHtcbiAgICAgICAgICB0b2tlblN0cmVhbVBhcnNlci5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25FbmRPZk1lc3NhZ2UpO1xuXG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdCBpbnN0YW5jZW9mIFJlcXVlc3QgJiYgdGhpcy5yZXF1ZXN0LnBhdXNlZCkge1xuICAgICAgICAgICAgLy8gcmVzdW1lIHRoZSByZXF1ZXN0IGlmIGl0IHdhcyBwYXVzZWQgc28gd2UgY2FuIHJlYWQgdGhlIHJlbWFpbmluZyB0b2tlbnNcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdC5yZXN1bWUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnJlcXVlc3Q/LnJlbW92ZUxpc3RlbmVyKCdwYXVzZScsIG9uUGF1c2UpO1xuICAgICAgICAgIHRoaXMucmVxdWVzdD8ucmVtb3ZlTGlzdGVuZXIoJ3Jlc3VtZScsIG9uUmVzdW1lKTtcblxuICAgICAgICAgIC8vIFRoZSBgX2NhbmNlbEFmdGVyUmVxdWVzdFNlbnRgIGNhbGxiYWNrIHdpbGwgaGF2ZSBzZW50IGFcbiAgICAgICAgICAvLyBhdHRlbnRpb24gbWVzc2FnZSwgc28gbm93IHdlIG5lZWQgdG8gYWxzbyBzd2l0Y2ggdG9cbiAgICAgICAgICAvLyB0aGUgYFNFTlRfQVRURU5USU9OYCBzdGF0ZSB0byBtYWtlIHN1cmUgdGhlIGF0dGVudGlvbiBhY2tcbiAgICAgICAgICAvLyBtZXNzYWdlIGlzIHByb2Nlc3NlZCBjb3JyZWN0bHkuXG4gICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5TRU5UX0FUVEVOVElPTik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25FbmRPZk1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0Py5yZW1vdmVMaXN0ZW5lcignY2FuY2VsJywgdGhpcy5fY2FuY2VsQWZ0ZXJSZXF1ZXN0U2VudCk7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0Py5yZW1vdmVMaXN0ZW5lcignY2FuY2VsJywgb25DYW5jZWwpO1xuICAgICAgICAgIHRoaXMucmVxdWVzdD8ucmVtb3ZlTGlzdGVuZXIoJ3BhdXNlJywgb25QYXVzZSk7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0Py5yZW1vdmVMaXN0ZW5lcigncmVzdW1lJywgb25SZXN1bWUpO1xuXG4gICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5MT0dHRURfSU4pO1xuICAgICAgICAgIGNvbnN0IHNxbFJlcXVlc3QgPSB0aGlzLnJlcXVlc3QgYXMgUmVxdWVzdDtcbiAgICAgICAgICB0aGlzLnJlcXVlc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInICYmIHNxbFJlcXVlc3QuZXJyb3IgJiYgdGhpcy5pc1NxbEJhdGNoKSB7XG4gICAgICAgICAgICB0aGlzLmluVHJhbnNhY3Rpb24gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3FsUmVxdWVzdC5jYWxsYmFjayhzcWxSZXF1ZXN0LmVycm9yLCBzcWxSZXF1ZXN0LnJvd0NvdW50LCBzcWxSZXF1ZXN0LnJvd3MpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRva2VuU3RyZWFtUGFyc2VyLm9uY2UoJ2VuZCcsIG9uRW5kT2ZNZXNzYWdlKTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0Py5vbmNlKCdjYW5jZWwnLCBvbkNhbmNlbCk7XG4gICAgICB9KSgpO1xuXG4gICAgfSxcbiAgICBleGl0OiBmdW5jdGlvbihuZXh0U3RhdGUpIHtcbiAgICAgIHRoaXMuY2xlYXJSZXF1ZXN0VGltZXIoKTtcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgc29ja2V0RXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zdCBzcWxSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0ITtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLkZJTkFMKTtcbiAgICAgICAgdGhpcy5jbGVhbnVwQ29ubmVjdGlvbigpO1xuXG4gICAgICAgIHNxbFJlcXVlc3QuY2FsbGJhY2soZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFNFTlRfQVRURU5USU9OOiB7XG4gICAgbmFtZTogJ1NlbnRBdHRlbnRpb24nLFxuICAgIGVudGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCBtZXNzYWdlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG1lc3NhZ2UgPSBhd2FpdCB0aGlzLm1lc3NhZ2VJby5yZWFkTWVzc2FnZSgpO1xuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnc29ja2V0RXJyb3InLCBlcnIpO1xuICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIHRoaXMud3JhcFNvY2tldEVycm9yKGVycikpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQXR0ZW50aW9uVG9rZW5IYW5kbGVyKHRoaXMsIHRoaXMucmVxdWVzdCEpO1xuICAgICAgICBjb25zdCB0b2tlblN0cmVhbVBhcnNlciA9IHRoaXMuY3JlYXRlVG9rZW5TdHJlYW1QYXJzZXIobWVzc2FnZSwgaGFuZGxlcik7XG5cbiAgICAgICAgYXdhaXQgb25jZSh0b2tlblN0cmVhbVBhcnNlciwgJ2VuZCcpO1xuICAgICAgICAvLyAzLjIuNS43IFNlbnQgQXR0ZW50aW9uIFN0YXRlXG4gICAgICAgIC8vIERpc2NhcmQgYW55IGRhdGEgY29udGFpbmVkIGluIHRoZSByZXNwb25zZSwgdW50aWwgd2UgcmVjZWl2ZSB0aGUgYXR0ZW50aW9uIHJlc3BvbnNlXG4gICAgICAgIGlmIChoYW5kbGVyLmF0dGVudGlvblJlY2VpdmVkKSB7XG4gICAgICAgICAgdGhpcy5jbGVhckNhbmNlbFRpbWVyKCk7XG5cbiAgICAgICAgICBjb25zdCBzcWxSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0ITtcbiAgICAgICAgICB0aGlzLnJlcXVlc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5MT0dHRURfSU4pO1xuXG4gICAgICAgICAgaWYgKHNxbFJlcXVlc3QuZXJyb3IgJiYgc3FsUmVxdWVzdC5lcnJvciBpbnN0YW5jZW9mIFJlcXVlc3RFcnJvciAmJiBzcWxSZXF1ZXN0LmVycm9yLmNvZGUgPT09ICdFVElNRU9VVCcpIHtcbiAgICAgICAgICAgIHNxbFJlcXVlc3QuY2FsbGJhY2soc3FsUmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNxbFJlcXVlc3QuY2FsbGJhY2sobmV3IFJlcXVlc3RFcnJvcignQ2FuY2VsZWQuJywgJ0VDQU5DRUwnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICBzb2NrZXRFcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnN0IHNxbFJlcXVlc3QgPSB0aGlzLnJlcXVlc3QhO1xuICAgICAgICB0aGlzLnJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5GSU5BTCk7XG4gICAgICAgIHRoaXMuY2xlYW51cENvbm5lY3Rpb24oKTtcblxuICAgICAgICBzcWxSZXF1ZXN0LmNhbGxiYWNrKGVycik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBGSU5BTDoge1xuICAgIG5hbWU6ICdGaW5hbCcsXG4gICAgZXZlbnRzOiB7fVxuICB9XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxPQUFBLEdBQUFDLHNCQUFB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RyxJQUFJLENBQUM1TCx1QkFBdUIsQ0FBQy9DLE9BQU8sRUFBRWdELE9BQU8sQ0FBQztRQUV4RSxNQUFNLElBQUFuRSxZQUFJLEVBQUM4UCxpQkFBaUIsRUFBRSxLQUFLLENBQUM7UUFDcEM7UUFDQTtRQUNBLElBQUkzTCxPQUFPLENBQUNpTyxpQkFBaUIsRUFBRTtVQUM3QixJQUFJLENBQUMzTSxnQkFBZ0IsQ0FBQyxDQUFDO1VBRXZCLE1BQU13TSxVQUFVLEdBQUcsSUFBSSxDQUFDbk8sT0FBUTtVQUNoQyxJQUFJLENBQUNBLE9BQU8sR0FBR3JMLFNBQVM7VUFDeEIsSUFBSSxDQUFDd0gsWUFBWSxDQUFDLElBQUksQ0FBQzVCLEtBQUssQ0FBQ3FGLFNBQVMsQ0FBQztVQUV2QyxJQUFJdU8sVUFBVSxDQUFDL1MsS0FBSyxJQUFJK1MsVUFBVSxDQUFDL1MsS0FBSyxZQUFZNkUsb0JBQVksSUFBSWtPLFVBQVUsQ0FBQy9TLEtBQUssQ0FBQzhDLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDeEdpUSxVQUFVLENBQUNqTyxRQUFRLENBQUNpTyxVQUFVLENBQUMvUyxLQUFLLENBQUM7VUFDdkMsQ0FBQyxNQUFNO1lBQ0wrUyxVQUFVLENBQUNqTyxRQUFRLENBQUMsSUFBSUQsb0JBQVksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7VUFDL0Q7UUFDRjtNQUNGLENBQUMsRUFBRSxDQUFDLENBQUNzTCxLQUFLLENBQUV4UCxHQUFHLElBQUs7UUFDbEJULE9BQU8sQ0FBQ0MsUUFBUSxDQUFDLE1BQU07VUFDckIsTUFBTVEsR0FBRztRQUNYLENBQUMsQ0FBQztNQUNKLENBQUMsQ0FBQztJQUNKLENBQUM7SUFDRHVHLE1BQU0sRUFBRTtNQUNOc0wsV0FBVyxFQUFFLFNBQUFBLENBQVM3UixHQUFHLEVBQUU7UUFDekIsTUFBTW9TLFVBQVUsR0FBRyxJQUFJLENBQUNuTyxPQUFRO1FBQ2hDLElBQUksQ0FBQ0EsT0FBTyxHQUFHckwsU0FBUztRQUV4QixJQUFJLENBQUN3SCxZQUFZLENBQUMsSUFBSSxDQUFDNUIsS0FBSyxDQUFDZ0MsS0FBSyxDQUFDO1FBQ25DLElBQUksQ0FBQ00saUJBQWlCLENBQUMsQ0FBQztRQUV4QnNSLFVBQVUsQ0FBQ2pPLFFBQVEsQ0FBQ25FLEdBQUcsQ0FBQztNQUMxQjtJQUNGO0VBQ0YsQ0FBQztFQUNEUSxLQUFLLEVBQUU7SUFDTFYsSUFBSSxFQUFFLE9BQU87SUFDYnlHLE1BQU0sRUFBRSxDQUFDO0VBQ1g7QUFDRixDQUFDIiwiaWdub3JlTGlzdCI6W119