import React, { useState, useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { TbTemperatureCelsius } from "react-icons/tb";
import { TbTemperatureFahrenheit } from "react-icons/tb";
import logo1 from "../Assets/rain-water-drops.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { FaCloud } from "react-icons/fa";
import { format, startOfWeek, addDays } from "date-fns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

const AppContainer = () => {
  const [timeData, setTimeData] = useState({
    hours: 0,
    days: 0,
    minutes: 0,
    months: 0,
  });

  const [city, setCity] = useState("");
  const [temperatureData, setTemperatureData] = useState([]);
  const [HoursData, setHoursData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [mode, setMode] = useState("today");
  const [modeChart, setModeChart] = useState("line");

  const [loading, setLoading] = useState(true);

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTimeData();
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Fetch user's geolocation on page load
    fetchGeolocation();
  }, []);

  useEffect(() => {
    // Fetch weather data when city changes
    if (city) {
      fetchWeatherData();
      getHourlyData();
    }
  }, [city]);

  const fetchTimeData = () => {
    let timeData = new Date();
    let hours = timeData.getHours();
    let days = timeData.getDay();
    let minutes = timeData.getMinutes();
    let months = timeData.getMonth();

    setTimeData({
      hours,
      days,
      minutes,
      months,
    });
  };
  const keyAPI = "9KRCXLHY9WWRD7X5P24YKT6YE";
  const fetchWeatherData = async () => {
    try {
      const data = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${keyAPI}`
      );
      const json = await data.json();
      setTemperatureData(json);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
    }
  };

  const getHourlyData = async () => {
    try {
      const data = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${keyAPI}`
      );
      const json = await data.json();
      setHoursData(json?.days[0]?.hours);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hourly data:", error);
      setLoading(false);
    }
  };

  const handleWeekData = async () => {
    try {
      const data = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${keyAPI}`
      );
      const json = await data.json();

      // Filter data for the next 7 days
      const currentDate = new Date();
      const next7DaysData = json?.days.filter((day) => {
        const dayDate = new Date(day.datetime);
        return dayDate >= currentDate && dayDate <= addDays(currentDate, 7);
      });

      setWeekData(next7DaysData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
      setLoading(false);
    }
  };

  const fetchGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchCityByGeolocation(latitude, longitude);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setLoading(false);
      }
    );
  };

  const fetchCityByGeolocation = async (latitude, longitude) => {
    const apiKey = "bdaab72aca5a4ed5b63d065a7630a315";
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const cityName = data.results[0].components.village || "";
        setCity(cityName);
      } else {
        console.error("Unable to fetch city name from geolocation data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
      setLoading(false);
    }
  };

  // chart js

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ambient Room Temperature",
      },
      scales: {
        y: {
          min: Math.min(
            ...(HoursData?.map((hour) =>
              Math.ceil(((hour.temp - 32) * 5) / 9)
            ) || [])
          ),
          max: Math.max(
            ...(HoursData?.map((hour) =>
              Math.ceil(((hour.temp - 32) * 5) / 9)
            ) || [])
          ),
        },
      },
    },
  };

  const labels = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
  ];
  const batteryDataHour = [
    10, 20, 20, 40, 50, 55, 10, 9, 40, 50, 5, 9, 6, 11, 23, 45, 15, 25, 30, 35,
    45, 50, 15, 10,
  ];
  const batteryDataDay = [10, 20, 20, 40, 50, 55, 10, 9];

  const data = {
    labels:
      mode === "today"
        ? HoursData?.map((hour) => hour.datetime)
        : weekData?.map((day) => weekDays[new Date(day.datetime).getDay()]),
    datasets: [
      {
        label: "Temperature in Celsius",
        data:
          mode === "today"
            ? HoursData?.map((hour) => Math.ceil(((hour.temp - 32) * 5) / 9))
            : weekData?.map((day) => Math.ceil(((day.temp - 32) * 5) / 9)),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Battery",
        data:
          mode === "today"
            ? batteryDataHour.map((items) => items)
            : batteryDataDay.map((items) => items),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className="app-container">
        <div className="innner-app-layout bg-white w-[60%] h-[80vh] rounded-lg  shadow-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-center h-full rounded-2xl ">
            <div className="left h-full w-[14rem] px-2 py-5 shadow-4xl  rounded-l-lg   bg-[#d3dfe5]">
              <div className="relative">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  className="px-2 outline-none py-2 rounded-md"
                  placeholder="search...."
                />
                <IoIosSearch
                  onClick={() => fetchWeatherData()}
                  className="absolute cursor-pointer top-0 right-0 bg-blue-500 text-white  h-full w-[20%] "
                />
              </div>
              {temperatureData.length === 0 ? (
                <h1 className="flex justify-center items-center h-[60vh] ">
                  Search city Weather...😁
                </h1>
              ) : (
                <>
                  <img className="w-[100px] mx-auto mt-10" src={logo1} alt="" />
                  <div className="mt-5 ">
                    <h1 className="text-4xl">
                      {Math.ceil(
                        ((temperatureData?.currentConditions?.temp - 32) * 5) /
                          9
                      )}
                      &deg;C
                    </h1>
                    <p className="mt-1">{`${weekDays[timeData.days]} , ${
                      Months[timeData.months]
                    },${timeData.hours}:${timeData.minutes}`}</p>
                    <p className="flex items-center mt-4 font-bold">
                      {" "}
                      <FaCloud className="mr-2" />{" "}
                      {temperatureData?.currentConditions?.conditions}
                    </p>
                  </div>
                  <div className="flex mt-4 items-center border-t-2 px-2">
                    <FaLocationDot className="mr-2" />
                    <span className="font-bold">
                      {temperatureData.resolvedAddress}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="right  py-4 px-10 bg-[#eaeaea] rounded-r-lg w-[48rem]">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    onClick={() => {
                      getHourlyData();
                      setMode("today");
                    }}
                    className={`cursor-pointer font-bold ${
                      mode === "today" ? "active" : ""
                    }`}
                  >
                    Today
                  </div>
                  <div
                    onClick={() => {
                      handleWeekData();
                      setMode("week");
                    }}
                    className={`cursor-pointer font-bold ${
                      mode === "week" ? "active" : ""
                    }`}
                  >
                    Week
                  </div>

                  {/* Chart Mode changer */}
                  <div
                    onClick={() => {
                      getHourlyData();
                      setModeChart("line");
                    }}
                    className={`cursor-pointer font-bold ${
                      modeChart === "line" ? "active" : ""
                    }`}
                  >
                    LineChart
                  </div>
                  <div
                    onClick={() => {
                      handleWeekData();
                      setModeChart("bar");
                    }}
                    className={`cursor-pointer font-bold ${
                      modeChart === "bar" ? "active" : ""
                    }`}
                  >
                    BarChart
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <TbTemperatureCelsius />
                  <TbTemperatureFahrenheit />
                </div>
              </div>
              <div className="mt-10 ">
                {HoursData.length === 0 ? (
                  <h1 className="flex justify-center items-center h-[50vh]">
                    weather check today by clicking today.......
                  </h1>
                ) : (
                  <div className="mt-10 w-[40rem] h-[45vh] ">
                    {modeChart === "bar" ? (
                      <Bar options={options} data={data} />
                    ) : (
                      <Line options={options} data={data} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppContainer;
