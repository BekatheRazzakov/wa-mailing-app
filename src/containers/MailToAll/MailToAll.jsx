import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import DateTime from 'react-datetime';
import * as XLSX from 'xlsx';

const URL = "ws://localhost:8000/ws";

const MailToAll = () => {
  const navigate = useNavigate();
  const [ws, setWs] = useState(new WebSocket(URL));
  const [state, setState] = useState({
    message: '', abons: null,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientIsReady, setClientIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tagIndex, setTagIndex] = useState(false);
  
  const onChange = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState, [name]: value,
    }));
    setTagIndex(e.target.selectionStart - 1);
    setShowSuggestions(e.nativeEvent.data === '@');
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  useEffect(() => {
    ws.onopen = (e) => {
      newFunction(e);
      
      function newFunction() {
        console.log("WebSocket Connected");
      }
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
  
  const sendMessageToWS = (message) => {
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
      await sendMessageToWS({
        type: 'mailToAll', payload: {
          ...state,
          scheduleDate: selectedDate ? new Date(selectedDate) : null,
        },
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  
  return (<form className="login-form" onSubmit={onSubmit}>
    {
      !!state.abons &&
      <>
        <label htmlFor="exampleFormControlTextarea1" className="form-label">Сообщение</label>
        <div style={{position: "relative"}}>
      <textarea
        className="form-control"
        id="exampleFormControlTextarea1"
        rows="3"
        name='message'
        value={state.message}
        onChange={onChange}
        disabled={!clientIsReady}
      />
          {
            showSuggestions &&
            <div className="list-group tag-suggestions" style={{position: "absolute", top: '100%', width: '100%'}}>
              {
                state.abons?.length && Object.keys(state.abons[0]).map((key) => (
                  <span
                    className="tag-suggestion list-group-item list-group-item-action"
                    aria-current="true"
                    onClick={() => {
                      setState(prevState => ({
                        ...prevState,
                        message: state.message.slice(0, tagIndex + 1) + key + ' ' + state.message.slice(tagIndex + 1)
                      }));
                      setShowSuggestions(false);
                    }}
                  >{key}</span>
                ))
              }
            </div>
          }
        </div>
      </>
    }
    <div className="mt-3">
      <label htmlFor="formFile" className="form-label">Excel файл</label>
      <input
        className="form-control" type="file" id="formFile"
        onChange={e => {
          const reader = new FileReader();
          reader?.readAsBinaryString(e.target.files[0]);
          
          reader.onload = async (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, {type: 'binary'});
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            const json = XLSX.utils.sheet_to_json(worksheet);
            
            setState(prevState => ({
              ...prevState, abons: json,
            }));
          };
        }}
        disabled={!clientIsReady}
      />
    </div>
    <div className="mt-3">
      <DateTime value={selectedDate} onChange={handleDateChange}/>
    </div>
    <button
      type="submit" className="btn btn-primary mt-3"
      disabled={loading || !state.abons || !state.message}>
      {
        !loading ? clientIsReady ? 'Отправить' : 'Подключение...' : ''
      }
      {loading ? 'Отправка...' : ''}
    </button>
    <div style={{
      display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '20px', gap: '10px'
    }}>
      {!!errorMessage.length && <h6>{errorMessage}</h6>}
    </div>
  </form>);
};

export default MailToAll;