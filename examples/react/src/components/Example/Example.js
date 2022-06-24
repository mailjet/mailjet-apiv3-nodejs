/*external modules*/
import { useState } from 'react';
import { useForm } from "react-hook-form";
/*components*/
import JSONPretty from '../JSONPretty/JSONPretty';
/*styles*/
import './Example.css';

function Example(props) {
  const { title, link, description, request } = props;

  const [result, setResult] = useState({})
  const { register, getValues } = useForm();

  const getPagination = () => {
   return Object.fromEntries(
     Object
       .entries(getValues())
       .filter(item => Boolean(item[1]) && item)
   )
  }

  const execRequest = () => {
    const params = getPagination();
    console.log('params => ', params)
    request({}, params)
      .then(response => {
        console.log('response => ', response)
        setResult(response.body)
      })
      .catch(err => {
        console.log('error => ', err)
        setResult(err)
      })
  }

  return (
    <div className='example'>
      <p className='example-title'>{title} - <a href={link.href}>{link.title}</a></p>
      <div className='example-container'>
        <div className='example-content'>
          <div className='example-description'>
            <span>Description:</span>
            <span>{description}</span>
          </div>
          <div className='example-pagination-container'>
            <p>Pagination:</p>
            <form className='example-pagination'>
              <label htmlFor="Limit">Limit:</label>
              <input {...register('Limit', { required: false })} type="number" min="0" placeholder='0' />

              <label htmlFor="Offset">Offset:</label>
              <input {...register('Offset', { required: false })} type="number" min='0' placeholder='0' />

              <label htmlFor="Sort">Sort:</label>
              <input {...register('Sort', { required: false })} type="text" placeholder='ASC' />
            </form>
          </div>
          <button className='example-request' onClick={execRequest}>request</button>
        </div>
        <JSONPretty data={result}/>
      </div>
    </div>
  );
}

export default Example;
