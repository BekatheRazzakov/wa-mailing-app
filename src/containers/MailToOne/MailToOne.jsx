import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = 'ws://localhost:8000/ws';

const MailToOne = () => {
  const navigate = useNavigate();
  const [ws, setWs] = useState(new WebSocket(URL));
  const [state, setState] = useState({
    message: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [clientIsReady, setClientIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  
  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };
    
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'connection') setClientIsReady(message.status);
      if (message.type === 'mailing' && message.status) navigate('/all-mails');
      if (message.type === 'mailing' && !message.status) setErrorMessage('Ошибка при отправке, попробуйте снова');
    };
    
    return () => {
      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose, ws, URL]);
  
  const onChange = (e) => {
    const {name, value} = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const sendMessage = (message) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.log('WebSocket not open yet. Message not sent.');
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendMessage({
        type: 'singleMailing',
        payload: state,
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
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
        disabled={!clientIsReady}
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
        disabled={!clientIsReady}
      ></textarea>
      <button
        type="submit"
        className="btn btn-primary mt-3"
        disabled={loading || !state.phone_number || !state.message || !clientIsReady}
      >
        {
          !loading ? clientIsReady ? 'Отправить' : 'Подключение...' : ''
        }
        {loading ? 'Отправка...' : ''}
      </button>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '20px',
        gap: '10px'
      }}>
        {
          !!errorMessage.length &&
          <h6>{errorMessage}</h6>
        }
      </div>
    </form>
  );
};

export default MailToOne;
