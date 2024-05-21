import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {logout} from '../../features/usersSlice';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import 'bootstrap/dist/css/bootstrap.min.css';

const Toolbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(state => state.userState.user);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">WhatsApp рассылка</a>
        <ul className="nav nav-underline">
          {/*<li className="nav-item">*/}
          {/*  <a className={`nav-link ${location.pathname === '/scan_qr' ? 'active' : ''}`} aria-current="page"*/}
          {/*     href="/scan_qr">QR Код</a>*/}
          {/*</li>*/}
          <li className="nav-item">
            <a className={`nav-link ${location.pathname === '/mail-to-one' ? 'active' : ''}`} aria-current="page"
               href="/mail-to-one">Одиночная отправка</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${location.pathname === '/mail-to-all' ? 'active' : ''}`} href="/mail-to-all">Массовая
              отправка</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${location.pathname === '/all-mails' ? 'active' : ''}`} href="/all-mails">Архив</a>
          </li>
          <li className="nav-item" onClick={() => dispatch(logout())}>
            <span className={`nav-link`}>Выйти</span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Toolbar;