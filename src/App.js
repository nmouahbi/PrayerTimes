import React from "react";
import DailyQuote from "./DailyQuote"; // Make sure this is the updated component that uses dailyQuotes array
import PrayerTimes from "./PrayerTimes";
import "./App.css"; // Ensure you have this file for CSS

function App() {
  const city = "Orlando";
  const country = "US";
  const method = 2;

  return (
    <div className="App">
      <header>
        {" "}
        <DailyQuote />
      </header>
      {/* No need for quotaUrl prop anymore */}
      <div>
        <PrayerTimes city={city} country={country} method={method} />
      </div>
    </div>
  );
}

export default App;
