import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MailToOne = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    message: '',
    phone_number: '',
  });
  
  const onChange = (e) => {
    const {name, value} = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label htmlFor="inputPassword5" className="form-label">
        Номер телефона
      </label>
      <input
        type="text"
        required
        id="inputPassword5"
        className="form-control"
        aria-describedby="passwordHelpBlock"
        name="phone_number"
        value={state.phone_number}
        onChange={onChange}
      />
      <label htmlFor="exampleFormControlTextarea1" className="form-label mt-2">
        Сообщение
      </label>
      <textarea
        className="form-control"
        id="exampleFormControlTextarea1"
        rows="3"
        name="message"
        value={state.message}
        onChange={onChange}
      ></textarea>
      <button
        type="submit"
        className="btn btn-primary mt-3"
        disabled={!state.phone_number || !state.message}
      >Отправить</button>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '20px',
        gap: '10px'
      }}>
      </div>
    </form>
  );
};

export default MailToOne;
