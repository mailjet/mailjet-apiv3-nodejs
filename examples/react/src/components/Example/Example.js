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
    const filters = getPagination();
    console.log('filters => ', filters)
    request({ filters })
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
              <label htmlFor="limit">Limit:</label>
              <input {...register('limit', { required: false })} type="number" min="0" placeholder='0' />

              <label htmlFor="offset">Offset:</label>
              <input {...register('offset', { required: false })} type="number" min='0' placeholder='0' />

              <label htmlFor="sort">Sort:</label>
              <input {...register('sort', { required: false })} type="text" placeholder='ASC' />
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
