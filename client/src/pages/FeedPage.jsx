import React from "react";
import Navbar from "../components/layout/Navbar";
const FEED_POSTS = [
  {
    title: "Healthy Avocado Bowl",
    desc: "Fresh avocado with greens and organic toppings.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
  },
  {
    title: "Organic Smoothie",
    desc: "Cold pressed fruits for natural energy.",
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500",
  },
  {
    title: "Protein Salad",
    desc: "Packed with nutrients and vitamins.",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
  },
];

function FeedPage() {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center m-4">Food Feed</h1>

        <div className="row">
          {FEED_POSTS.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow border-0 h-100">
                <img src={item.img} alt="" className="card-img-top" />

                <div className="card-body">
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>

                  <button className="btn btn-success">View More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FeedPage;
