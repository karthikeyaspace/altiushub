import React, { useState } from "react";
import SignupComponent from "../components/SignupComponent";
import ProductsComponent from "../components/ProductsComponent";
import UserProfileComponent from "../components/UserProfileComponent";

type ActiveTab = "signup" | "products" | "userProfile" | "csrfTest";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("signup");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "signup":
        return <SignupComponent />;
      case "products":
        return <ProductsComponent />;
      case "userProfile":
        return <UserProfileComponent />;
      default:
        return <SignupComponent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <nav className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">API Dashboard</h1>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "signup"
                ? "bg-blue-600 text-white shadow-md transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "products"
                ? "bg-blue-600 text-white shadow-md transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "userProfile"
                ? "bg-blue-600 text-white shadow-md transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              onClick={() => setActiveTab("userProfile")}
            >
              User Profile
            </button>
          </div>
        </nav>

        <main className="bg-white rounded-xl shadow-lg p-8 min-h-96">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
