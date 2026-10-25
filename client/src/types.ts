import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type React from "react";

export type CapabilityId = "format" | "style" | "color-scheme" | "improve" | "reference" | "category";

export interface ICapability {
  id: CapabilityId;
  /** Short mono label above the title. */
  label: string;
  title: string;
  description: string;
}

export interface CapabilityDemoProps {
  /** On screen and not being hovered or focused: the demo may play by itself. */
  active: boolean;
}

export interface CapabilityTileProps {
  capability: ICapability;
  demo: React.ComponentType<CapabilityDemoProps>;
  index: number;
  className?: string;
}

export interface IStep {
  title: string;
  description: string;
}

/** A generator setting shown as a chip in the homepage walkthrough: "Style · Bold & Graphic". */
export interface IProcessSetting {
  label: string;
  value: string;
}

export interface PromptMockProps {
  prompt: string;
  settings: IProcessSetting[];
  showSettings?: boolean;
  className?: string;
}

export interface FeedMockProps {
  videos: IYtPreviewVideo[];
  /** Index of the video the walkthrough's thumbnail lands on; marked for the timeline. */
  slot?: number;
  className?: string;
}

export interface ProcessTimelineProps {
  /** The tall scroll container that holds the sticky stage. */
  scope: React.RefObject<HTMLDivElement | null>;
}

export interface PromptSubmission {
  prompt: string;
  style: string;
  format: string;
  category: string;
  colorScheme: string;
  textOverlay: boolean;
  referenceImage: File | null;
}

export interface PromptCardProps {
  id?: string;
  label?: string;
  value?: string;
  /** Starting text when the card manages its own value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (submission: PromptSubmission) => void;
  placeholder?: string;
  /** Accessible name for the textarea when there is no visible label, e.g. while the placeholder changes. */
  ariaLabel?: string;
  maxLength?: number;
  rows?: number;
  submitLabel?: string;
  showTools?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ButtonStyleOptions {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "inverse";
  size?: "xs" | "sm" | "md" | "lg" | "icon" | "iconSm" | "iconLg";
  rounded?: "full" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export type AlertVariant = "error" | "success" | "warning" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export interface ListErrorProps {
  onRetry: () => void;
  className?: string;
}

export interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export interface IThumbnailSample {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ThumbnailScrollerProps {
  items: IThumbnailSample[];
  direction?: "left" | "right"; // "left" = scrolls right→left, "right" = left→right
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
}

export interface IHeroSpec {
  label: string;
  value: string;
  note?: string;
}

export interface HeroSpecsProps {
  /** Seconds before the first row fades in. */
  delay?: number;
  className?: string;
}

export interface IThumbnailStyle {
  label: string;
  description: string;
}

/** A starter prompt for one video niche, offered while the prompt box is empty. */
export interface IPromptTemplate {
  label: string;
  icon: LucideIcon;
  prompt: string;
}

/** Where a thumbnail will be posted, which sets its size. */
export interface IThumbnailFormat {
  value: string;
  platform: string;
  /** Short name inside its platform's row in the picker. */
  label: string;
  /** Full name, shown on its own. */
  name: string;
  aspectRatio: string;
}

export interface IThumbnailCategory {
  label: string;
  icon: LucideIcon;
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

export interface DashboardPageProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Right side of the header: counts and page actions. */
  actions?: ReactNode;
  /** The page body; a "Coming soon" placeholder when left out. */
  children?: ReactNode;
}

export interface SettingsSectionProps {
  title: string;
  description?: string;
  /** Red-tinted card border for destructive settings. */
  danger?: boolean;
  children: ReactNode;
}

export type CommunitySort = "trending" | "newest" | "most-liked";

/** Query filters shared by the thumbnail list pages. */
export interface ThumbnailFilters {
  search?: string;
  sort?: string;
  style?: string;
  userId?: string;
  limit?: number;
}

export interface CommunityProps {
  /** dashboard: inside the dashboard shell (default). public: the /community page with its PageHeader. */
  variant?: "dashboard" | "public";
}

export interface CommunityFiltersProps {
  setParams?: React.Dispatch<React.SetStateAction<ThumbnailFilters>>;
  search?: string;
  onSearchChange?: (value: string) => void;
  sort: CommunitySort;
  onSortChange: (value: CommunitySort) => void;
  activeStyle: string;
  onStyleChange: (value: string) => void;
}

/** The page a thumbnail detail view was opened from, used for its breadcrumb. */
export type PreviewSource =
  | "community"          // /community or /dashboard/community
  | "gallery"            // /dashboard/gallery
  | "generate"           // /dashboard/generate
  | "profile"            // /profile
  | "recycle-bin";       // /dashboard/recycle-bin

export interface ThumbnailCardProps {
  thumbnail: Thumbnail;
  showDelete?: boolean;
  showLike?: boolean;
  showPublish?: boolean;
  source?: PreviewSource;
  onDelete?: (id: string) => void;
  showRecycleBinActions?: boolean;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  restoring?: boolean;
}

export interface SectionTitleProps {
  text1?: string;
  text2: ReactNode;
  text3: string;
  /** h1 when the title heads its own page. */
  as?: "h1" | "h2";
  /** Scroll-in animation, used on the homepage and pricing page. */
  animate?: boolean;
  /**
   * center: pill, heading and description stacked in the middle (default).
   * start: the same stack, left-aligned, with a mono eyebrow.
   * split: heading on the left, description on the right from `lg` up.
   * start and split reveal the heading line by line: pass `text2` as an array of lines.
   */
  align?: "center" | "start" | "split";
  /** Extra content under the description, such as an action or a "last updated" note. */
  children?: ReactNode;
}

export interface PageHeaderProps {
  eyebrow: string;
  /** One entry per line. */
  title: ReactNode[];
  description: string;
  /** Under the description: an action, a count, a date. */
  children?: ReactNode;
  /** The line-by-line reveal; only where motion is allowed (/pricing). */
  animate?: boolean;
}

export interface MaskedLinesProps {
  lines: ReactNode[];
  /** mount: reveal right away (above the fold). inView: when scrolled into view. */
  trigger?: "mount" | "inView";
  delay?: number;
}

export interface EyebrowProps {
  children: ReactNode;
  /** A small brand-red status dot before the label. */
  dot?: boolean;
  className?: string;
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

export type PlanId = "free" | "pro" | "ultra";

export interface CheckoutPayload {
  plan: Exclude<PlanId, "free">;
  billing: BillingPeriod;
}

/** A one-time credit pack: 25 to 2,500 credits in steps of 5 (CREDIT_PACK in data/pricing.ts). */
export interface CreditPackCheckoutPayload {
  credits: number;
}

export interface TestCheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface IPricingPlan {
  /** Matches UserPlan on the server. */
  id: PlanId;
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
}

export interface BillingToggleProps {
  billing: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  /** Placement classes; defaults to centered with space above. */
  className?: string;
}

export interface IBillingOption {
  value: BillingPeriod;
  label: string;
}

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export interface AnimatedValueProps {
  value: string | number;
  className?: string;
}

export interface ICreditFact {
  title: string;
  description: string;
}

export interface IPlanComparisonRow {
  feature: string;
  /** One value per plan, in `pricingPlans` order: text, or whether the plan includes it. */
  values: (string | boolean)[];
}

export interface ComparisonValueProps {
  value: string | boolean;
}

export interface FooterColumnProps {
  column: IFooter;
}

export interface IFaq {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: IFaq[];
}

export interface FaqItemProps {
  faq: IFaq;
  number: number;
  isOpen: boolean;
  onToggle: () => void;
}

export type LegalDocumentId = "privacy" | "terms" | "refund";

export interface ILegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface ILegalDocument {
  id: LegalDocumentId;
  title: string;
  path: string;
  summary: string;
  updatedAt: string;
  sections: ILegalSection[];
}

export interface LegalPageProps {
  documentId: LegalDocumentId;
}

export interface LegalTocProps {
  sections: ILegalSection[];
}

export interface LegalSectionProps {
  section: ILegalSection;
  number: number;
}

export interface RelatedLegalDocsProps {
  currentId: LegalDocumentId;
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
  username?: string;
  image_url?: string;
  avatar?: MediaAsset;
}

export interface MediaAsset {
  url: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  image_url: string;
  avatar: MediaAsset;
  bio: string;
  website: string;
  provider: "email" | "google" | string;
  isVerified: boolean;
  plan: "free" | "pro" | "ultra" | string;
  freeCredits: number;
  usedCredits: number;
  subscriptionCredits: number;
  packCredits: number;
  totalCredits: number;
  creditsResetAt: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionRenewsAt: string | null;
  subscriptionPeriodEnd: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  credits: number;
}

export interface Thumbnail {
  _id: string;
  title: string;
  image_url?: string;
  thumbnail?: MediaAsset;
  aspect_ratio?: string;
  format?: string;
  category?: string;
  color_scheme?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
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
  isLiked?: boolean;
  __v?: number;
}

export type AuthMode =
  | "login"
  | "signup"
  | "forgotPassword"
  | "verifyOtp"
  | "resetPassword";

/** Which flow the 6-digit code screen serves. */
export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Above the title: the sign-in/register tabs or a back button. */
  topSlot?: ReactNode;
}

export type VerifyOtpMode = "reset-password" | "verify-email";

export interface VerifyOtpProps {
  mode?: VerifyOtpMode;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type YtPreviewTheme = "light" | "dark";
export type YtPreviewLayout = "home" | "search" | "mobile";

/** One video tile in the YouTube preview mockups. */
export interface IYtPreviewVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  channelAvatarUrl?: string;
  views: string;
  publishedAgo: string;
  duration: string;
}

export interface YtPreviewState {
  thumbnail: Thumbnail;
}

export interface ThumbnailPreviewState {
  thumbnail: Thumbnail;
  /** Where the user navigated from — used to build breadcrumbs */
  source: PreviewSource;
}

export interface YtVideoProps {
  video: IYtPreviewVideo;
  theme: YtPreviewTheme;
}

export interface YtThumbnailProps {
  video: IYtPreviewVideo;
  className?: string;
}

export interface YtAvatarProps {
  name: string;
  imageUrl?: string;
  className?: string;
}

export interface YtFeedProps {
  videos: IYtPreviewVideo[];
  theme: YtPreviewTheme;
  /** Text in the search box of the search results layout. */
  searchQuery?: string;
}

export interface YtHeaderProps {
  theme: YtPreviewTheme;
  query?: string;
}

export interface PageLoaderProps {
  /** Fill the whole screen, for loads that happen before any layout is shown. */
  fullScreen?: boolean;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode);
  onReset?: () => void;
}


