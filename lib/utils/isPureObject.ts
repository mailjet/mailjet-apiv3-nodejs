/*external modules*/
/*types*/
/*utils*/
/*lib*/
/*other*/

function isPureObject(value: unknown): boolean {
  return typeof value === 'object'
    && value !== null
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

export default isPureObject;
