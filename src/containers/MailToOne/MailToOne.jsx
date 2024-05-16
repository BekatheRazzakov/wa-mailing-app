import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosApi from '../../axiosApi';

const MailToOne = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    message: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosApi.post('/mailing/send_to_one', state);
      setLoading(false);
      navigate('/all-mails');
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label htmlFor="inputPassword5" className="form-label">Номер телефона</label>
      <input
        type="text"
        required
        id="inputPassword5"
        className="form-control"
        aria-describedby="passwordHelpBlock"
        name='phone_number'
        value={state.phone_number}
        onChange={onChange}
      />
      <label htmlFor="exampleFormControlTextarea1" className="form-label mt-2">Сообщение</label>
      <textarea
        className="form-control"
        id="exampleFormControlTextarea1"
        rows="3"
        name='message'
        value={state.message}
        onChange={onChange}
      ></textarea>
      <button type="submit" className="btn btn-primary mt-3" disabled={loading || !state.phone_number || !state.message}>Отправить</button>
    </form>
  );
};

export default MailToOne;