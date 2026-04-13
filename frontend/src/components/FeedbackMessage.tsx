interface FeedbackMessageProps {
  message: string;
  tone: "error" | "success";
}

export function FeedbackMessage({ message, tone }: FeedbackMessageProps) {
  return (
    <div className={`feedback feedback--${tone}`} role={tone === "error" ? "alert" : "status"}>
      {message}
    </div>
  );
}
