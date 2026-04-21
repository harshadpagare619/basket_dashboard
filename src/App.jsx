import { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header, Sidebar } from "./components/index";

import {
  Dashboard,
  Login,
  SignUp,
  BrandAdd,
  BrandList,
  CategoryAdd,
  CategoryList,
  ProductAdd,
  ProductEdit,
  ProductList,
  Orders,
} from "./pages/index";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LoadingBar from "react-top-loading-bar";

const MyContext = createContext();

// ✅ Protected Route Component
const PrivateRoute = ({ children }) => {
  const admin = localStorage.getItem("adminToken");

  return admin ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [progress, setProgress] = useState(0);

  const [alertBox, setAlertBox] = useState({
    open: false,
    color: "",
    msg: "",
  });

  // ✅ Check admin login on refresh
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const token = localStorage.getItem("adminToken");

   

    // console.log("token: ", token);

    if (admin && token) {
      const parsedAdmin = JSON.parse(admin);

      setAdminData(parsedAdmin);
      setIsLogin(true);
      setIsHideSidebarAndHeader(false);

      console.log("Logged in Admin:", parsedAdmin);
      console.log("toke: ",token )
    } else {
      setIsLogin(false);
      setAdminData(null);
      setIsHideSidebarAndHeader(true);
    }
  }, []);

  const values = {
    isLogin,
    setIsLogin,
    adminData,
    setAdminData,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    progress,
    setProgress,
    alertBox,
    setAlertBox,
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    setAlertBox({
      open: false,
      color: "",
      msg: "",
    });
  };


  console.log(import.meta.env.VITE_BASE_PORT);

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Snackbar
          open={alertBox.open}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertBox.color === "success" ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>

        <LoadingBar
          color="#0858f7"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
        />

        {/* ✅ Show Header only if logged in */}
        {isLogin && isHideSidebarAndHeader !== true && <Header />}

        <div className="main d-flex">
          {/* ✅ Show Sidebar only if logged in */}
          {isLogin && isHideSidebarAndHeader !== true && (
            <div className="sidebarWrapper">
              <Sidebar />
            </div>
          )}

          <div className={`content ${!isLogin ? "full" : ""}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/brands/addbrand"
                element={
                  <PrivateRoute>
                    <BrandAdd />
                  </PrivateRoute>
                }
              />

              <Route
                path="/brands/brandlist"
                element={
                  <PrivateRoute>
                    <BrandList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/category/addcategory"
                element={
                  <PrivateRoute>
                    <CategoryAdd />
                  </PrivateRoute>
                }
              />

              <Route
                path="/category/categorylist"
                element={
                  <PrivateRoute>
                    <CategoryList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/products/addproduct"
                element={
                  <PrivateRoute>
                    <ProductAdd />
                  </PrivateRoute>
                }
              />

              <Route
                path="/products/productlist"
                element={
                  <PrivateRoute>
                    <ProductList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/products/productedit/:id"
                element={
                  <PrivateRoute>
                    <ProductEdit />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />

              {/* Default Route */}
              <Route
                path="*"
                element={<Navigate to={isLogin ? "/" : "/login"} replace />}
              />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };