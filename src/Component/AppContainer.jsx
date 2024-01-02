import React, { useState, useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { TbTemperatureCelsius } from "react-icons/tb";
import { TbTemperatureFahrenheit } from "react-icons/tb";
import logo1 from "../Assets/rain-water-drops.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { FaCloud } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const AppContainer = () => {
  const [timeData, setTimeData] = useState({
    hours: 0,
    days: 0,
    minutes: 0,
    months: 0,
  });
  //   let city = useRef(null);

  const [city, setCity] = useState("");
  const [temperatureData, setTemperatureData] = useState([]);
  const [HoursData, setHoursData] = useState([]);
  const [weekData, setWeekData] = useState([]);
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

  const fetchWeatherData = async () => {
    const data = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=PSG8SS4V2ZZ5VZXNUPG8A6JHC`
    );
    const json = await data.json();
    setTemperatureData(json);
  };

  const getHourlyData = async () => {
    const data = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=PSG8SS4V2ZZ5VZXNUPG8A6JHC`
    );
    const json = await data.json();
    setHoursData(json?.days[0]?.hours);
  };

  const handleWeekData = async () => {
    const data = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=PSG8SS4V2ZZ5VZXNUPG8A6JHC`
      );
      const json = await data.json();
      setWeekData(json?.days);
  }

  // chart js

  ChartJS.register(
    CategoryScale,
    LinearScale,
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
  const batteryData = [10,20,3,40,50,55,10,9,40,50,0,9,6,11,23,45]

  const data = {
    labels: HoursData?.map((hour) => hour.datetime) || weekData?.map((week) => week.datetime),
    datasets: [
      {
        label: "Temperature in Celsius",
        data: HoursData?.map((hour) => Math.ceil(((hour.temp - 32) * 5) / 9)),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Battery",
        data: batteryData.map((items) => items),
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
                <h1 className="flex justify-center items-center h-[60vh] ">Search city Weather...😁</h1>
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
            <div className="right  py-4 px-10 bg-[#eaeaea]  w-[48rem]">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    onClick={() => getHourlyData()}
                    className="cursor-pointer font-bold"
                  >
                    Today
                  </div>
                  <div onClick={() => handleWeekData()} className="cursor-pointer font-bold">Week</div>
                </div>
                <div className="flex items-center space-x-4">
                  <TbTemperatureCelsius />
                  <TbTemperatureFahrenheit />
                </div>
              </div>
              <div className="mt-10 ">
                {HoursData.length === 0 ? <h1 className="flex justify-center items-center h-[50vh]">weather check today by clicking today.......</h1> :  (
                  <div className="mt-10 w-[40rem] h-[45vh] ">
                    <Bar options={options} data={data} />
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
