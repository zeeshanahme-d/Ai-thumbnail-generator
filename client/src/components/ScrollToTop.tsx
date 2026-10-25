import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// A new page opens at the top; back/forward and #anchor links keep their own position.
export default function ScrollToTop() {
    const { pathname, hash } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType !== "POP" && !hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname, hash, navigationType]);

    return null;
}
