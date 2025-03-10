/*external modules*/
/*types*/
/*utils*/
/*lib*/
/*other*/

function isValidJson(value: object): boolean {
  try {
    JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
}

export default isValidJson;
