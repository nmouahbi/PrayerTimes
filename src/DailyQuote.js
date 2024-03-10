import React from "react";
import dailyQuotes from "./DailyQuotes"; // Ensure this path is correct

const DailyQuote = () => {
  const today = new Date();
  const index = today.getDate() % dailyQuotes.length; // Get a unique quote each day of the month
  const quote = dailyQuotes[index];

  return (
    <div id="dailyQuota">
      <p>{quote}</p>
    </div>
  );
};

export default DailyQuote;
