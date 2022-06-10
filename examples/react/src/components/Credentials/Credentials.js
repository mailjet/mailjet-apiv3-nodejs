/*external modules*/
import { useCallback } from 'react';
import { useForm } from "react-hook-form";
/*components*/
/*styles*/
import './Credentials.css';

function Credentials({ setCredentials }) {
  const { register, handleSubmit, reset, formState } = useForm();
  const onSubmit = (data) => {
    setCredentials(data)
    reset();
  }

  const showErrors = useCallback(
    () => {
      const errors = [
        {
          key: 'key',
          value: formState.errors.key,
          message: 'API Key is required',
        },
        {
          key: 'secret',
          value: formState.errors.secret,
          message: 'API Secret is required',
        }
      ].filter(({ value }) => Boolean(value));

      const errorBlock = errors
        .map((data, i) => {
          return (
            <span key={data.key}>{i + 1}. {data.message}</span>
          )
        })

      if(formState.isDirty && errors.length > 0) {
        return (
          <div className='credentials-error'>
            <p>Errors:</p>
            {errorBlock}
          </div>
        )
      }
    },
    [formState.errors.key, formState.errors.secret, formState.isDirty]
  )

  return (
    <div className='credentials'>
      <p className='credentials-header'>
        Set credentials
      </p>
      <form className='credentials-form' onSubmit={handleSubmit(onSubmit)}>
        {showErrors()}

        <label htmlFor="key">API key:</label>
        <input className='credentials-input' {...register('key', { required: true })}/>

        <label htmlFor="secret">API secret:</label>
        <input className='credentials-input' {...register('secret', { required: true })}/>

        <input className='credentials-submit' type='submit' value={'Set'}/>
      </form>
    </div>
  );
}

export default Credentials;
