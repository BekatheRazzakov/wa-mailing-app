import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {signIn} from '../../features/userThunk';
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.userState.user);
  const [state, setState] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (user) navigate('/all-mails');
  }, [user]);

  const onChange = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(signIn(state));
  };

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label htmlFor="inputText5" className="form-label">Логин</label>
      <input
        type="text"
        required
        id="inputText5"
        className="form-control"
        aria-describedby="passwordHelpBlock"
        name='username'
        value={state.username}
        onChange={onChange}
      />
      <label htmlFor="inputPassword5" className="form-label mt-2">Пароль</label>
      <input
        type="password"
        required
        id="inputPassword5"
        className="form-control"
        aria-describedby="passwordHelpBlock"
        name='password'
        value={state.password}
        onChange={onChange}
      />
      <button type="submit" className="btn btn-primary mt-3">Логин</button>
    </form>
  );
};

export default Login;