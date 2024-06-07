import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../../app/hooks";
import axiosApi from '../../axiosApi';

const QrCode = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.userState.user);
  const [qrCode, setQrCode] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrLoadingMessage, setQrLoadingMessage] = useState('');
  
  useEffect(() => {
    const getInitialQr = async () => {
      setQrLoading(true);
      await getQrCode();
      setQrLoading(false);
    };
    void getInitialQr();
    
    const intervalId = setInterval(() => {
      void getQrCode();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const getQrCode = async () => {
    if (!user) return navigate('/login');
    const req = await axiosApi(`/mailing/get_qr`);
    const res = await req.data;
    setQrCode(res.qrImgSrc);
    if (res.hasQr) {
      setQrLoadingMessage('');
    } else {
      setQrLoadingMessage('QR код генерируется, подожите...');
    }
    if (res.clientIsReady) navigate('/mail-to-one');
  };
  
  return (
    <div style={{display: 'flex', justifyContent: 'center', padding: '20px 0 0 0'}}>
      {qrLoading && <h2>Загрузка...</h2>}
      {!!qrLoadingMessage && <h2>{qrLoadingMessage}</h2>}
      {!!qrCode && <img src={qrCode} alt="QR Code"/>}
    </div>
  );
};

export default QrCode;