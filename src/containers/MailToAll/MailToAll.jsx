import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import 'bootstrap/dist/css/bootstrap.min.css';
import DateTime from 'react-datetime';
import * as XLSX from 'xlsx';
import axiosApi from '../../axiosApi';

const MailToAll = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.userState.user);
  const [state, setState] = useState({
    message: '', abons: null,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tagIndex, setTagIndex] = useState(false);
  const [mailLoading, setMailLoading] = useState(false);
  const [mailResponse, setMailResponse] = useState('');
  
  useEffect(() => {
    const checkClient = async () => {
      try {
        const req = await axiosApi.get(`/mailing/check_client`);
        const res = await req.data;
        if (!res) navigate('/scan_qr');
      } catch (e) {
        console.log(e);
      }
    };
    if (user) {
      void checkClient();
    }
  }, []);
  
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
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setMailLoading(true);
      await axiosApi.post('/mailing/send_to_all', {
        ...state,
        scheduleDate: selectedDate,
      });
      setMailLoading(false);
      navigate('/all-mails');
    } catch (e) {
      console.log(e);
      setMailResponse(e.response.data.message);
    }
  };
  
  return (
    <form className="login-form" onSubmit={onSubmit}>
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
            if (!e.target.files.length) return;
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
        />
      </div>
      <div className="mt-3">
        <DateTime value={selectedDate} onChange={handleDateChange}/>
      </div>
      <button
        type="submit" className="btn btn-primary mt-3"
        disabled={!state.abons || !state.message}>
        {
          mailLoading ?
            <div className="spinner-border" role="status"/> : 'Отправить'
        }
      </button>
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

export default MailToAll;