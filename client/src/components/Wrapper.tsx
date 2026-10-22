import type { WrapperProps } from "../types";

// Centered page container: caps content at 1280px and applies the app's
// responsive horizontal padding. Pass `className` for layout (flex, spacing, etc.).
const Wrapper = ({ children, className = "" }: WrapperProps) => (
  <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

export default Wrapper;
