import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DarkModeToggle from "./DarkMode";
import {
  faBars,
  faUtensils,
  faPlus,
  faStar,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faQuestionCircle,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const LogoutUser = () => {
    if (window.confirm("Want to Logout from this Session?")) {
      localStorage.clear();
      window.location.href = "/login";
    } else {
      window.location.href = "/recipes";
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const auth = localStorage.getItem("token");

  const handleToggleMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-[#F4A261] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center relative">

        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faBars}
            className="text-white text-2xl cursor-pointer md:hidden transition-transform duration-300"
            onClick={toggleMenu}
            style={isOpen ? { transform: "rotate(90deg)" } : {}}
          />

          <NavLink to="/" className="text-white text-xl font-semibold">
            <img src={logo} alt="Logo" className="h-12 w-auto ml-4 transition-all duration-300" />
          </NavLink>
        </div>

        <div className="hidden md:flex items-center mr-4">
          <DarkModeToggle />
        </div>

        <div
          className={`flex flex-col md:flex-row items-center ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <ul className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0 bg-[#F4A261] md:bg-transparent p-4 md:p-0 rounded-lg">

            {isOpen && (
              <li className="md:hidden flex justify-center mb-2">
                <DarkModeToggle />
              </li>
            )}

            {auth ? (
              <>
                <li>
                  <NavLink
                    to="/recipes"
                    onClick={handleToggleMenu}
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faUtensils} />
                    <span>Recipes</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/addRecipe"
                    onClick={handleToggleMenu}
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add Recipe</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/favouriteRecipes"
                    onClick={handleToggleMenu}
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faStar} />
                    <span>Favourites</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/contact"
                    onClick={handleToggleMenu}
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faPhone} />
                    <span>Contact</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/login"
                    onClick={LogoutUser}
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} />
                    <span>Login</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/signup"
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span>SignUp</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/forgotPassword"
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span>Forgot Password</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/contact"
                    onClick={handleToggleMenu}
                    className="text-white hover:text-[#E63946] flex items-center space-x-2 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faPhone} />
                    <span>Contact</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="md:hidden absolute right-4 top-3">
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
