import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface ICapability {
  icon: LucideIcon;
  title: string;
  description: string;
  span: "wide" | "narrow"; // wide = 2 grid cols (with visual), narrow = 1 col
  visual?: "canvas" | "upscale"; // decorative art rendered on the wide cards
}

export interface IStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface SelectOption {
  label: string;
  description?: string;
  icon?: ReactNode;
}

export interface SelectProps {
  id: string;
  options: SelectOption[];
  value: SelectOption;
  onChange: (option: SelectOption) => void;
  className?: string;
  popoverBtnClassName?: string;
}

export interface PromptSubmission {
  prompt: string;
  style: string;
  aspectRatio: string;
  colorScheme: string;
  referenceImage: File | null;
  referenceUrl: string;
}

export interface PromptCardProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (submission: PromptSubmission) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  submitLabel?: string;
  showTools?: boolean;
  disabled?: boolean;
  className?: string;
}

export type AlertVariant = "error" | "success" | "warning" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export interface ThumbnailScrollerProps {
  images?: string[];
  direction?: "left" | "right"; // "left" = scrolls right→left, "right" = left→right
  speed?: number;
  gradient?: boolean;
  gradientColor?: string; // must match the section background
  pauseOnHover?: boolean;
  className?: string;
}

export interface IThumbnailStyle {
  label: string;
  description: string;
}

export interface IAspectRatio {
  value: string;
  label: string;
  /** CSS aspect-ratio value used for the preview shape. */
  ratio: string;
}

export interface IDashboardNavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

export interface IDashboardNavSection {
  label: string;
  items: IDashboardNavItem[];
}

export type CommunitySort = "trending" | "newest" | "most-liked" | "featured";

export interface CommunityFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: CommunitySort;
  onSortChange: (value: CommunitySort) => void;
  activeStyle: string;
  onStyleChange: (value: string) => void;
}

export interface ThumbnailCardProps {
  thumbnail: Thumbnail;
  index: number;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  showRecycleBinActions?: boolean;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  restoring?: boolean;
}

export interface SectionTitleProps {
  text1: string;
  text2: string;
  text3: string;
}

export interface TestimonialCardProps {
  testimonial: ITestimonial;
  index: number;
}

export interface ITestimonial {
  image: string;
  name: string;
  handle: string;
  date: string;
  quote: string;
}

export interface IFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IFooter {
  title: string;
  links: IFooterLink[];
}

export interface IFooterLink {
  name: string;
  href: string;
}

export interface NavbarProps {
  navlinks: INavLink[];
}

export interface INavLink {
  name: string;
  href: string;
}

export type BillingPeriod = "monthly" | "yearly";

export interface IPricingPlan {
  name: string;
  tagline: string;
  monthlyPrice: number;
  cta: string;
  features: string[];
  mostPopular?: boolean;
}

export interface PricingCardProps {
  plan: IPricingPlan;
  billing: BillingPeriod;
  index: number;
}

export interface SectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}
export interface UserId {
  _id: string;
  name?: string;
  fullName?: string;
  image_url?: string;
  avatar?: MediaAsset;
}

export interface MediaAsset {
  url: string;
  publicId?: string;
  originalName?: string;
  directory?: string;
  format?: string;
  bytes?: number;
}

export interface Thumbnail {
  _id: string;
  title: string;
  image_url?: string;
  thumbnail?: MediaAsset;
  aspect_ratio?: string;
  color_scheme?: string;
  createdAt: string;
  updatedAt: string;
  isGenerating: boolean;
  model: string;
  userId?: UserId | string;
  prompt_used?: string;
  published?: boolean;
  style?: string;
  text_overlay?: boolean;
  user_prompt?: string;
  deletedAt?: string | null;
  likesCount?: number;
  viewsCount?: number;
  isLiked?: boolean;
  __v?: number;
}

export type AuthMode =
  | "login"
  | "signup"
  | "forgotPassword"
  | "verifyOtp"
  | "resetPassword";
