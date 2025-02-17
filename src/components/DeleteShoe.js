import { Link, useParams } from "react-router-dom";

import { useState } from "react";

const deleteShoe = ({ products, fetchProducts }) => {
  const params = useParams();
  const [error, setError] = useState("");
  const filteredShoe = products.filter(
    (product) => params.shoeId == product.id
  );

  const lsToken = localStorage.getItem("token");

  const handleDelete = async (e) => {
    const resp = await fetch(`/api/products/${params.shoeId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${lsToken}`,
      },
    });
    console.log(resp);
    const info = await resp.json();
    await fetchProducts();

    console.log(info);
    if (!info) {
      setError(resp.statusText);
      throw info.message;
    }
  };

  return (
    <>
      <h1>Are you sure you want to delete this shoe?</h1>
      {filteredShoe ? (
        <>
          <div key={filteredShoe[0].id} className="singleView">
            <h1 className="single-text">{filteredShoe[0].title}</h1>
            <img
              className="single-text"
              id="image"
              src={filteredShoe[0].image}
            />
            <h2 className="single-text">{filteredShoe[0].designer}</h2>
            <h3 className="single-text">{filteredShoe[0].description}</h3>
            <h2 className="single-text">${filteredShoe[0].price}</h2>
            <h3 className="single-text">Inventory: {filteredShoe[0].count}</h3>
          </div>
          <form>
            <Link to="/admin">
              <button
                onClick={(e) => {
                  handleDelete(e.target.value);
                }}
              >
                Yes
              </button>
            </Link>
            <Link to="/admin">
              <button type="reset">Cancel</button>
            </Link>
          </form>
        </>
      ) : null}
      <p>{error}</p>
    </>
  );
};

export default deleteShoe;
