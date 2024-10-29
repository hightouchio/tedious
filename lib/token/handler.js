"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnexpectedTokenError = exports.TokenHandler = exports.RequestTokenHandler = exports.Login7TokenHandler = exports.InitialSqlTokenHandler = exports.AttentionTokenHandler = void 0;
var _request = _interopRequireDefault(require("../request"));
var _errors = require("../errors");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class UnexpectedTokenError extends Error {
  constructor(handler, token) {
    super('Unexpected token `' + token.name + '` in `' + handler.constructor.name + '`');
  }
}
exports.UnexpectedTokenError = UnexpectedTokenError;
class TokenHandler {
  onInfoMessage(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onErrorMessage(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onSSPI(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onDatabaseChange(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onLanguageChange(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onCharsetChange(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onSqlCollationChange(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onRoutingChange(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onPacketSizeChange(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onResetConnection(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onBeginTransaction(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onCommitTransaction(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onRollbackTransaction(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onFedAuthInfo(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onFeatureExtAck(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onLoginAck(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onColMetadata(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onOrder(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onRow(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onReturnStatus(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onReturnValue(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onDoneProc(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onDoneInProc(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onDone(token) {
    throw new UnexpectedTokenError(this, token);
  }
  onDatabaseMirroringPartner(token) {
    throw new UnexpectedTokenError(this, token);
  }
}

/**
 * A handler for tokens received in the response message to the initial SQL Batch request
 * that sets up different connection settings.
 */
exports.TokenHandler = TokenHandler;
class InitialSqlTokenHandler extends TokenHandler {
  constructor(connection) {
    super();
    this.connection = connection;
  }
  onInfoMessage(token) {
    this.connection.emit('infoMessage', token);
  }
  onErrorMessage(token) {
    this.connection.emit('errorMessage', token);
  }
  onDatabaseChange(token) {
    this.connection.emit('databaseChange', token.newValue);
  }
  onLanguageChange(token) {
    this.connection.emit('languageChange', token.newValue);
  }
  onCharsetChange(token) {
    this.connection.emit('charsetChange', token.newValue);
  }
  onSqlCollationChange(token) {
    this.connection.databaseCollation = token.newValue;
  }
  onPacketSizeChange(token) {
    this.connection.messageIo.packetSize(token.newValue);
  }
  onBeginTransaction(token) {
    this.connection.transactionDescriptors.push(token.newValue);
    this.connection.inTransaction = true;
  }
  onCommitTransaction(token) {
    this.connection.transactionDescriptors.length = 1;
    this.connection.inTransaction = false;
  }
  onRollbackTransaction(token) {
    this.connection.transactionDescriptors.length = 1;
    // An outermost transaction was rolled back. Reset the transaction counter
    this.connection.inTransaction = false;
    this.connection.emit('rollbackTransaction');
  }
  onColMetadata(token) {
    this.connection.emit('error', new Error("Received 'columnMetadata' when no sqlRequest is in progress"));
    this.connection.close();
  }
  onOrder(token) {
    this.connection.emit('error', new Error("Received 'order' when no sqlRequest is in progress"));
    this.connection.close();
  }
  onRow(token) {
    this.connection.emit('error', new Error("Received 'row' when no sqlRequest is in progress"));
    this.connection.close();
  }
  onReturnStatus(token) {
    // Do nothing
  }
  onReturnValue(token) {
    // Do nothing
  }
  onDoneProc(token) {
    // Do nothing
  }
  onDoneInProc(token) {
    // Do nothing
  }
  onDone(token) {
    // Do nothing
  }
  onResetConnection(token) {
    this.connection.emit('resetConnection');
  }
}

/**
 * A handler for tokens received in the response message to a Login7 message.
 */
exports.InitialSqlTokenHandler = InitialSqlTokenHandler;
class Login7TokenHandler extends TokenHandler {
  constructor(connection) {
    super();
    this.loginAckReceived = false;
    this.connection = connection;
  }
  onInfoMessage(token) {
    this.connection.emit('infoMessage', token);
  }
  onErrorMessage(token) {
    this.connection.emit('errorMessage', token);
    const error = new _errors.ConnectionError(token.message, 'ELOGIN');
    const isLoginErrorTransient = this.connection.transientErrorLookup.isTransientError(token.number);
    if (isLoginErrorTransient && this.connection.curTransientRetryCount !== this.connection.config.options.maxRetriesOnTransientErrors) {
      error.isTransient = true;
    }
    this.connection.loginError = error;
  }
  onSSPI(token) {
    if (token.ntlmpacket) {
      this.connection.ntlmpacket = token.ntlmpacket;
      this.connection.ntlmpacketBuffer = token.ntlmpacketBuffer;
    }
  }
  onDatabaseChange(token) {
    this.connection.emit('databaseChange', token.newValue);
  }
  onLanguageChange(token) {
    this.connection.emit('languageChange', token.newValue);
  }
  onCharsetChange(token) {
    this.connection.emit('charsetChange', token.newValue);
  }
  onSqlCollationChange(token) {
    this.connection.databaseCollation = token.newValue;
  }
  onFedAuthInfo(token) {
    this.fedAuthInfoToken = token;
  }
  onFeatureExtAck(token) {
    const {
      authentication
    } = this.connection.config;
    if (authentication.type === 'azure-active-directory-password' || authentication.type === 'azure-active-directory-access-token' || authentication.type === 'azure-active-directory-msi-vm' || authentication.type === 'azure-active-directory-msi-app-service' || authentication.type === 'azure-active-directory-service-principal-secret' || authentication.type === 'azure-active-directory-default') {
      if (token.fedAuth === undefined) {
        this.connection.loginError = new _errors.ConnectionError('Did not receive Active Directory authentication acknowledgement');
      } else if (token.fedAuth.length !== 0) {
        this.connection.loginError = new _errors.ConnectionError(`Active Directory authentication acknowledgment for ${authentication.type} authentication method includes extra data`);
      }
    } else if (token.fedAuth === undefined && token.utf8Support === undefined) {
      this.connection.loginError = new _errors.ConnectionError('Received acknowledgement for unknown feature');
    } else if (token.fedAuth) {
      this.connection.loginError = new _errors.ConnectionError('Did not request Active Directory authentication, but received the acknowledgment');
    }
  }
  onLoginAck(token) {
    if (!token.tdsVersion) {
      // unsupported TDS version
      this.connection.loginError = new _errors.ConnectionError('Server responded with unknown TDS version.', 'ETDS');
      return;
    }
    if (!token.interface) {
      // unsupported interface
      this.connection.loginError = new _errors.ConnectionError('Server responded with unsupported interface.', 'EINTERFACENOTSUPP');
      return;
    }

    // use negotiated version
    this.connection.config.options.tdsVersion = token.tdsVersion;
    this.loginAckReceived = true;
  }
  onRoutingChange(token) {
    // Removes instance name attached to the redirect url. E.g., redirect.db.net\instance1 --> redirect.db.net
    const [server] = token.newValue.server.split('\\');
    this.routingData = {
      server,
      port: token.newValue.port,
      login7server: token.newValue.server
    };
  }
  onDoneInProc(token) {
    // Do nothing
  }
  onDone(token) {
    // Do nothing
  }
  onPacketSizeChange(token) {
    this.connection.messageIo.packetSize(token.newValue);
  }
  onDatabaseMirroringPartner(token) {
    // Do nothing
  }
}

/**
 * A handler for tokens received in the response message to a RPC Request,
 * a SQL Batch Request, a Bulk Load BCP Request or a Transaction Manager Request.
 */
exports.Login7TokenHandler = Login7TokenHandler;
class RequestTokenHandler extends TokenHandler {
  constructor(connection, request) {
    super();
    this.connection = connection;
    this.request = request;
    this.errors = [];
  }
  onInfoMessage(token) {
    this.connection.emit('infoMessage', token);
  }
  onErrorMessage(token) {
    this.connection.emit('errorMessage', token);
    if (!this.request.canceled) {
      const error = new _errors.RequestError(token.message, 'EREQUEST');
      error.number = token.number;
      error.state = token.state;
      error.class = token.class;
      error.serverName = token.serverName;
      error.procName = token.procName;
      error.lineNumber = token.lineNumber;
      this.errors.push(error);
      this.request.error = error;
      if (this.request instanceof _request.default && this.errors.length > 1) {
        this.request.error = new AggregateError(this.errors);
      }
    }
  }
  onDatabaseChange(token) {
    this.connection.emit('databaseChange', token.newValue);
  }
  onLanguageChange(token) {
    this.connection.emit('languageChange', token.newValue);
  }
  onCharsetChange(token) {
    this.connection.emit('charsetChange', token.newValue);
  }
  onSqlCollationChange(token) {
    this.connection.databaseCollation = token.newValue;
  }
  onPacketSizeChange(token) {
    this.connection.messageIo.packetSize(token.newValue);
  }
  onBeginTransaction(token) {
    this.connection.transactionDescriptors.push(token.newValue);
    this.connection.inTransaction = true;
  }
  onCommitTransaction(token) {
    this.connection.transactionDescriptors.length = 1;
    this.connection.inTransaction = false;
  }
  onRollbackTransaction(token) {
    this.connection.transactionDescriptors.length = 1;
    // An outermost transaction was rolled back. Reset the transaction counter
    this.connection.inTransaction = false;
    this.connection.emit('rollbackTransaction');
  }
  onColMetadata(token) {
    if (!this.request.canceled) {
      if (this.connection.config.options.useColumnNames) {
        const columns = Object.create(null);
        for (let j = 0, len = token.columns.length; j < len; j++) {
          const col = token.columns[j];
          if (columns[col.colName] == null) {
            columns[col.colName] = col;
          }
        }
        this.request.emit('columnMetadata', columns);
      } else {
        this.request.emit('columnMetadata', token.columns);
      }
    }
  }
  onOrder(token) {
    if (!this.request.canceled) {
      this.request.emit('order', token.orderColumns);
    }
  }
  onRow(token) {
    if (!this.request.canceled) {
      if (this.connection.config.options.rowCollectionOnRequestCompletion) {
        this.request.rows.push(token.columns);
      }
      if (this.connection.config.options.rowCollectionOnDone) {
        this.request.rst.push(token.columns);
      }
      this.request.emit('row', token.columns);
    }
  }
  onReturnStatus(token) {
    if (!this.request.canceled) {
      // Keep value for passing in 'doneProc' event.
      this.connection.procReturnStatusValue = token.value;
    }
  }
  onReturnValue(token) {
    if (!this.request.canceled) {
      this.request.emit('returnValue', token.paramName, token.value, token.metadata);
    }
  }
  onDoneProc(token) {
    if (!this.request.canceled) {
      if (token.sqlError && !this.request.error) {
        // check if the DONE_ERROR flags was set, but an ERROR token was not sent.
        this.request.error = new _errors.RequestError('An unknown error has occurred.', 'UNKNOWN');
      }
      this.request.emit('doneProc', token.rowCount, token.more, this.connection.procReturnStatusValue, this.request.rst);
      this.connection.procReturnStatusValue = undefined;
      if (token.rowCount !== undefined) {
        this.request.rowCount += token.rowCount;
      }
      if (this.connection.config.options.rowCollectionOnDone) {
        this.request.rst = [];
      }
    }
  }
  onDoneInProc(token) {
    if (!this.request.canceled) {
      this.request.emit('doneInProc', token.rowCount, token.more, this.request.rst);
      if (token.rowCount !== undefined) {
        this.request.rowCount += token.rowCount;
      }
      if (this.connection.config.options.rowCollectionOnDone) {
        this.request.rst = [];
      }
    }
  }
  onDone(token) {
    if (!this.request.canceled) {
      if (token.sqlError && !this.request.error) {
        // check if the DONE_ERROR flags was set, but an ERROR token was not sent.
        this.request.error = new _errors.RequestError('An unknown error has occurred.', 'UNKNOWN');
      }
      this.request.emit('done', token.rowCount, token.more, this.request.rst);
      if (token.rowCount !== undefined) {
        this.request.rowCount += token.rowCount;
      }
      if (this.connection.config.options.rowCollectionOnDone) {
        this.request.rst = [];
      }
    }
  }
  onResetConnection(token) {
    this.connection.emit('resetConnection');
  }
}

/**
 * A handler for the attention acknowledgement message.
 *
 * This message only contains a `DONE` token that acknowledges
 * that the attention message was received by the server.
 */
exports.RequestTokenHandler = RequestTokenHandler;
class AttentionTokenHandler extends TokenHandler {
  /**
   * Returns whether an attention acknowledgement was received.
   */

  constructor(connection, request) {
    super();
    this.connection = connection;
    this.request = request;
    this.attentionReceived = false;
  }
  onDone(token) {
    if (token.attention) {
      this.attentionReceived = true;
    }
  }
}
exports.AttentionTokenHandler = AttentionTokenHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVxdWVzdCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2Vycm9ycyIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlVuZXhwZWN0ZWRUb2tlbkVycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsImhhbmRsZXIiLCJ0b2tlbiIsIm5hbWUiLCJleHBvcnRzIiwiVG9rZW5IYW5kbGVyIiwib25JbmZvTWVzc2FnZSIsIm9uRXJyb3JNZXNzYWdlIiwib25TU1BJIiwib25EYXRhYmFzZUNoYW5nZSIsIm9uTGFuZ3VhZ2VDaGFuZ2UiLCJvbkNoYXJzZXRDaGFuZ2UiLCJvblNxbENvbGxhdGlvbkNoYW5nZSIsIm9uUm91dGluZ0NoYW5nZSIsIm9uUGFja2V0U2l6ZUNoYW5nZSIsIm9uUmVzZXRDb25uZWN0aW9uIiwib25CZWdpblRyYW5zYWN0aW9uIiwib25Db21taXRUcmFuc2FjdGlvbiIsIm9uUm9sbGJhY2tUcmFuc2FjdGlvbiIsIm9uRmVkQXV0aEluZm8iLCJvbkZlYXR1cmVFeHRBY2siLCJvbkxvZ2luQWNrIiwib25Db2xNZXRhZGF0YSIsIm9uT3JkZXIiLCJvblJvdyIsIm9uUmV0dXJuU3RhdHVzIiwib25SZXR1cm5WYWx1ZSIsIm9uRG9uZVByb2MiLCJvbkRvbmVJblByb2MiLCJvbkRvbmUiLCJvbkRhdGFiYXNlTWlycm9yaW5nUGFydG5lciIsIkluaXRpYWxTcWxUb2tlbkhhbmRsZXIiLCJjb25uZWN0aW9uIiwiZW1pdCIsIm5ld1ZhbHVlIiwiZGF0YWJhc2VDb2xsYXRpb24iLCJtZXNzYWdlSW8iLCJwYWNrZXRTaXplIiwidHJhbnNhY3Rpb25EZXNjcmlwdG9ycyIsInB1c2giLCJpblRyYW5zYWN0aW9uIiwibGVuZ3RoIiwiY2xvc2UiLCJMb2dpbjdUb2tlbkhhbmRsZXIiLCJsb2dpbkFja1JlY2VpdmVkIiwiZXJyb3IiLCJDb25uZWN0aW9uRXJyb3IiLCJtZXNzYWdlIiwiaXNMb2dpbkVycm9yVHJhbnNpZW50IiwidHJhbnNpZW50RXJyb3JMb29rdXAiLCJpc1RyYW5zaWVudEVycm9yIiwibnVtYmVyIiwiY3VyVHJhbnNpZW50UmV0cnlDb3VudCIsImNvbmZpZyIsIm9wdGlvbnMiLCJtYXhSZXRyaWVzT25UcmFuc2llbnRFcnJvcnMiLCJpc1RyYW5zaWVudCIsImxvZ2luRXJyb3IiLCJudGxtcGFja2V0IiwibnRsbXBhY2tldEJ1ZmZlciIsImZlZEF1dGhJbmZvVG9rZW4iLCJhdXRoZW50aWNhdGlvbiIsInR5cGUiLCJmZWRBdXRoIiwidW5kZWZpbmVkIiwidXRmOFN1cHBvcnQiLCJ0ZHNWZXJzaW9uIiwiaW50ZXJmYWNlIiwic2VydmVyIiwic3BsaXQiLCJyb3V0aW5nRGF0YSIsInBvcnQiLCJsb2dpbjdzZXJ2ZXIiLCJSZXF1ZXN0VG9rZW5IYW5kbGVyIiwicmVxdWVzdCIsImVycm9ycyIsImNhbmNlbGVkIiwiUmVxdWVzdEVycm9yIiwic3RhdGUiLCJjbGFzcyIsInNlcnZlck5hbWUiLCJwcm9jTmFtZSIsImxpbmVOdW1iZXIiLCJSZXF1ZXN0IiwiQWdncmVnYXRlRXJyb3IiLCJ1c2VDb2x1bW5OYW1lcyIsImNvbHVtbnMiLCJPYmplY3QiLCJjcmVhdGUiLCJqIiwibGVuIiwiY29sIiwiY29sTmFtZSIsIm9yZGVyQ29sdW1ucyIsInJvd0NvbGxlY3Rpb25PblJlcXVlc3RDb21wbGV0aW9uIiwicm93cyIsInJvd0NvbGxlY3Rpb25PbkRvbmUiLCJyc3QiLCJwcm9jUmV0dXJuU3RhdHVzVmFsdWUiLCJ2YWx1ZSIsInBhcmFtTmFtZSIsIm1ldGFkYXRhIiwic3FsRXJyb3IiLCJyb3dDb3VudCIsIm1vcmUiLCJBdHRlbnRpb25Ub2tlbkhhbmRsZXIiLCJhdHRlbnRpb25SZWNlaXZlZCIsImF0dGVudGlvbiJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbi9oYW5kbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb25uZWN0aW9uIGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IFJlcXVlc3QgZnJvbSAnLi4vcmVxdWVzdCc7XG5pbXBvcnQgeyBDb25uZWN0aW9uRXJyb3IsIFJlcXVlc3RFcnJvciB9IGZyb20gJy4uL2Vycm9ycyc7XG5pbXBvcnQgeyB0eXBlIENvbHVtbk1ldGFkYXRhIH0gZnJvbSAnLi9jb2xtZXRhZGF0YS10b2tlbi1wYXJzZXInO1xuaW1wb3J0IHtcbiAgQmVnaW5UcmFuc2FjdGlvbkVudkNoYW5nZVRva2VuLFxuICBDaGFyc2V0RW52Q2hhbmdlVG9rZW4sXG4gIENvbGxhdGlvbkNoYW5nZVRva2VuLFxuICBDb2xNZXRhZGF0YVRva2VuLFxuICBDb21taXRUcmFuc2FjdGlvbkVudkNoYW5nZVRva2VuLFxuICBEYXRhYmFzZUVudkNoYW5nZVRva2VuLFxuICBEYXRhYmFzZU1pcnJvcmluZ1BhcnRuZXJFbnZDaGFuZ2VUb2tlbixcbiAgRG9uZUluUHJvY1Rva2VuLFxuICBEb25lUHJvY1Rva2VuLFxuICBEb25lVG9rZW4sXG4gIEVycm9yTWVzc2FnZVRva2VuLFxuICBGZWF0dXJlRXh0QWNrVG9rZW4sXG4gIEZlZEF1dGhJbmZvVG9rZW4sXG4gIEluZm9NZXNzYWdlVG9rZW4sXG4gIExhbmd1YWdlRW52Q2hhbmdlVG9rZW4sXG4gIExvZ2luQWNrVG9rZW4sXG4gIE5CQ1Jvd1Rva2VuLFxuICBPcmRlclRva2VuLFxuICBQYWNrZXRTaXplRW52Q2hhbmdlVG9rZW4sXG4gIFJlc2V0Q29ubmVjdGlvbkVudkNoYW5nZVRva2VuLFxuICBSZXR1cm5TdGF0dXNUb2tlbixcbiAgUmV0dXJuVmFsdWVUb2tlbixcbiAgUm9sbGJhY2tUcmFuc2FjdGlvbkVudkNoYW5nZVRva2VuLFxuICBSb3V0aW5nRW52Q2hhbmdlVG9rZW4sXG4gIFJvd1Rva2VuLFxuICBTU1BJVG9rZW4sXG4gIFRva2VuXG59IGZyb20gJy4vdG9rZW4nO1xuaW1wb3J0IEJ1bGtMb2FkIGZyb20gJy4uL2J1bGstbG9hZCc7XG5cbmV4cG9ydCBjbGFzcyBVbmV4cGVjdGVkVG9rZW5FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoaGFuZGxlcjogVG9rZW5IYW5kbGVyLCB0b2tlbjogVG9rZW4pIHtcbiAgICBzdXBlcignVW5leHBlY3RlZCB0b2tlbiBgJyArIHRva2VuLm5hbWUgKyAnYCBpbiBgJyArIGhhbmRsZXIuY29uc3RydWN0b3IubmFtZSArICdgJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRva2VuSGFuZGxlciB7XG4gIG9uSW5mb01lc3NhZ2UodG9rZW46IEluZm9NZXNzYWdlVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25FcnJvck1lc3NhZ2UodG9rZW46IEVycm9yTWVzc2FnZVRva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uU1NQSSh0b2tlbjogU1NQSVRva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uRGF0YWJhc2VDaGFuZ2UodG9rZW46IERhdGFiYXNlRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25MYW5ndWFnZUNoYW5nZSh0b2tlbjogTGFuZ3VhZ2VFbnZDaGFuZ2VUb2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cblxuICBvbkNoYXJzZXRDaGFuZ2UodG9rZW46IENoYXJzZXRFbnZDaGFuZ2VUb2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cblxuICBvblNxbENvbGxhdGlvbkNoYW5nZSh0b2tlbjogQ29sbGF0aW9uQ2hhbmdlVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25Sb3V0aW5nQ2hhbmdlKHRva2VuOiBSb3V0aW5nRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25QYWNrZXRTaXplQ2hhbmdlKHRva2VuOiBQYWNrZXRTaXplRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25SZXNldENvbm5lY3Rpb24odG9rZW46IFJlc2V0Q29ubmVjdGlvbkVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uQmVnaW5UcmFuc2FjdGlvbih0b2tlbjogQmVnaW5UcmFuc2FjdGlvbkVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uQ29tbWl0VHJhbnNhY3Rpb24odG9rZW46IENvbW1pdFRyYW5zYWN0aW9uRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25Sb2xsYmFja1RyYW5zYWN0aW9uKHRva2VuOiBSb2xsYmFja1RyYW5zYWN0aW9uRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25GZWRBdXRoSW5mbyh0b2tlbjogRmVkQXV0aEluZm9Ub2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cblxuICBvbkZlYXR1cmVFeHRBY2sodG9rZW46IEZlYXR1cmVFeHRBY2tUb2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cblxuICBvbkxvZ2luQWNrKHRva2VuOiBMb2dpbkFja1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uQ29sTWV0YWRhdGEodG9rZW46IENvbE1ldGFkYXRhVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25PcmRlcih0b2tlbjogT3JkZXJUb2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cblxuICBvblJvdyh0b2tlbjogUm93VG9rZW4gfCBOQkNSb3dUb2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cblxuICBvblJldHVyblN0YXR1cyh0b2tlbjogUmV0dXJuU3RhdHVzVG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5leHBlY3RlZFRva2VuRXJyb3IodGhpcywgdG9rZW4pO1xuICB9XG5cbiAgb25SZXR1cm5WYWx1ZSh0b2tlbjogUmV0dXJuVmFsdWVUb2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cblxuICBvbkRvbmVQcm9jKHRva2VuOiBEb25lUHJvY1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uRG9uZUluUHJvYyh0b2tlbjogRG9uZUluUHJvY1Rva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uRG9uZSh0b2tlbjogRG9uZVRva2VuKSB7XG4gICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRUb2tlbkVycm9yKHRoaXMsIHRva2VuKTtcbiAgfVxuXG4gIG9uRGF0YWJhc2VNaXJyb3JpbmdQYXJ0bmVyKHRva2VuOiBEYXRhYmFzZU1pcnJvcmluZ1BhcnRuZXJFbnZDaGFuZ2VUb2tlbikge1xuICAgIHRocm93IG5ldyBVbmV4cGVjdGVkVG9rZW5FcnJvcih0aGlzLCB0b2tlbik7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGhhbmRsZXIgZm9yIHRva2VucyByZWNlaXZlZCBpbiB0aGUgcmVzcG9uc2UgbWVzc2FnZSB0byB0aGUgaW5pdGlhbCBTUUwgQmF0Y2ggcmVxdWVzdFxuICogdGhhdCBzZXRzIHVwIGRpZmZlcmVudCBjb25uZWN0aW9uIHNldHRpbmdzLlxuICovXG5leHBvcnQgY2xhc3MgSW5pdGlhbFNxbFRva2VuSGFuZGxlciBleHRlbmRzIFRva2VuSGFuZGxlciB7XG4gIGRlY2xhcmUgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBDb25uZWN0aW9uKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gIH1cblxuICBvbkluZm9NZXNzYWdlKHRva2VuOiBJbmZvTWVzc2FnZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ2luZm9NZXNzYWdlJywgdG9rZW4pO1xuICB9XG5cbiAgb25FcnJvck1lc3NhZ2UodG9rZW46IEVycm9yTWVzc2FnZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ2Vycm9yTWVzc2FnZScsIHRva2VuKTtcbiAgfVxuXG4gIG9uRGF0YWJhc2VDaGFuZ2UodG9rZW46IERhdGFiYXNlRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgnZGF0YWJhc2VDaGFuZ2UnLCB0b2tlbi5uZXdWYWx1ZSk7XG4gIH1cblxuICBvbkxhbmd1YWdlQ2hhbmdlKHRva2VuOiBMYW5ndWFnZUVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ2xhbmd1YWdlQ2hhbmdlJywgdG9rZW4ubmV3VmFsdWUpO1xuICB9XG5cbiAgb25DaGFyc2V0Q2hhbmdlKHRva2VuOiBDaGFyc2V0RW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgnY2hhcnNldENoYW5nZScsIHRva2VuLm5ld1ZhbHVlKTtcbiAgfVxuXG4gIG9uU3FsQ29sbGF0aW9uQ2hhbmdlKHRva2VuOiBDb2xsYXRpb25DaGFuZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5kYXRhYmFzZUNvbGxhdGlvbiA9IHRva2VuLm5ld1ZhbHVlO1xuICB9XG5cbiAgb25QYWNrZXRTaXplQ2hhbmdlKHRva2VuOiBQYWNrZXRTaXplRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24ubWVzc2FnZUlvLnBhY2tldFNpemUodG9rZW4ubmV3VmFsdWUpO1xuICB9XG5cbiAgb25CZWdpblRyYW5zYWN0aW9uKHRva2VuOiBCZWdpblRyYW5zYWN0aW9uRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24udHJhbnNhY3Rpb25EZXNjcmlwdG9ycy5wdXNoKHRva2VuLm5ld1ZhbHVlKTtcbiAgICB0aGlzLmNvbm5lY3Rpb24uaW5UcmFuc2FjdGlvbiA9IHRydWU7XG4gIH1cblxuICBvbkNvbW1pdFRyYW5zYWN0aW9uKHRva2VuOiBDb21taXRUcmFuc2FjdGlvbkVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLnRyYW5zYWN0aW9uRGVzY3JpcHRvcnMubGVuZ3RoID0gMTtcbiAgICB0aGlzLmNvbm5lY3Rpb24uaW5UcmFuc2FjdGlvbiA9IGZhbHNlO1xuICB9XG5cbiAgb25Sb2xsYmFja1RyYW5zYWN0aW9uKHRva2VuOiBSb2xsYmFja1RyYW5zYWN0aW9uRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24udHJhbnNhY3Rpb25EZXNjcmlwdG9ycy5sZW5ndGggPSAxO1xuICAgIC8vIEFuIG91dGVybW9zdCB0cmFuc2FjdGlvbiB3YXMgcm9sbGVkIGJhY2suIFJlc2V0IHRoZSB0cmFuc2FjdGlvbiBjb3VudGVyXG4gICAgdGhpcy5jb25uZWN0aW9uLmluVHJhbnNhY3Rpb24gPSBmYWxzZTtcbiAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgncm9sbGJhY2tUcmFuc2FjdGlvbicpO1xuICB9XG5cbiAgb25Db2xNZXRhZGF0YSh0b2tlbjogQ29sTWV0YWRhdGFUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihcIlJlY2VpdmVkICdjb2x1bW5NZXRhZGF0YScgd2hlbiBubyBzcWxSZXF1ZXN0IGlzIGluIHByb2dyZXNzXCIpKTtcbiAgICB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgfVxuXG4gIG9uT3JkZXIodG9rZW46IE9yZGVyVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoXCJSZWNlaXZlZCAnb3JkZXInIHdoZW4gbm8gc3FsUmVxdWVzdCBpcyBpbiBwcm9ncmVzc1wiKSk7XG4gICAgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG4gIH1cblxuICBvblJvdyh0b2tlbjogUm93VG9rZW4gfCBOQkNSb3dUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihcIlJlY2VpdmVkICdyb3cnIHdoZW4gbm8gc3FsUmVxdWVzdCBpcyBpbiBwcm9ncmVzc1wiKSk7XG4gICAgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG4gIH1cblxuICBvblJldHVyblN0YXR1cyh0b2tlbjogUmV0dXJuU3RhdHVzVG9rZW4pIHtcbiAgICAvLyBEbyBub3RoaW5nXG4gIH1cblxuICBvblJldHVyblZhbHVlKHRva2VuOiBSZXR1cm5WYWx1ZVRva2VuKSB7XG4gICAgLy8gRG8gbm90aGluZ1xuICB9XG5cbiAgb25Eb25lUHJvYyh0b2tlbjogRG9uZVByb2NUb2tlbikge1xuICAgIC8vIERvIG5vdGhpbmdcbiAgfVxuXG4gIG9uRG9uZUluUHJvYyh0b2tlbjogRG9uZUluUHJvY1Rva2VuKSB7XG4gICAgLy8gRG8gbm90aGluZ1xuICB9XG5cbiAgb25Eb25lKHRva2VuOiBEb25lVG9rZW4pIHtcbiAgICAvLyBEbyBub3RoaW5nXG4gIH1cblxuICBvblJlc2V0Q29ubmVjdGlvbih0b2tlbjogUmVzZXRDb25uZWN0aW9uRW52Q2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24uZW1pdCgncmVzZXRDb25uZWN0aW9uJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGhhbmRsZXIgZm9yIHRva2VucyByZWNlaXZlZCBpbiB0aGUgcmVzcG9uc2UgbWVzc2FnZSB0byBhIExvZ2luNyBtZXNzYWdlLlxuICovXG5leHBvcnQgY2xhc3MgTG9naW43VG9rZW5IYW5kbGVyIGV4dGVuZHMgVG9rZW5IYW5kbGVyIHtcbiAgZGVjbGFyZSBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuXG4gIGRlY2xhcmUgZmVkQXV0aEluZm9Ub2tlbjogRmVkQXV0aEluZm9Ub2tlbiB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSByb3V0aW5nRGF0YTogeyBzZXJ2ZXI6IHN0cmluZywgcG9ydDogbnVtYmVyLCBsb2dpbjdzZXJ2ZXI6IHN0cmluZyB9IHwgdW5kZWZpbmVkO1xuXG4gIGRlY2xhcmUgbG9naW5BY2tSZWNlaXZlZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uOiBDb25uZWN0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmxvZ2luQWNrUmVjZWl2ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICB9XG5cbiAgb25JbmZvTWVzc2FnZSh0b2tlbjogSW5mb01lc3NhZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdpbmZvTWVzc2FnZScsIHRva2VuKTtcbiAgfVxuXG4gIG9uRXJyb3JNZXNzYWdlKHRva2VuOiBFcnJvck1lc3NhZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdlcnJvck1lc3NhZ2UnLCB0b2tlbik7XG5cbiAgICBjb25zdCBlcnJvciA9IG5ldyBDb25uZWN0aW9uRXJyb3IodG9rZW4ubWVzc2FnZSwgJ0VMT0dJTicpO1xuXG4gICAgY29uc3QgaXNMb2dpbkVycm9yVHJhbnNpZW50ID0gdGhpcy5jb25uZWN0aW9uLnRyYW5zaWVudEVycm9yTG9va3VwLmlzVHJhbnNpZW50RXJyb3IodG9rZW4ubnVtYmVyKTtcbiAgICBpZiAoaXNMb2dpbkVycm9yVHJhbnNpZW50ICYmIHRoaXMuY29ubmVjdGlvbi5jdXJUcmFuc2llbnRSZXRyeUNvdW50ICE9PSB0aGlzLmNvbm5lY3Rpb24uY29uZmlnLm9wdGlvbnMubWF4UmV0cmllc09uVHJhbnNpZW50RXJyb3JzKSB7XG4gICAgICBlcnJvci5pc1RyYW5zaWVudCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0aW9uLmxvZ2luRXJyb3IgPSBlcnJvcjtcbiAgfVxuXG4gIG9uU1NQSSh0b2tlbjogU1NQSVRva2VuKSB7XG4gICAgaWYgKHRva2VuLm50bG1wYWNrZXQpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbi5udGxtcGFja2V0ID0gdG9rZW4ubnRsbXBhY2tldDtcbiAgICAgIHRoaXMuY29ubmVjdGlvbi5udGxtcGFja2V0QnVmZmVyID0gdG9rZW4ubnRsbXBhY2tldEJ1ZmZlcjtcbiAgICB9XG4gIH1cblxuICBvbkRhdGFiYXNlQ2hhbmdlKHRva2VuOiBEYXRhYmFzZUVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ2RhdGFiYXNlQ2hhbmdlJywgdG9rZW4ubmV3VmFsdWUpO1xuICB9XG5cbiAgb25MYW5ndWFnZUNoYW5nZSh0b2tlbjogTGFuZ3VhZ2VFbnZDaGFuZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdsYW5ndWFnZUNoYW5nZScsIHRva2VuLm5ld1ZhbHVlKTtcbiAgfVxuXG4gIG9uQ2hhcnNldENoYW5nZSh0b2tlbjogQ2hhcnNldEVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ2NoYXJzZXRDaGFuZ2UnLCB0b2tlbi5uZXdWYWx1ZSk7XG4gIH1cblxuICBvblNxbENvbGxhdGlvbkNoYW5nZSh0b2tlbjogQ29sbGF0aW9uQ2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24uZGF0YWJhc2VDb2xsYXRpb24gPSB0b2tlbi5uZXdWYWx1ZTtcbiAgfVxuXG4gIG9uRmVkQXV0aEluZm8odG9rZW46IEZlZEF1dGhJbmZvVG9rZW4pIHtcbiAgICB0aGlzLmZlZEF1dGhJbmZvVG9rZW4gPSB0b2tlbjtcbiAgfVxuXG4gIG9uRmVhdHVyZUV4dEFjayh0b2tlbjogRmVhdHVyZUV4dEFja1Rva2VuKSB7XG4gICAgY29uc3QgeyBhdXRoZW50aWNhdGlvbiB9ID0gdGhpcy5jb25uZWN0aW9uLmNvbmZpZztcblxuICAgIGlmIChhdXRoZW50aWNhdGlvbi50eXBlID09PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZCcgfHwgYXV0aGVudGljYXRpb24udHlwZSA9PT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktYWNjZXNzLXRva2VuJyB8fCBhdXRoZW50aWNhdGlvbi50eXBlID09PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktdm0nIHx8IGF1dGhlbnRpY2F0aW9uLnR5cGUgPT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZScgfHwgYXV0aGVudGljYXRpb24udHlwZSA9PT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3Rvcnktc2VydmljZS1wcmluY2lwYWwtc2VjcmV0JyB8fCBhdXRoZW50aWNhdGlvbi50eXBlID09PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1kZWZhdWx0Jykge1xuICAgICAgaWYgKHRva2VuLmZlZEF1dGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ubG9naW5FcnJvciA9IG5ldyBDb25uZWN0aW9uRXJyb3IoJ0RpZCBub3QgcmVjZWl2ZSBBY3RpdmUgRGlyZWN0b3J5IGF1dGhlbnRpY2F0aW9uIGFja25vd2xlZGdlbWVudCcpO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi5mZWRBdXRoLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ubG9naW5FcnJvciA9IG5ldyBDb25uZWN0aW9uRXJyb3IoYEFjdGl2ZSBEaXJlY3RvcnkgYXV0aGVudGljYXRpb24gYWNrbm93bGVkZ21lbnQgZm9yICR7YXV0aGVudGljYXRpb24udHlwZX0gYXV0aGVudGljYXRpb24gbWV0aG9kIGluY2x1ZGVzIGV4dHJhIGRhdGFgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRva2VuLmZlZEF1dGggPT09IHVuZGVmaW5lZCAmJiB0b2tlbi51dGY4U3VwcG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24ubG9naW5FcnJvciA9IG5ldyBDb25uZWN0aW9uRXJyb3IoJ1JlY2VpdmVkIGFja25vd2xlZGdlbWVudCBmb3IgdW5rbm93biBmZWF0dXJlJyk7XG4gICAgfSBlbHNlIGlmICh0b2tlbi5mZWRBdXRoKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24ubG9naW5FcnJvciA9IG5ldyBDb25uZWN0aW9uRXJyb3IoJ0RpZCBub3QgcmVxdWVzdCBBY3RpdmUgRGlyZWN0b3J5IGF1dGhlbnRpY2F0aW9uLCBidXQgcmVjZWl2ZWQgdGhlIGFja25vd2xlZGdtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgb25Mb2dpbkFjayh0b2tlbjogTG9naW5BY2tUb2tlbikge1xuICAgIGlmICghdG9rZW4udGRzVmVyc2lvbikge1xuICAgICAgLy8gdW5zdXBwb3J0ZWQgVERTIHZlcnNpb25cbiAgICAgIHRoaXMuY29ubmVjdGlvbi5sb2dpbkVycm9yID0gbmV3IENvbm5lY3Rpb25FcnJvcignU2VydmVyIHJlc3BvbmRlZCB3aXRoIHVua25vd24gVERTIHZlcnNpb24uJywgJ0VURFMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRva2VuLmludGVyZmFjZSkge1xuICAgICAgLy8gdW5zdXBwb3J0ZWQgaW50ZXJmYWNlXG4gICAgICB0aGlzLmNvbm5lY3Rpb24ubG9naW5FcnJvciA9IG5ldyBDb25uZWN0aW9uRXJyb3IoJ1NlcnZlciByZXNwb25kZWQgd2l0aCB1bnN1cHBvcnRlZCBpbnRlcmZhY2UuJywgJ0VJTlRFUkZBQ0VOT1RTVVBQJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdXNlIG5lZ290aWF0ZWQgdmVyc2lvblxuICAgIHRoaXMuY29ubmVjdGlvbi5jb25maWcub3B0aW9ucy50ZHNWZXJzaW9uID0gdG9rZW4udGRzVmVyc2lvbjtcblxuICAgIHRoaXMubG9naW5BY2tSZWNlaXZlZCA9IHRydWU7XG4gIH1cblxuICBvblJvdXRpbmdDaGFuZ2UodG9rZW46IFJvdXRpbmdFbnZDaGFuZ2VUb2tlbikge1xuICAgIC8vIFJlbW92ZXMgaW5zdGFuY2UgbmFtZSBhdHRhY2hlZCB0byB0aGUgcmVkaXJlY3QgdXJsLiBFLmcuLCByZWRpcmVjdC5kYi5uZXRcXGluc3RhbmNlMSAtLT4gcmVkaXJlY3QuZGIubmV0XG4gICAgY29uc3QgWyBzZXJ2ZXIgXSA9IHRva2VuLm5ld1ZhbHVlLnNlcnZlci5zcGxpdCgnXFxcXCcpO1xuXG4gICAgdGhpcy5yb3V0aW5nRGF0YSA9IHtcbiAgICAgIHNlcnZlciwgcG9ydDogdG9rZW4ubmV3VmFsdWUucG9ydCwgbG9naW43c2VydmVyOiB0b2tlbi5uZXdWYWx1ZS5zZXJ2ZXJcbiAgICB9O1xuICB9XG5cbiAgb25Eb25lSW5Qcm9jKHRva2VuOiBEb25lSW5Qcm9jVG9rZW4pIHtcbiAgICAvLyBEbyBub3RoaW5nXG4gIH1cblxuICBvbkRvbmUodG9rZW46IERvbmVUb2tlbikge1xuICAgIC8vIERvIG5vdGhpbmdcbiAgfVxuXG4gIG9uUGFja2V0U2l6ZUNoYW5nZSh0b2tlbjogUGFja2V0U2l6ZUVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLm1lc3NhZ2VJby5wYWNrZXRTaXplKHRva2VuLm5ld1ZhbHVlKTtcbiAgfVxuXG4gIG9uRGF0YWJhc2VNaXJyb3JpbmdQYXJ0bmVyKHRva2VuOiBEYXRhYmFzZU1pcnJvcmluZ1BhcnRuZXJFbnZDaGFuZ2VUb2tlbikge1xuICAgIC8vIERvIG5vdGhpbmdcbiAgfVxufVxuXG4vKipcbiAqIEEgaGFuZGxlciBmb3IgdG9rZW5zIHJlY2VpdmVkIGluIHRoZSByZXNwb25zZSBtZXNzYWdlIHRvIGEgUlBDIFJlcXVlc3QsXG4gKiBhIFNRTCBCYXRjaCBSZXF1ZXN0LCBhIEJ1bGsgTG9hZCBCQ1AgUmVxdWVzdCBvciBhIFRyYW5zYWN0aW9uIE1hbmFnZXIgUmVxdWVzdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlcXVlc3RUb2tlbkhhbmRsZXIgZXh0ZW5kcyBUb2tlbkhhbmRsZXIge1xuICBkZWNsYXJlIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XG4gIGRlY2xhcmUgcmVxdWVzdDogUmVxdWVzdCB8IEJ1bGtMb2FkO1xuICBkZWNsYXJlIGVycm9yczogUmVxdWVzdEVycm9yW107XG5cbiAgY29uc3RydWN0b3IoY29ubmVjdGlvbjogQ29ubmVjdGlvbiwgcmVxdWVzdDogUmVxdWVzdCB8IEJ1bGtMb2FkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICB9XG5cbiAgb25JbmZvTWVzc2FnZSh0b2tlbjogSW5mb01lc3NhZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdpbmZvTWVzc2FnZScsIHRva2VuKTtcbiAgfVxuXG4gIG9uRXJyb3JNZXNzYWdlKHRva2VuOiBFcnJvck1lc3NhZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdlcnJvck1lc3NhZ2UnLCB0b2tlbik7XG5cbiAgICBpZiAoIXRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgUmVxdWVzdEVycm9yKHRva2VuLm1lc3NhZ2UsICdFUkVRVUVTVCcpO1xuXG4gICAgICBlcnJvci5udW1iZXIgPSB0b2tlbi5udW1iZXI7XG4gICAgICBlcnJvci5zdGF0ZSA9IHRva2VuLnN0YXRlO1xuICAgICAgZXJyb3IuY2xhc3MgPSB0b2tlbi5jbGFzcztcbiAgICAgIGVycm9yLnNlcnZlck5hbWUgPSB0b2tlbi5zZXJ2ZXJOYW1lO1xuICAgICAgZXJyb3IucHJvY05hbWUgPSB0b2tlbi5wcm9jTmFtZTtcbiAgICAgIGVycm9yLmxpbmVOdW1iZXIgPSB0b2tlbi5saW5lTnVtYmVyO1xuICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgICB0aGlzLnJlcXVlc3QuZXJyb3IgPSBlcnJvcjtcbiAgICAgIGlmICh0aGlzLnJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0ICYmIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0LmVycm9yID0gbmV3IEFnZ3JlZ2F0ZUVycm9yKHRoaXMuZXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkRhdGFiYXNlQ2hhbmdlKHRva2VuOiBEYXRhYmFzZUVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ2RhdGFiYXNlQ2hhbmdlJywgdG9rZW4ubmV3VmFsdWUpO1xuICB9XG5cbiAgb25MYW5ndWFnZUNoYW5nZSh0b2tlbjogTGFuZ3VhZ2VFbnZDaGFuZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdsYW5ndWFnZUNoYW5nZScsIHRva2VuLm5ld1ZhbHVlKTtcbiAgfVxuXG4gIG9uQ2hhcnNldENoYW5nZSh0b2tlbjogQ2hhcnNldEVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ2NoYXJzZXRDaGFuZ2UnLCB0b2tlbi5uZXdWYWx1ZSk7XG4gIH1cblxuICBvblNxbENvbGxhdGlvbkNoYW5nZSh0b2tlbjogQ29sbGF0aW9uQ2hhbmdlVG9rZW4pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24uZGF0YWJhc2VDb2xsYXRpb24gPSB0b2tlbi5uZXdWYWx1ZTtcbiAgfVxuXG4gIG9uUGFja2V0U2l6ZUNoYW5nZSh0b2tlbjogUGFja2V0U2l6ZUVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLm1lc3NhZ2VJby5wYWNrZXRTaXplKHRva2VuLm5ld1ZhbHVlKTtcbiAgfVxuXG4gIG9uQmVnaW5UcmFuc2FjdGlvbih0b2tlbjogQmVnaW5UcmFuc2FjdGlvbkVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLnRyYW5zYWN0aW9uRGVzY3JpcHRvcnMucHVzaCh0b2tlbi5uZXdWYWx1ZSk7XG4gICAgdGhpcy5jb25uZWN0aW9uLmluVHJhbnNhY3Rpb24gPSB0cnVlO1xuICB9XG5cbiAgb25Db21taXRUcmFuc2FjdGlvbih0b2tlbjogQ29tbWl0VHJhbnNhY3Rpb25FbnZDaGFuZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi50cmFuc2FjdGlvbkRlc2NyaXB0b3JzLmxlbmd0aCA9IDE7XG4gICAgdGhpcy5jb25uZWN0aW9uLmluVHJhbnNhY3Rpb24gPSBmYWxzZTtcbiAgfVxuXG4gIG9uUm9sbGJhY2tUcmFuc2FjdGlvbih0b2tlbjogUm9sbGJhY2tUcmFuc2FjdGlvbkVudkNoYW5nZVRva2VuKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uLnRyYW5zYWN0aW9uRGVzY3JpcHRvcnMubGVuZ3RoID0gMTtcbiAgICAvLyBBbiBvdXRlcm1vc3QgdHJhbnNhY3Rpb24gd2FzIHJvbGxlZCBiYWNrLiBSZXNldCB0aGUgdHJhbnNhY3Rpb24gY291bnRlclxuICAgIHRoaXMuY29ubmVjdGlvbi5pblRyYW5zYWN0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5jb25uZWN0aW9uLmVtaXQoJ3JvbGxiYWNrVHJhbnNhY3Rpb24nKTtcbiAgfVxuXG4gIG9uQ29sTWV0YWRhdGEodG9rZW46IENvbE1ldGFkYXRhVG9rZW4pIHtcbiAgICBpZiAoIXRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbi5jb25maWcub3B0aW9ucy51c2VDb2x1bW5OYW1lcykge1xuICAgICAgICBjb25zdCBjb2x1bW5zOiB7IFtrZXk6IHN0cmluZ106IENvbHVtbk1ldGFkYXRhIH0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSB0b2tlbi5jb2x1bW5zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgY29uc3QgY29sID0gdG9rZW4uY29sdW1uc1tqXTtcbiAgICAgICAgICBpZiAoY29sdW1uc1tjb2wuY29sTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgY29sdW1uc1tjb2wuY29sTmFtZV0gPSBjb2w7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0LmVtaXQoJ2NvbHVtbk1ldGFkYXRhJywgY29sdW1ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlcXVlc3QuZW1pdCgnY29sdW1uTWV0YWRhdGEnLCB0b2tlbi5jb2x1bW5zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk9yZGVyKHRva2VuOiBPcmRlclRva2VuKSB7XG4gICAgaWYgKCF0aGlzLnJlcXVlc3QuY2FuY2VsZWQpIHtcbiAgICAgIHRoaXMucmVxdWVzdC5lbWl0KCdvcmRlcicsIHRva2VuLm9yZGVyQ29sdW1ucyk7XG4gICAgfVxuICB9XG5cbiAgb25Sb3codG9rZW46IFJvd1Rva2VuIHwgTkJDUm93VG9rZW4pIHtcbiAgICBpZiAoIXRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbi5jb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25SZXF1ZXN0Q29tcGxldGlvbikge1xuICAgICAgICB0aGlzLnJlcXVlc3Qucm93cyEucHVzaCh0b2tlbi5jb2x1bW5zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbi5jb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25Eb25lKSB7XG4gICAgICAgIHRoaXMucmVxdWVzdC5yc3QhLnB1c2godG9rZW4uY29sdW1ucyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVxdWVzdC5lbWl0KCdyb3cnLCB0b2tlbi5jb2x1bW5zKTtcbiAgICB9XG4gIH1cblxuICBvblJldHVyblN0YXR1cyh0b2tlbjogUmV0dXJuU3RhdHVzVG9rZW4pIHtcbiAgICBpZiAoIXRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgLy8gS2VlcCB2YWx1ZSBmb3IgcGFzc2luZyBpbiAnZG9uZVByb2MnIGV2ZW50LlxuICAgICAgdGhpcy5jb25uZWN0aW9uLnByb2NSZXR1cm5TdGF0dXNWYWx1ZSA9IHRva2VuLnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG9uUmV0dXJuVmFsdWUodG9rZW46IFJldHVyblZhbHVlVG9rZW4pIHtcbiAgICBpZiAoIXRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgdGhpcy5yZXF1ZXN0LmVtaXQoJ3JldHVyblZhbHVlJywgdG9rZW4ucGFyYW1OYW1lLCB0b2tlbi52YWx1ZSwgdG9rZW4ubWV0YWRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIG9uRG9uZVByb2ModG9rZW46IERvbmVQcm9jVG9rZW4pIHtcbiAgICBpZiAoIXRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgaWYgKHRva2VuLnNxbEVycm9yICYmICF0aGlzLnJlcXVlc3QuZXJyb3IpIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIERPTkVfRVJST1IgZmxhZ3Mgd2FzIHNldCwgYnV0IGFuIEVSUk9SIHRva2VuIHdhcyBub3Qgc2VudC5cbiAgICAgICAgdGhpcy5yZXF1ZXN0LmVycm9yID0gbmV3IFJlcXVlc3RFcnJvcignQW4gdW5rbm93biBlcnJvciBoYXMgb2NjdXJyZWQuJywgJ1VOS05PV04nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXF1ZXN0LmVtaXQoJ2RvbmVQcm9jJywgdG9rZW4ucm93Q291bnQsIHRva2VuLm1vcmUsIHRoaXMuY29ubmVjdGlvbi5wcm9jUmV0dXJuU3RhdHVzVmFsdWUsIHRoaXMucmVxdWVzdC5yc3QpO1xuXG4gICAgICB0aGlzLmNvbm5lY3Rpb24ucHJvY1JldHVyblN0YXR1c1ZhbHVlID0gdW5kZWZpbmVkO1xuXG4gICAgICBpZiAodG9rZW4ucm93Q291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJlcXVlc3Qucm93Q291bnQhICs9IHRva2VuLnJvd0NvdW50O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uLmNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmUpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0LnJzdCA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uRG9uZUluUHJvYyh0b2tlbjogRG9uZUluUHJvY1Rva2VuKSB7XG4gICAgaWYgKCF0aGlzLnJlcXVlc3QuY2FuY2VsZWQpIHtcbiAgICAgIHRoaXMucmVxdWVzdC5lbWl0KCdkb25lSW5Qcm9jJywgdG9rZW4ucm93Q291bnQsIHRva2VuLm1vcmUsIHRoaXMucmVxdWVzdC5yc3QpO1xuXG4gICAgICBpZiAodG9rZW4ucm93Q291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJlcXVlc3Qucm93Q291bnQhICs9IHRva2VuLnJvd0NvdW50O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uLmNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmUpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0LnJzdCA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uRG9uZSh0b2tlbjogRG9uZVRva2VuKSB7XG4gICAgaWYgKCF0aGlzLnJlcXVlc3QuY2FuY2VsZWQpIHtcbiAgICAgIGlmICh0b2tlbi5zcWxFcnJvciAmJiAhdGhpcy5yZXF1ZXN0LmVycm9yKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBET05FX0VSUk9SIGZsYWdzIHdhcyBzZXQsIGJ1dCBhbiBFUlJPUiB0b2tlbiB3YXMgbm90IHNlbnQuXG4gICAgICAgIHRoaXMucmVxdWVzdC5lcnJvciA9IG5ldyBSZXF1ZXN0RXJyb3IoJ0FuIHVua25vd24gZXJyb3IgaGFzIG9jY3VycmVkLicsICdVTktOT1dOJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVxdWVzdC5lbWl0KCdkb25lJywgdG9rZW4ucm93Q291bnQsIHRva2VuLm1vcmUsIHRoaXMucmVxdWVzdC5yc3QpO1xuXG4gICAgICBpZiAodG9rZW4ucm93Q291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJlcXVlc3Qucm93Q291bnQhICs9IHRva2VuLnJvd0NvdW50O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uLmNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmUpIHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0LnJzdCA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uUmVzZXRDb25uZWN0aW9uKHRva2VuOiBSZXNldENvbm5lY3Rpb25FbnZDaGFuZ2VUb2tlbikge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbWl0KCdyZXNldENvbm5lY3Rpb24nKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgaGFuZGxlciBmb3IgdGhlIGF0dGVudGlvbiBhY2tub3dsZWRnZW1lbnQgbWVzc2FnZS5cbiAqXG4gKiBUaGlzIG1lc3NhZ2Ugb25seSBjb250YWlucyBhIGBET05FYCB0b2tlbiB0aGF0IGFja25vd2xlZGdlc1xuICogdGhhdCB0aGUgYXR0ZW50aW9uIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdHRlbnRpb25Ub2tlbkhhbmRsZXIgZXh0ZW5kcyBUb2tlbkhhbmRsZXIge1xuICBkZWNsYXJlIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XG4gIGRlY2xhcmUgcmVxdWVzdDogUmVxdWVzdCB8IEJ1bGtMb2FkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgYW4gYXR0ZW50aW9uIGFja25vd2xlZGdlbWVudCB3YXMgcmVjZWl2ZWQuXG4gICAqL1xuICBkZWNsYXJlIGF0dGVudGlvblJlY2VpdmVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGNvbm5lY3Rpb246IENvbm5lY3Rpb24sIHJlcXVlc3Q6IFJlcXVlc3QgfCBCdWxrTG9hZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG5cbiAgICB0aGlzLmF0dGVudGlvblJlY2VpdmVkID0gZmFsc2U7XG4gIH1cblxuICBvbkRvbmUodG9rZW46IERvbmVUb2tlbikge1xuICAgIGlmICh0b2tlbi5hdHRlbnRpb24pIHtcbiAgICAgIHRoaXMuYXR0ZW50aW9uUmVjZWl2ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxJQUFBQSxRQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxPQUFBLEdBQUFELE9BQUE7QUFBMEQsU0FBQUQsdUJBQUFHLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFpQ25ELE1BQU1HLG9CQUFvQixTQUFTQyxLQUFLLENBQUM7RUFDOUNDLFdBQVdBLENBQUNDLE9BQXFCLEVBQUVDLEtBQVksRUFBRTtJQUMvQyxLQUFLLENBQUMsb0JBQW9CLEdBQUdBLEtBQUssQ0FBQ0MsSUFBSSxHQUFHLFFBQVEsR0FBR0YsT0FBTyxDQUFDRCxXQUFXLENBQUNHLElBQUksR0FBRyxHQUFHLENBQUM7RUFDdEY7QUFDRjtB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