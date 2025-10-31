import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* All routes will be defined here */}
          <Route path="/" element={<div>Patient Portal Page</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;