import React from "react";
import Chart from "react-apexcharts";
import "../Design/profilepage.css";
import useWindowDimensions from "../Utility_functions/UseWIndowDimensions";
const Barchart = (props) => {
  //console.log(props.data);
  let alpha_accuracy = props.data.data.alpha.map((element, index) => {
    return 100 - Math.round((element.total_errors / element.total_count) * 100);
  });
  let label = props.data.data.alpha.map((element, index) => {
    return element.alphabetname.toUpperCase();
  });
  const { height, width } = useWindowDimensions();
  var series = [
    {
      name: "Accuracy",
      type: "area",
      data: alpha_accuracy,
    },
  ];
  var options = {
    chart: {
      type: "bar",
      // stacked: "true",
      toolbar: {
        show: false,
        // tools: { dowload: false },
      },
    },
    noData: {
      text: "Not enough data available",
      align: "center",
      verticalAlign: "center",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "Blue",
        fontSize: "16px",
        fontFamily: "'Comic Sans MS', 'Comic Sans','Marker Felt',sans-serif",
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      // background-image: linear-gradient(to right, #a330b8, #158897);
      colors: ["#158897"],
      type: "gradient", // gradient
      gradient: {
        type: "vertical", // The gradient in the horizontal direction
        gradientToColors: ["#a330b8"], // The color at the end of the gradient
        opacityFrom: 1, // transparency
        opacityTo: 1,
        stops: [0, 120],
      },
    },
    labels: label,
    markers: {
      size: 0,
    },
    grid: {
      show: false, //so that i dont see background lines which make it cluttered
    },
    yaxis: [
      {
        title: {
          text: "Accuracy %",
        },
        //max: 100,
        //min: 0,
        // logarithmic: true,
        //max: 150,
      },
    ],
    title: {
      text: "Average Accuracy of all the characters across all the tests taken",
      align: "center",
      floating: true, //make it false to create some distance between the graph and the title
      style: {
        fontFamily: "'Comic Sans MS', 'Comic Sans','Marker Felt',sans-serif",
        fontWeight: 500,
        fontSize:
          width < 300
            ? Math.round(width / 40)
            : width < 500
            ? Math.round(width / 40)
            : width < 900
            ? Math.round(width / 45)
            : 16,
      },
    },
  };

  // var chart = new ApexCharts(document.querySelector("#chart"), options);
  //chart.render();

  return (
    <div className="profile-graph">
      <Chart
        options={options}
        series={series}
        type="bar"
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};

export default Barchart;
