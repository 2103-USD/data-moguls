import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { Button } from "@material-ui/core";

import { Order } from "./index";
import { BASE_URL } from "../api/index";

const STRIPE_KEY =
  "pk_test_51JW40NGfeiZyi0bkzQs8BV34mMmKvaUDgmsf1ciXrLlMKqCs7nJncEu4H8WpCM1vnN9pxOocNckKSK04iQOChC7R00gecuqekO";
const PAYMENT_URL = `${BASE_URL}/api/stripe/pay`;
const CURRENCY = "USD";

// Testing purposes only need to get cart total
const PRICE = 100;

const handleToken = (amount) => async (token) => {
  try {
    const response = await axios.post(PAYMENT_URL, {
      source: token.id,
      currency: CURRENCY,
      amount,
    });

    // set completed order here
  } catch (error) {
    console.error(error);
  }
};

export const Cart = ({ cart, setCart, currentUser }) => {
  return (
    <div id="cart">
      <h2>My Cart {currentUser ? `(${currentUser.firstName})` : null}</h2>
      <Order cart={cart} setCart={setCart} />
      <StripeCheckout
        stripeKey={STRIPE_KEY}
        token={handleToken(PRICE * 100)}
        name="Webb Pets"
        billingAddress
        shippingAddress
        amount={PRICE * 100}
        currency={CURRENCY}
      >
       
      </StripeCheckout>
    </div>
  );
};