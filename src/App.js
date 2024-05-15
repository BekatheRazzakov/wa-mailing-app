import {Navigate, Route, Routes} from "react-router-dom";
import MailsList from "./containers/MailsList/MailsList";
import MailToAll from "./containers/MailToAll/MailToAll";
import MailToOne from "./containers/MailToOne/MailToOne";
import Login from "./containers/Login/Login";
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='*' element={<Navigate to="/statistics" replace/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='all-mails' element={<MailsList/>}/>
        <Route path='mail-to-all' element={<MailToAll/>}/>
        <Route path='mail-to-one' element={<MailToOne/>}/>
      </Routes>
    </div>
  );
}

export default App;
