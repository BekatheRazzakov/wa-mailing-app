import React, {useState, useEffect} from 'react';
import axiosApi from '../../axiosApi';

const MailsList = () => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    void getMails();
  }, []);

  const getMails = async () => {
    try {
      const req = await axiosApi('/mailing/get_all');
      const res = await req.data;
      setMails(res);
    } catch (e) {
      console.log(e);
    }
  };

  const formatDate = (date) => {
    const pad = (num, size) => num.toString().padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const day = pad(date.getDate(), 2);

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="all-mails">
      {
        [...mails].reverse().map((mail, i) => (
          <div className="all-mails-item" key={i}>
            <div className="all-mails-item-row">
              <strong>Сообщение: </strong>
              <span>{mail.text}</span>
            </div>
            <div className="all-mails-item-row">
              <strong>Номер абонента: </strong>
              <span>{mail.phone_number}</span>
            </div>
            <div className="all-mails-item-row">
              <strong>Дата: </strong>
              <span>{formatDate(new Date(mail.sent_at))}</span>
            </div>
            <div className="all-mails-item-row">
              <strong>Статус: </strong>
              <span>{mail.deliver_status ? 'Отправлено' : 'Не отправлено'}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default MailsList;