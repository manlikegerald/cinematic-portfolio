import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScrollBar from "@/components/primitives/ScrollBar";
import PageWrapper from "@/components/layout/PageWrapper";

// Portfolio pages
const Home          = lazy(() => import("@/pages/Home"));
const Work          = lazy(() => import("@/pages/Work"));
const WorkDetail    = lazy(() => import("@/pages/WorkDetail"));
const About         = lazy(() => import("@/pages/About"));
const Contact       = lazy(() => import("@/pages/Contact"));
const DevPrimitives = lazy(() => import("@/pages/DevPrimitives"));

// Admin pages (no Nav/Footer/SmoothScroll)
const AdminLogin       = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard   = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminProjects    = lazy(() => import("@/pages/admin/AdminProjects"));
const AdminProjectEdit = lazy(() => import("@/pages/admin/AdminProjectEdit"));
const AdminTimeline    = lazy(() => import("@/pages/admin/AdminTimeline"));
const AdminProfile     = lazy(() => import("@/pages/admin/AdminProfile"));

function PageLoader() {
  return (
    <div
      aria-label="Loading"
      style={{
        height: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
      }}
    >
      <span style={{ color: "#444", fontSize: "0.8rem", letterSpacing: "0.1em" }}>Loading…</span>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Admin section — completely separate from portfolio chrome
  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin/login"           element={<AdminLogin />} />
          <Route path="/admin"                 element={<AdminDashboard />} />
          <Route path="/admin/projects"        element={<AdminProjects />} />
          <Route path="/admin/projects/:id"    element={<AdminProjectEdit />} />
          <Route path="/admin/timeline"        element={<AdminTimeline />} />
          <Route path="/admin/profile"         element={<AdminProfile />} />
        </Routes>
      </Suspense>
    );
  }

  // Portfolio section
  return (
    <SmoothScrollProvider>
      <ScrollBar />
      <Nav />
      <PageWrapper>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/"           element={<Home />} />
              <Route path="/work"       element={<Work />} />
              <Route path="/work/:slug" element={<WorkDetail />} />
              <Route path="/about"      element={<About />} />
              <Route path="/contact"    element={<Contact />} />
              <Route path="/dev/primitives" element={<DevPrimitives />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </PageWrapper>
      <Footer />
    </SmoothScrollProvider>
  );
}
