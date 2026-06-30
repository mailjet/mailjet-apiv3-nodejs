/*external modules*/
/*types*/
/*utils*/
/*lib*/
/*other*/

function isValidJson(value: object): boolean {
  try {
    JSON.stringify(value);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
}

export default isValidJson;
