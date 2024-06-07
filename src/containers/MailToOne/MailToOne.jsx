import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../../axiosApi';

const MailToOne = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    message: '',
    phone_number: '',
  });
  const [mailLoading, setMailLoading] = useState(false);
  const [mailResponse, setMailResponse] = useState('');
  
  useEffect(() => {
    const checkClient = async () => {
      const req = await axiosApi.get(`/mailing/check_client`);
      const res = await req.data;
      if (!res) navigate('/scan_qr');
    };
    void checkClient();
  }, []);
  
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
      setMailLoading(true);
      setMailResponse('');
      const req = await axiosApi.post('/mailing/send_to_one', state);
      const res = await req.data;
      setMailLoading(false);
      if (res.message) navigate('/all-mails');
    } catch (e) {
      console.log(e);
      setMailLoading(false);
      setMailResponse(e.response.data.message);
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
      >{
        mailLoading ?
          <div className="spinner-border" role="status" /> : 'Отправить'}</button>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '20px',
        gap: '10px'
      }}>
        <h6>{mailResponse}</h6>
      </div>
    </form>
  );
};

export default MailToOne;
