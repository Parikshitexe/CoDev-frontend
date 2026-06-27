import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const copyToClipboard = async (text) => {
  // Try modern API first (only works on HTTPS or localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      console.warn('Modern clipboard failed, using fallback', err);
    }
  }

  // Fallback for non-HTTPS connections (like our AWS IP address)
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Make it invisible
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed', err);
  }

  document.body.removeChild(textArea);
};
