import React, {useState, useEffect} from 'react';

const URL = 'ws://localhost:8000/ws';

const QrCode = () => {
  const [ws, setWs] = useState(new WebSocket(URL));
  const [qrCode, setQrCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send(JSON.stringify({type: 'get_qr'}));
    };
    
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(message);
      if (message.type === 'qr') setQrCode(message.message);
      if (message.type === 'connection') setLoading(!message.status);
      if (message.type === 'clientConnection') setConnectionStatus(message.message);
      // if (message.type === 'message sent') navigate('/all-mails');
    };
    
    return () => {
      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose, ws, URL]);
  
  return (
    <div style={{display: 'flex', justifyContent: 'center', padding: '20px 0 0 0'}}>
      {
        !loading && qrCode ? <img src={qrCode} alt="QR Code"/> : <h2>Загрузка...</h2>
      }
    </div>
  );
};

export default QrCode;