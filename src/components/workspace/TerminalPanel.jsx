export default function TerminalPanel({
  showCustomInput,
  setShowCustomInput,
  terminalOutput,
  terminalEndRef,
  customInput,
  setCustomInput
}) {
  return (
    <div className="flex-[3] bg-sidebar border-t border-border flex flex-col">
      <div className="px-3 py-1.5 border-b border-border flex items-center justify-between text-xs text-muted-foreground select-none shrink-0 bg-card">
        <span className="font-medium">Terminal</span>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
          <input 
            type="checkbox" 
            checked={showCustomInput} 
            onChange={(e) => setShowCustomInput(e.target.checked)}
            className="accent-primary w-3 h-3"
          />
          <span>Stdin</span>
        </label>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-chart-2 whitespace-pre-wrap leading-relaxed">
          {terminalOutput || <span className="text-muted-foreground">No output yet. Click Run to execute.</span>}
          <div ref={terminalEndRef} />
        </div>
        
        {showCustomInput && (
          <div className="w-72 border-l border-border bg-sidebar flex flex-col shrink-0">
            <div className="px-3 py-1.5 border-b border-border text-[10px] text-muted-foreground font-medium select-none shrink-0">
              Input
            </div>
            <textarea 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter input..."
              className="flex-1 p-2.5 bg-transparent text-xs text-foreground font-mono placeholder:text-muted-foreground/50 resize-none outline-none border-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
