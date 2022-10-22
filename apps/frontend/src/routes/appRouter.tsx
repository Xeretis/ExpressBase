import { Route, Routes } from "react-router-dom";

import { Dashboard } from "../pages/protected/dashboard";
import { Home } from "../pages/protected/home";
import { Index } from "../pages/public";
import { Login } from "../pages/public/login";
import { ProtectedLayout } from "./layouts/protectedLayout";
import { Register } from "../pages/public/register";
import { RequireAuth } from "./helpers/requireAuth";
import { RequireNoAuth } from "./helpers/requireNoAuth";

export const AppRouter = () => {
    return (
        <Routes>
            <Route element={<RequireNoAuth redirect="/home" />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<RequireAuth />}>
                <Route element={<ProtectedLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Route>
        </Routes>
    );
};
