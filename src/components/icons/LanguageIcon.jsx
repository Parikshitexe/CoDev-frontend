export default function LanguageIcon({ language, className = "" }) {
  const iconMap = {
    javascript: "javascript/javascript-original.svg",
    python: "python/python-original.svg",
    cpp: "cplusplus/cplusplus-original.svg",
    java: "java/java-original.svg",
  };

  const iconPath = iconMap[language?.toLowerCase()] || "javascript/javascript-original.svg";

  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath}`}
      alt={`${language} icon`}
      className={`object-contain ${className}`}
    />
  );
}
