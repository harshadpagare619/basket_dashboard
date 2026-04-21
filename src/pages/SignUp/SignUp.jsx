import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pattern from "../../assets/images/pattern.webp";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Button } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";

function SignUp() {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });

  useEffect(() => {
    context.setIsHideSidebarAndHeader(true);
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
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
        `${import.meta.env.VITE_BASE_PORT}/api/moderators/signup`,
        form
      );
      // const res = await axios.post("http://localhost:4000/api/moderators/signup", form);

      console.log("form data :", res);

      // store admin + token separately
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);

      context.setIsLogin(true);
      context.setIsHideSidebarAndHeader(false);

      context.setAlertBox({
        open: true,
        color: "success",
        msg: "Admin created successfully",
      });

      context.setProgress(100);
      navigate("/");
    } catch (error) {
      context.setProgress(100);

      console.error(error);
      console.log("FULL ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);
      console.log("ERROR MESSAGE:", error.message);

      context.setAlertBox({
        open: true,
        color: "error",
        msg: error.response?.data?.msg || "Signup failed",
      });
    }
  };

  return (
    <>
      <img src={pattern} className="loginPattern" />
      <section className="loginSection">
        <div className="row">
          <div className="col-md-8"></div>

          <div className="col-md-4 pr-0">
            <div className="loginBox">
              <div className="logo text-center">
                <img
                  src="https://mironcoder-hotash-react.netlify.app/images/logo.webp"
                  width="60px"
                />
                <h5 className="font-weight-bold mt-2">
                  Register New Account
                </h5>
              </div>

              <div className="wrapper mt-3 card border">
                <form onSubmit={handleSubmit}>
                  <div
                    className={`form-group mb-3 position-relative ${
                      inputIndex === 0 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <FaUserCircle />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Name"
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                    />
                  </div>

                  <div
                    className={`form-group mb-3 position-relative ${
                      inputIndex === 1 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <MdEmail />
                    </span>
                    <input
                      type="text"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your Email"
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                    />
                  </div>

                  <div
                    className={`form-group mb-3 position-relative ${
                      inputIndex === 2 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={isShowPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your Password"
                      onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)}
                    />
                    <span
                      className="toggleShowPassword"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      {isShowPassword ? <IoMdEye /> : <IoMdEyeOff />}
                    </span>
                  </div>

                  <div className="form-group">
                    <Button
                      className="btn-blue btn-lg btn-big w-100"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </div>

                  {/* <div className="form-group text-center">
                    <div className="d-flex align-items-center justify-content-center or mt-3">
                      <span className="line"></span>
                      <span className="txt">OR</span>
                      <span className="line"></span>
                    </div>

                    <Button
                      variant="outlined"
                      className="mt-3 w-100 btn-lg btn-blue loginWithGoogle"
                      disabled
                    >
                      Sign In with Google
                    </Button>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUp;