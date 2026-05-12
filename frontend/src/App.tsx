import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScrollBar from "@/components/primitives/ScrollBar";
import PageWrapper from "@/components/layout/PageWrapper";

// Lazy-load all page components for code-splitting
const Home          = lazy(() => import("@/pages/Home"));
const Work          = lazy(() => import("@/pages/Work"));
const WorkDetail    = lazy(() => import("@/pages/WorkDetail"));
const About         = lazy(() => import("@/pages/About"));
const Contact       = lazy(() => import("@/pages/Contact"));
const DevPrimitives = lazy(() => import("@/pages/DevPrimitives"));

function PageLoader() {
  return (
    <div
      aria-label="Loading"
      style={{
        height: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="text-eyebrow" style={{ color: "var(--color--grey-2)" }}>
        Loading…
      </span>
    </div>
  );
}

export default function App() {
  const location = useLocation();

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
              {/* Dev-only showcase — remove before production if desired */}
              <Route path="/dev/primitives" element={<DevPrimitives />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </PageWrapper>
      <Footer />
    </SmoothScrollProvider>
  );
}
