import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import {
  getCartByUserId,
  getProductById,
  formatCurrency,
  addProductToOrder,
  updateOrderProduct,
  createOrder,
} from "../api";

export const Product = ({
  currentUser,
  cart,
  setCart,
  visitorCart,
  setVisitorCart,
}) => {
  const [openProduct, setOpenProduct] = useState({});

  let { id, name, description, price, imageURL, inStock, category } =
    openProduct;

  const [itemQuantity, setItemQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setItemQuantity(Number(e.target.value));
  };

  const checkProductInVisitorCart = () => {
    return (
      visitorCart.length > 0 && visitorCart.some((product) => product.id === id)
    );
  };

  const editProductInVisitorCart = () => {
    const [itemInVisitorCart] = visitorCart.filter(
      (product) => product.id === id
    );
    return {
      ...itemInVisitorCart,
      quantity: itemQuantity + itemInVisitorCart.quantity,
    };
  };

  const checkProductInUserCart = () => {
    if (cart.orderProducts && cart.orderProducts.length > 0) {
      const [results] = cart.orderProducts.filter(
        (product) => product.productId === id
      );
      return results;
    }
  };

  const params = useParams();

  const fetchData = async () => {
    const fetchedProduct = await getProductById(params.productId);
    setOpenProduct(fetchedProduct);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToCart = async () => {
    try {
      if (currentUser) {
        if (!cart) {
          createOrder();
        }
        const { id: productId, price } = openProduct;
        const { id: cartId } = cart;
        const cartItem = checkProductInUserCart();
        if (cartItem) {
          const { orderProductId, quantity } = cartItem;
          const newQuantity = quantity + itemQuantity;
          await updateOrderProduct(orderProductId, price, newQuantity);
        } else {
          await addProductToOrder(cartId, productId, price, itemQuantity);
        }
        const updatedCart = await getCartByUserId(currentUser.id);
        setCart(updatedCart);
      } else {
        if (checkProductInVisitorCart()) {
          const updatedProduct = editProductInVisitorCart();
          const idx = visitorCart.findIndex((product) => product.id === id);
          const newCart = [...visitorCart];
          newCart.splice(idx, 1, updatedProduct);
          setVisitorCart(newCart);
        } else {
          const addedProduct = {
            ...openProduct,
            quantity: itemQuantity,
          };
          setVisitorCart([...visitorCart, addedProduct]);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="product" data-id={id}>
      <div className="category">category / {category}</div>
      <h2>{name}</h2>
      <div className="product-image">
        <img src={imageURL} />
      </div>
      <div className="product-details">
        {inStock && (
          <form>
            <label>
              <span>Quantity: </span>
              <input
                type="number"
                value={itemQuantity}
                min={1}
                max={99}
                required
                onChange={handleQuantityChange}
              />
            </label>
          </form>
        )}
        <div className="product-price">{formatCurrency(price)}</div>
        <div className="inStock">
          In stock: {inStock ? "YES, AVAILABLE!" : "PRODUCT UNAVAILABLE"}
        </div>
        <div className="product-description">{description}</div>
        {inStock && (
          <span className="material-icons-outlined" onClick={handleAddToCart}>
            add_shopping_cart
          </span>
        )}
        {/* delete from cart */}
      </div>
    </div>
  );
};
