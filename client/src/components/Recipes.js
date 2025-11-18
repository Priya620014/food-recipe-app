import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../config/config";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const generateIngredients = async (id) => {
    try {
      setGenerated(["Loading..."]);
      setShowPopup(true);

      const res = await fetch(`${BACKEND_URL}/auth/generateIngredients/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        setGenerated([]);
        setShowPopup(false);
        toast.error(err.message || "Failed to fetch ingredients");
        return;
      }

      const data = await res.json();

      if (!data || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
        setGenerated(["No ingredients found"]);
        return;
      }

      setGenerated(data.ingredients);
    } catch (error) {
      setShowPopup(false);
      toast.error("Error generating ingredients");
    }
  };

  const downloadIngredients = () => {
    const content = generated.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "ingredients.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    fetch(`${BACKEND_URL}/auth/recipe`, {
      headers: { Authorization: localStorage.getItem("token") || "" },
    })
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch(() => toast.error("Failed to load recipes"));
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;

    const res = await fetch(`${BACKEND_URL}/auth/recipe/${id}`, {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("token") || "" },
    });

    if (res.ok) {
      toast.success("Recipe deleted");
      setTimeout(loadRecipes, 1000);
    } else {
      toast.error("Could not delete");
    }
  };

  const handleAddToFavorites = async (id) => {
    const res = await fetch(`${BACKEND_URL}/auth/likedRecipes/${id}`, {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") || "" },
    });

    if (res.ok) {
      toast.success("Added to favorites");
      setTimeout(() => {
        window.location.href = "/favouriteRecipes";
      }, 1500);
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not add to favorites");
    }
  };

  const SearchRecipes = async (e) => {
    const text = e.target.value.trim();
    if (text === "") {
      loadRecipes();
      return;
    }

    const res = await fetch(`${BACKEND_URL}/auth/searchRecipes/${encodeURIComponent(text)}`, {
      headers: { Authorization: localStorage.getItem("token") || "" },
    });

    const data = await res.json();
    if (!data.message) setRecipes(data);
    else setRecipes([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="w-full max-w-lg px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          placeholder="Search recipes"
          onChange={SearchRecipes}
        />
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-3">{recipe.title}</h2>

                <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside mb-4 space-y-1 max-h-40 overflow-auto">
                  {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No ingredients listed</li>
                  )}
                </ul>

                <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
                <div className="text-gray-700 space-y-1 max-h-40 overflow-auto">
                  {recipe.instructions
                    ? recipe.instructions.split("\n").map((step, i) => <p key={i}>{step}</p>)
                    : <p className="text-gray-500">No instructions</p>}
                </div>
              </div>

              <div className="p-5 flex flex-wrap gap-3 justify-between">
                <button
                  onClick={() => handleDeleteRecipe(recipe._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleAddToFavorites(recipe._id)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md w-full sm:w-auto"
                >
                  Favorite
                </button>

                <Link
                  to={`/updateRecipe/${recipe._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md w-full sm:w-auto text-center"
                >
                  Update
                </Link>

                <Link
                  to="/addRecipe"
                  className="px-4 py-2 bg-green-500 text-white rounded-md w-full sm:w-auto text-center"
                >
                  Add Extra
                </Link>

                <button
                  onClick={() => generateIngredients(recipe._id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md w-full sm:w-auto"
                >
                  Generate Ingredients
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-center text-xl text-gray-700 mt-10">No Recipes Found</h2>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Generated Ingredients</h2>

            <ul className="list-disc list-inside space-y-1 max-h-72 overflow-auto">
              {generated.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <button
                onClick={downloadIngredients}
                className="flex-1 bg-green-500 text-white py-2 rounded-md"
              >
                Download
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-red-500 text-white py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Recipes;
