const Query = require('./Query');

/**
 * @classdesc Class representing a fetch-data query, extending {@link Query}.
 */
class FetchQuery extends Query {
  /**
   * Check whether or not the query is valid.
   * @implements {Query#isValid}
   */
  isValid() {
    return this._hasauth();
  }
}

module.exports = FetchQuery;
