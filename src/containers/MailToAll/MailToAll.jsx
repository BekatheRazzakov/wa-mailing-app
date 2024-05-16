import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosApi from '../../axiosApi';
import DateTime from 'react-datetime';

const MailToAll = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    message: '',
    excel_file: null,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  console.log('hello world');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('message', state.message);
      formData.append('excel_file', state.excel_file);
      formData.append('scheduleDate', selectedDate);

      await axiosApi.post('/mailing/send_to_all', formData);
      setLoading(false);
      navigate('/all-mails');
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label htmlFor="exampleFormControlTextarea1" className="form-label">Сообщение</label>
      <textarea
        className="form-control"
        id="exampleFormControlTextarea1"
        rows="3"
        name='message'
        value={state.message}
        onChange={onChange}
      ></textarea>
      <div className="mt-3">
        <label htmlFor="formFile" className="form-label">Excel файл</label>
        <input
          className="form-control" type="file" id="formFile"
          onChange={e => {
            setState(prevState => ({
              ...prevState,
              excel_file: e.target.files[0],
            }));
          }}
        />
      </div>
      <div className="mt-3">
        <DateTime value={selectedDate} onChange={handleDateChange} />
      </div>
      <button type="submit" className="btn btn-primary mt-3"
              disabled={loading || !state.excel_file || !state.message}>Отправить
      </button>
    </form>
  );
};

export default MailToAll;