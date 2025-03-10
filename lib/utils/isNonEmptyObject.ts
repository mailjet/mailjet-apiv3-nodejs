/*external modules*/
/*types*/
/*utils*/
/*lib*/
/*other*/

function isNonEmptyObject(value: Record<string, unknown>): boolean {
  return typeof value === 'object'
    && value !== null
    && (Object.getPrototypeOf(value) === Object.prototype)
    && Object.keys(value).length > 0;
}

export default isNonEmptyObject;
