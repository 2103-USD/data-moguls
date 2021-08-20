import React, { useState, useEffect } from "react";

import { getAllProducts } from "../api";

export const AllProducts = () => {
  const [productList, setProductList] = useState([]);

  const fetchData = async () => {
    const fetchedProducts = await getAllProducts();
    setProductList(fetchedProducts);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="all-products">
      {productList.length > 0 &&
        productList.map(({ id, name, price, imageURL }) => {
          return <div className="thumbnail-product" key={id}>
            <h2>{name}</h2>
            <div className="thumbnail-product-image">
              <img src={imageURL} alt="product thumbnail" />
            </div>
            <div className="thumbnail-product-details">
              <div className="thumbnail-product-price">{price}</div>
            </div>
          </div>;
        })}
    </div>
  );
};
