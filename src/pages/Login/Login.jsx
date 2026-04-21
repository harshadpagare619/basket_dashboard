import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import pattern from '../../assets/images/pattern.webp';
import {MdEmail} from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import { Button } from '@mui/material';
import Logo from '../../assets/images/Logo.png';

function Login() {

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    context.setIsHideSidebarAndHeader(true);
  }, [])

  const focusInput = (index) => {
    setInputIndex(index);
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      context.setAlertBox({
        open: true,
        color: "error",
        msg: "All fields are required",
      });
      return;
    }

    try {
      context.setProgress(40);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_PORT}/api/moderators/signin`,
        form
      );

      // admin and token storage
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);

      // context upddate
      context.setIsLogin(true);
      context.setAdminData(res.data.admin);
      context.setIsHideSidebarAndHeader(false);

      context.setAlertBox({
        open: true,
        color: "success",
        msg: "Admin authenticated",
      });

      context.setProgress(100);
      navigate("/");
    } catch (error) {
      context.setProgress(100);

      console.log("LOGIN ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);

      context.setAlertBox({
        open: true,
        color: "error",
        msg: error.response?.data?.msg || "Login failed",
      });
    }
  };


  return (
    <>
    <img src={pattern}  className='loginPattern' />
    <section className="loginSection">
      <div className='loginBox'>
        <div className='logo text-center'>
          <img src={Logo} width="60px"/>
          <h5 className='font-weight-bold'>Login To Dashboard</h5>
        </div>

        <div className='wrapper mt-3 card border'>
          <form onSubmit={handleSubmit}>
            <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
              <span className='icon'><MdEmail /></span>
              <input 
                type="email"
                name='email'
                value={form.email}
                onChange={handleChange} 
                placeholder='Enter yout Email' 
                className='form-control' 
                onFocus={() => focusInput(0)} 
                onBlur={() => setInputIndex(null)}
              />
            </div>
            
            <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus'}`}>
              <span className='icon'><RiLockPasswordFill /></span>
              <input 
                type={`${isShowPassword === true ? 'text' : 'password'}`}
                name='password'
                value={form.password}
                onChange={handleChange} 
                className='form-control' 
                placeholder='Enter yout Password' 
                onFocus={() => focusInput(1)} 
                onBlur={() => setInputIndex(null)} />
              <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                {
                  isShowPassword === true ? <IoMdEye /> : <IoMdEyeOff />
                }
              </span>
            </div>

            <div className='form-group'>
                <Button className='btn-blue btn-lg btn-big w-100' type='submit'>Sign  In</Button>
            </div>

            <div className="form-group text-center">
              <Link  className='link'>Forgot Password</Link>
              <div className='d-flex align-items-center justify-content-center or mt-3'>
                <span className='line'></span>
                <span className='txt'>OR</span>
                <span className='line'></span>
              </div>

              <Button  className='mt-3 w-100 btn-lg btn-blue loginWithGoogle'>Sign In with Google</Button>
            </div>

          </form>
        </div>
      </div>
    </section>
    </>
    
  )
}

export default Login