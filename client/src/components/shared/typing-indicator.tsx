export function TypingIndicator() {
  return (
    <div className="flex gap-1.5 p-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
}
