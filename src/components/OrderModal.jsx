import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/OrderModal.module.css";

function OrderModal({ order, setOrderModal }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState([]);

  const placeOrder = async () => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        items: order
      })
    });
    if (response.status === 200) {
      const data = await response.json();
      const { id } = data;
      navigate(`order-confirmation/${id}`);
    }
  };

  const getBarePhoneNumber = (number) => String(number).replace(/\D/g, "");

  const validateFields = (fields) => {
    setErrors([]);
    if (getBarePhoneNumber(fields.phone).length !== 10) {
      setErrors((prev) => [...prev, "Phone number must consist of 10 digits."]);
    }
    Object.keys(fields).forEach((field) => {
      if (!fields[field]) {
        setErrors((prev) => [...prev, `${field} cannot be blank.`]);
      }
    });
  };

  const formatPhoneNumber = (number) => {
    const bareNumber = getBarePhoneNumber(number).slice(0, 10);
    const phoneNumber = {
      areaCode: bareNumber.slice(0, 3),
      prefix: bareNumber.slice(3, 6),
      lineNumber: bareNumber.slice(6)
    };
    return (
      `${phoneNumber.areaCode.length ? "(" : ""}` +
      `${phoneNumber.areaCode}` +
      `${phoneNumber.areaCode.length === 3 ? ") " : ""}` +
      `${phoneNumber.prefix}` +
      `${phoneNumber.prefix.length === 3 ? "-" : ""}` +
      `${phoneNumber.lineNumber}`
    );
  };

  return (
    <>
      <div
        label="Close"
        className={styles.orderModal}
        onKeyPress={(e) => {
          if (e.key === "Escape") {
            setOrderModal(false);
          }
        }}
        onClick={() => setOrderModal(false)}
        role="menuitem"
        tabIndex={0}
      />
      <div className={styles.orderModalContent}>
        <h2>Place Order</h2>
        {errors.length > 0 && (
          <div className={styles.errors}>
            <ul>
              {errors.map((err) => (
                <li key={`${err}`}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Name
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}
                type="text"
                id="name"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              Phone
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setPhone(e.target.value);
                }}
                onBlur={() => {
                  setPhone(formatPhoneNumber(phone));
                }}
                value={phone}
                type="phone"
                id="phone"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">
              Address
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setAddress(e.target.value);
                }}
                type="phone"
                id="address"
              />
            </label>
          </div>
        </form>

        <div className={styles.orderModalButtons}>
          <button
            className={styles.orderModalClose}
            onClick={() => setOrderModal(false)}
          >
            Close
          </button>
          <button
            onClick={() => {
              validateFields({ name, phone, address });
              if (errors.length) {
                return;
              }
              placeOrder();
            }}
            className={styles.orderModalPlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderModal;
