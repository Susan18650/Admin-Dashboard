import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import ProSidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

import Dashboard from "./scenes/dashboard";
// pages data
import Customer from "./scenes/customer";
import Products from "./scenes/product";
import Category from "./scenes/category";
import Users from "./scenes/user";
import VoucherManage from "./scenes/voucher";

// personal 
import MyProfile from "./scenes/myProfile";
import CreateAccount from "./scenes/form";

// apps
import Calendar from "./scenes/calendar/calendar";
import KanbanBoard from "./scenes/kanban/KanbanBoard";
import FAQ from "./scenes/faq"

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <ProSidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
            <Route path="/" element={<Dashboard />} />

              <Route path="/customer-manage" element={<Customer />} />
              <Route path="/category-manage" element={<Category />} />
              <Route path="/product-manage" element={<Products />} />
              <Route path="/user-manage" element={<Users />} />
              <Route path="/voucher-manage" element={<VoucherManage />} />

              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/add-account" element={<CreateAccount />} />
              
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
