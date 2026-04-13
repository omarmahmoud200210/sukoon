import { Route } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";
import Features from "../pages/landing/Features";
import About from "../pages/landing/About";
import NewsLetter from "../pages/landing/NewsLetter";

export const LandingRoutes = (
    <Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/newsletter" element={<NewsLetter />} />
    </Route>
);