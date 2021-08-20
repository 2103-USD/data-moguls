import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../api";

export const Product = () => {
  const [openProduct, setOpenProduct] = useState({});

  const params = useParams();

  const fetchData = async () => {
    const fetchedProduct = await getProductById(params.productId);
    setOpenProduct(fetchedProduct);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const { id, name, description, price, imageURL, inStock, category } =
    openProduct;

  return (
    <div className="product" data-id={id}>
      <div className="category">{category}</div>
      <h2>{name}</h2>
      <div className="product-image">
        <img src={imageURL} alt="product" />
      </div>
      <div className="product-details">
        <div className="product-price">{price}</div>
        <div className="inStock">
          In stock: {inStock ? "YES, IN STOCK!" : "PRODUCT UNAVAILABLE"}
        </div>
        <div className="product-description">{description}</div>
      </div>
    </div>
  );
};
