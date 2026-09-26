import { useRef, useState, type ComponentType, type MouseEvent } from "react";
import {
  ArrowRight,
  ImageIcon,
  Loader2,
  Palette,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../Button";
import PopoverPanel from "../PopoverPanel";
import AspectRatioPicker from "./AspectRatioPicker";
import ReferenceImageUpload from "./ReferenceImageUpload";
import {
  ASPECT_RATIOS,
  PROMPT_TEMPLATES,
  THUMBNAIL_STYLES,
  THUMBNAIL_STYLES_COLORS,
} from "../../data/generator";
import useImprovePrompt from "../../core/thumbnails/hooks/use-improve-prompt";
import { getApiErrorMessage } from "../../lib/axios";
import { useSession } from "../../store/useSessionStore";
import type { PromptCardProps } from "../../types";
import StylePicker from "./StylePicker";
import ColorSchemePicker from "./ColorSchemePicker";

const STYLE_PANEL_ID = "prompt-style-panel";
const COLOR_PICKER_ID = "prompt-color-picker-panel";
const FORMAT_PANEL_ID = "prompt-format-panel";
const REFERENCE_PANEL_ID = "prompt-reference-panel";

const PromptCard = ({
  id = "prompt-input",
  label,
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  placeholder = "Describe your thumbnail vision in detail... a cinematic gaming battle with fire and lightning at sunset",
  maxLength = 500,
  submitLabel = "Generate Thumbnail",
  showTools = true,
  disabled = false,
  className = "",
}: PromptCardProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [style, setStyle] = useState(THUMBNAIL_STYLES[0].label);
  const [colorScheme, setColorScheme] = useState<string>(
    THUMBNAIL_STYLES_COLORS[0].label,
  );
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].value);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);
  // Improving calls a signed-in endpoint, so guests only get the templates.
  const isAuthenticated = useSession((state) => state.isAuthenticated);
  const { mutate: improve, isPending: isImproving } = useImprovePrompt();

  // Controlled when `value` is passed, otherwise the component keeps its own state.
  const prompt = value ?? internalValue;
  const hasPrompt = prompt.trim().length > 0;
  const canSubmit = hasPrompt && !disabled && !isImproving;
  const hasReference = Boolean(referenceImage);

  const handleChange = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const handleUseTemplate = (templatePrompt: string) => {
    handleChange(templatePrompt);
    textareaRef.current?.focus();
  };

  const handleImprove = () => {
    improve(prompt.trim(), {
      onSuccess: (improved) => handleChange(improved.slice(0, maxLength)),
      onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't improve your prompt.")),
    });
  };

  const handleCardMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (
      (event.target as HTMLElement).closest(
        "button, a, textarea, input, [popover]",
      )
    ) {
      return;
    }
    event.preventDefault();
    textareaRef.current?.focus();
  };

  const trackPanel = (panelId: string) => (isOpen: boolean) =>
    setOpenPanelId((current) => {
      if (isOpen) return panelId;
      return current === panelId ? null : current;
    });

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({
      prompt: prompt.trim(),
      style,
      aspectRatio,
      colorScheme,
      referenceImage,
    });
  };

  return (
    <div
      onMouseDown={handleCardMouseDown}
      className={`cursor-text rounded-2xl border bg-background-card p-4 sm:p-5 transition-[border-color,box-shadow] duration-200 ${
        isFocused
          ? "border-primary shadow-[0_8px_32px_-4px_rgba(230,57,70,0.25)]"
          : "border-border shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)]"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {label && (
            <label
              htmlFor={id}
              className="text-[11px] font-semibold uppercase tracking-widest text-text-muted"
            >
              {label}
            </label>
          )}

          {showTools && (
            <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
              <span>
                Style:{" "}
                <span className="font-medium text-text-secondary">{style}</span>
              </span>
              <span className="h-3 w-px bg-border" />
              <span>
                Color:{" "}
                <span className="font-medium text-text-secondary">
                  {colorScheme}
                </span>
              </span>
              <span className="h-3 w-px bg-border" />
              <span>
                Aspect ratio:{" "}
                <span className="font-medium text-text-secondary">
                  {aspectRatio}
                </span>
              </span>
              {hasReference && (
                <>
                  <span className="h-3 w-px bg-border" />
                  <span className="flex items-center gap-1">
                    Reference:{" "}
                    <span className="font-medium inline-block text-text-secondary truncate max-w-[150px]">
                      {referenceImage?.name}
                    </span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* The tooltip sits on the wrapper: disabled buttons get no hover events in Chrome,
            so pointer-events-none lets the hover reach it while the prompt is empty. */}
        {isAuthenticated && (
          <span
            className="inline-flex shrink-0"
            title={hasPrompt ? "Improve my prompt with AI" : "Write a prompt, then improve it with AI"}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              rounded="lg"
              disabled={!hasPrompt || disabled || isImproving}
              onClick={handleImprove}
              aria-label="Improve my prompt with AI"
              className="disabled:pointer-events-none"
            >
              {isImproving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <WandSparkles size={16} />
              )}
            </Button>
          </span>
        )}
      </div>

      <textarea
        ref={textareaRef}
        id={id}
        value={prompt}
        maxLength={maxLength}
        readOnly={isImproving}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            handleSubmit();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`block w-full min-h-32 sm:min-h-[150px] max-h-[220px] h-auto resize-none border-none bg-transparent text-[0.95rem] leading-relaxed text-text-primary outline-none placeholder:text-text-muted ${
          label || isAuthenticated ? "mt-3" : ""
        }`}
      />

      {/* One swipeable row, bleeding to the card edges so chips aren't cut off at the padding */}
      {!hasPrompt && !disabled && (
        <div className="-mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 scrollbar-none sm:-mx-5 sm:px-5">
          <span className="shrink-0 text-xs text-text-muted">Start from a template:</span>
          {PROMPT_TEMPLATES.map(({ label: templateLabel, icon: Icon, prompt: templatePrompt }) => (
            <Button
              key={templateLabel}
              type="button"
              variant="secondary"
              size="xs"
              fullWidth={false}
              onClick={() => handleUseTemplate(templatePrompt)}
              className="shrink-0 whitespace-nowrap"
            >
              <Icon size={14} />
              {templateLabel}
            </Button>
          ))}
        </div>
      )}

      <div className="prompt-tools-anchor mt-4 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-y-3">
          {showTools && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <ToolButton
                  panelId={STYLE_PANEL_ID}
                  icon={Sparkles}
                  label="Visual style"
                  isOpen={openPanelId === STYLE_PANEL_ID}
                  isConfigured
                />
                <ToolButton
                  panelId={COLOR_PICKER_ID}
                  icon={Palette}
                  label="Color Scheme"
                  isOpen={openPanelId === COLOR_PICKER_ID}
                  isConfigured
                />
                <ToolButton
                  panelId={FORMAT_PANEL_ID}
                  icon={SlidersHorizontal}
                  label="Format & settings"
                  isOpen={openPanelId === FORMAT_PANEL_ID}
                  isConfigured
                />
                <ToolButton
                  panelId={REFERENCE_PANEL_ID}
                  icon={ImageIcon}
                  label="Reference image"
                  isOpen={openPanelId === REFERENCE_PANEL_ID}
                  isConfigured={hasReference}
                />
              </div>
            </>
          )}

          {showTools ? (
            <></>
          ) : (
            <p className="flex-1 text-xs text-text-muted">
              {canSubmit
                ? "Ready to generate"
                : "Describe your vision to begin"}
            </p>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <span className="text-xs text-text-muted shrink-0">
            {prompt.length}/{maxLength}
          </span>
          <Button
            type="button"
            variant="primary"
            size="sm"
            rounded="lg"
            fullWidth={false}
            disabled={!canSubmit}
            onClick={handleSubmit}
            title="Ctrl + Enter"
            className="flex-1 sm:flex-none"
          >
            {submitLabel}
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>

      {showTools && (
        <>
          <PopoverPanel
            id={STYLE_PANEL_ID}
            title="Visual style"
            onOpenChange={trackPanel(STYLE_PANEL_ID)}
          >
            <StylePicker value={style} onChange={setStyle} />
          </PopoverPanel>

          <PopoverPanel
            id={COLOR_PICKER_ID}
            title="Color Scheme"
            onOpenChange={trackPanel(COLOR_PICKER_ID)}
          >
            <ColorSchemePicker value={colorScheme} onChange={setColorScheme} />
          </PopoverPanel>

          <PopoverPanel
            id={FORMAT_PANEL_ID}
            title="Format & settings"
            onOpenChange={trackPanel(FORMAT_PANEL_ID)}
          >
            <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} />
          </PopoverPanel>

          <PopoverPanel
            id={REFERENCE_PANEL_ID}
            title="Reference image"
            onOpenChange={trackPanel(REFERENCE_PANEL_ID)}
          >
            <ReferenceImageUpload
              file={referenceImage}
              onFileChange={setReferenceImage}
            />
          </PopoverPanel>
        </>
      )}
    </div>
  );
};

interface ToolButtonProps {
  panelId: string;
  icon: ComponentType<{ size?: number }>;
  label: string;
  isOpen: boolean;
  isConfigured: boolean;
}

const ToolButton = ({
  panelId,
  icon: Icon,
  label,
  isOpen,
  isConfigured,
}: ToolButtonProps) => (
  <Button
    type="button"
    variant={isOpen ? "primary" : "secondary"}
    size="icon"
    rounded="lg"
    popoverTarget={panelId}
    title={label}
    aria-label={label}
    className="relative"
  >
    <Icon size={16} />
    {isConfigured && !isOpen && (
      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-500" />
    )}
  </Button>
);

export default PromptCard;
