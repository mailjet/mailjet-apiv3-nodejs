/*external modules*/
import JSONPrettyCom from 'react-json-pretty';
import JSONPrettyMon from 'react-json-pretty/dist/acai';
/*components*/
/*styles*/
import './JSONPretty.css'


function JSONPretty(props) {
  let mainStyle = ''
  if(props.width) {
    mainStyle += `max-width: ${props.width}px;`
  }
  if(props.height) {
    mainStyle += `max-height: ${props.height}px;`
  }

  return (
    <JSONPrettyCom
      data={props.data}
      theme={JSONPrettyMon}
      mainStyle={mainStyle}
    />
  );
}

export default JSONPretty;
