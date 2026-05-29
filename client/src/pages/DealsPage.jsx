import React from "react";
import Navbar from "../components/layout/Navbar";

const deals = [
  {
    name: "Organic Bowl",
    price: "₹199",
  },

  {
    name: "Green Smoothie",
    price: "₹149",
  },

  {
    name: "Protein Salad",
    price: "₹249",
  },
];

function DealsPage() {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center mb-5">Deals</h1>

        <div className="row">
          {deals.map((deal, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow p-4 text-center">
                <h4>{deal.name}</h4>

                <h2>{deal.price}</h2>

                <button className="btn btn-success">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DealsPage;
