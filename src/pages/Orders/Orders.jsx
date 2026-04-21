import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import axios from "axios";
import { Link } from "react-router-dom";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { MdEdit, MdDelete } from "react-icons/md";
import { MdVisibility } from 'react-icons/md'

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

function Orders() {
  const context = useContext(MyContext);

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        context.setProgress(30);

        const token = localStorage.getItem("adminToken");

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_PORT}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrderData(res.data);

        

        context.setProgress(100);
      } catch (error) {
        context.setProgress(100);

        console.log("Orders Fetch Error:", error);
        console.log("Error Response:", error.response?.data);

        context.setAlertBox({
          open: true,
          color: "error",
          msg: error.response?.data?.msg || "Failed to fetch orders",
        });
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">Orders</h5>

        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Dashboard"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Orders"
            deleteIcon={<ExpandMoreIcon />}
          />
        </Breadcrumbs>
      </div>

      <div className="card shadow border-0 p-3 mt-4 orderCard">
        <div className="table-responsive mt-4">
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Order Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orderData.length > 0 ? (
                orderData.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="d-flex align-items-center productBox">
                        <div className="ml-2 w-100">
                          <h6 className="mb-0">{order._id}</h6>
                        </div>
                      </div>
                    </td>

                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                    <td>
                      <span className="badge badge-warning">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td>₹ {order.totalAmount}</td>

                    <td>
                      <div className="actions d-flex align-items-center">
                        <Button className='secondary' color='secondary'><MdVisibility /></Button>

                        <Button className="error" color="error">
                          <MdDelete />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;