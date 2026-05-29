import React from "react";
import Navbar from "../components/layout/Navbar";

function RecipesPage() {
  const recipes = [
    "Avocado Salad",
    "Green Smoothie",
    "Protein Bowl",
    "Fruit Mix",
    "Organic Soup",
  ];

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center m-4">Recipes</h1>

        <div className="row">
          {recipes.map((recipe, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card p-4 shadow">
                <h4>{recipe}</h4>

                <p>Healthy organic meal made from fresh ingredients.</p>

                <button className="btn btn-outline-success">Open Recipe</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RecipesPage;
