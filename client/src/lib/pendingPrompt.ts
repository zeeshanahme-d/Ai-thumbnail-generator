const PENDING_PROMPT_KEY = "tg_pending_prompt";

// Carries a prompt typed on the homepage through the login redirect to the generator.
export function savePendingPrompt(prompt: string) {
    sessionStorage.setItem(PENDING_PROMPT_KEY, prompt);
}

export function readPendingPrompt(): string {
    return sessionStorage.getItem(PENDING_PROMPT_KEY) ?? "";
}

export function clearPendingPrompt() {
    sessionStorage.removeItem(PENDING_PROMPT_KEY);
}
