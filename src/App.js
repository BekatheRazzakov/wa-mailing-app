import {Navigate, Route, Routes} from "react-router-dom";
import MailsList from "./containers/MailsList/MailsList";
import MailToAll from "./containers/MailToAll/MailToAll";
import MailToOne from "./containers/MailToOne/MailToOne";
import Toolbar from "./components/Toolbar/Toolbar";
import Login from "./containers/Login/Login";
import QrCode from "./containers/QrCode/QrCode";
import './App.css';

function App() {
  return (
    <div className="App">
      <Toolbar />
      <Routes>
        <Route path='*' element={<Navigate to="/scan_qr" replace/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='all-mails' element={<MailsList/>}/>
        <Route path='mail-to-all' element={<MailToAll/>}/>
        <Route path='mail-to-one' element={<MailToOne/>}/>
        <Route path='scan_qr' element={<QrCode/>}/>
      </Routes>
    </div>
  );
}

export default App;
