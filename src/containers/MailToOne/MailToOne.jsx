import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = "ws://localhost:8000/ws";

const MailToOne = () => {
    const navigate = useNavigate();
    const [ws, setWs] = useState(new WebSocket(URL));
    const [state, setState] = useState({
        message: '',
        phone_number: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [qr, setQr] = useState('');

    useEffect(() => {
        ws.onopen = (e) => {
            newFunction(e);

            function newFunction() {
                console.log("WebSocket Connected");
            }
        };

        ws.onmessage = (e) => {
            const message = JSON.parse(e.data);
            if (message.type === 'qrCode' && message.qrCode) {
                console.log(message.qrCode);
                setQr(message.qrCode);
            }
            if (message.type === 'connecting') {
                setLoading(true);
                setQr('');
                setErrorMessage('');
            }
            if (message.type === 'connected') setLoading(false);
            if (message.type === 'error') setErrorMessage(message.message);
            if (message.type !== 'error' && errorMessage) setErrorMessage('');
            if (message.message === 'message sent') navigate('/all-mails');
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
            setLoading(true);
            await sendMessageToWS({
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
                disabled={loading || !state.phone_number || !state.message}
            >
                Отправить
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
                {
                    qr &&
                    <>
                        <h6>Попробуйте отсканировать QR код, а затем отправить сообщение</h6>
                        <img src={qr} alt="QR code" width="200" height="200"/>
                    </>
                }
            </div>
        </form>
    );
};

export default MailToOne;
