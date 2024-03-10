import React, { useState, useEffect } from "react";

const PrayerTimes = ({ city, country, method }) => {
  const [times, setTimes] = useState({});
  const [nextPrayer, setNextPrayer] = useState("");
  const [nextPrayerAr, setNextPrayerAr] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [timeLeftAr, setTimeLeftAr] = useState("");

  const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const timings = data.data.timings;
        const firstSixTimings = Object.keys(timings)
          .slice(0, 8)
          .reduce((acc, key) => {
            acc[key] = timings[key];
            return acc;
          }, {});
        setTimes(firstSixTimings);
        calculateNextPrayer(firstSixTimings);
      })
      .catch((error) => console.error("Error fetching prayer times:", error));
  }, [city, country, method]);

  const prayerNamesArabic = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  };

  const calculateNextPrayer = (timings) => {
    const now = new Date();
    const prayerTimes = Object.entries(timings).reduce((acc, [name, time]) => {
      const date = new Date(now.toDateString() + " " + time);
      if (date > now) acc.push({ name, time: date });
      return acc;
    }, []);

    const nextPrayer = prayerTimes.length > 0 ? prayerTimes[0] : null;

    if (nextPrayer) {
      setNextPrayer(
        `${nextPrayer.name} at ${nextPrayer.time.toLocaleTimeString()}`
      );
      setNextPrayerAr(
        `الصلاة التالية: ${
          prayerNamesArabic[nextPrayer.name]
        } في ${nextPrayer.time.toLocaleTimeString()}`
      );
      calculateTimeLeft(nextPrayer.time);
    } else {
      setNextPrayer("Starting tomorrow");
      setNextPrayerAr("ستبدأ غدًا");
    }
  };

  const calculateTimeLeft = (nextPrayerTime) => {
    if (!nextPrayerTime) {
      setTimeLeft("Calculating...");
      setTimeLeftAr("جاري الحساب...");
      return;
    }

    const now = new Date();
    const difference = nextPrayerTime - now;

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      setTimeLeft(`${hours}h ${minutes}m`);
      setTimeLeftAr(`الوقت المتبقي: ${hours}س ${minutes}د`);
    } else {
      setTimeLeft("Starting soon...");
      setTimeLeftAr("ستبدأ قريبًا");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateNextPrayer(times);
    }, 60000); // Update every minute

    return () => clearTimeout(timer);
  }, [times]);

  const boxStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const boxStyle2 = {
    border: "1px solid #bbb", // Lighter border for contrast
    borderRadius: "8px",
    padding: "20px", // Increased padding for better spacing
    margin: "10px 0",
    display: "flex",
    flexDirection: "column", // Stack items vertically
    justifyContent: "center",
    alignItems: "center", // Center align items
    backgroundColor: "#333", // Darker background
    color: "#fff", // Lighter text for contrast
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Enhanced shadow for depth
    textAlign: "center", // Ensure text is centered
  };

  const currentDate = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div id="prayerTimes" style={{ maxWidth: "600px", margin: "auto" }}>
      <div
        className="prayer-date"
        style={{
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Prayer Times for {currentDate}
      </div>
      {Object.entries(times).map(([key, value]) => (
        <div key={key} style={boxStyle}>
          <span style={{ fontWeight: "bold" }}>{key}</span>
          <span>{value}</span>
        </div>
      ))}
      <div style={boxStyle2}>
        <div>
          {nextPrayer} - {timeLeft}
        </div>
      </div>
      <div style={boxStyle2}>
        <div style={{ marginTop: "10px" }}>
          {nextPrayerAr} - {timeLeftAr}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
