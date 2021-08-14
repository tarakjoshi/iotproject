
(async function () {

  var alldata = await getTemperatureHumidityData();
  await displayChartData(alldata);
})();

async function displayChartData(alldata) {
  var temperature = await getTemperatureData(alldata);
  var humidity = await getHumidityData(alldata);
  var days = await getDaysOfTheMonth();
  var ctx = document.getElementById("thchart");

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          data: temperature,
          label: "Temperature (F)",
          borderColor: "#3e95cd",
          fill: false
        },
        {
          data: humidity,
          label: "Humidity (%)",
          borderColor: "#8e5ea2",
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Day of the Month',
            color: '#911',
            font: {
              family: 'Comic Sans MS',
              size: 20,
              weight: 'bold',
              lineHeight: 1.2,
            },
            padding: { top: 20, left: 0, right: 0, bottom: 0 }
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Temperature and Humidity',
            color: '#191',
            font: {
              family: 'Times',
              size: 20,
              style: 'normal',
              lineHeight: 1.2
            },
            padding: { top: 30, left: 0, right: 0, bottom: 0 }
          }
        }
      }
    }
  });
}
async function getDaysOfTheMonth() {
  var today = new Date();
  var lastDayOfMonths = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  var numberOfDays = [];
  for (var i = 1; i <= lastDayOfMonths.getDate(); i++) {
    numberOfDays.push(i);
  }

  return numberOfDays;
}

async function getHumidityData(data) {
  var hum = [];
  for (var i = 1; i <= data.data.length; i++) {
    hum.push(data.data[i].humidity)
  }
  return hum;
}

async function getTemperatureData(data) {
  var tem = [];
  for (var i = 1; i <= data.data.length; i++) {
    tem.push(data.data[i].temperature)
  }
  return tem;
}

async function getTemperatureHumidityData() {

  const response = await fetch('http://<<staticbucketname>>.s3-website-us-east-1.amazonaws.com/data.json');
  const json = await response.json();
  if (json != undefined) {
    return json;
  }
  else {
    alert("Error Loading Generated Data.. Showing sample data");
    var jsonData = {
      "data": [{
        "data": 1, "temperature": 89, "humidity": 76
      },
      {
        "data": 2, "temperature": 76, "humidity": 89
      },
      {
        "data": 3, "temperature": 99, "humidity": 78
      },
      {
        "data": 4, "temperature": 101, "humidity": 87
      },
      {
        "data": 5, "temperature": 76, "humidity": 79
      },
      {
        "data": 6, "temperature": 80, "humidity": 85
      }
      ]
    };
    return jsonData;
  }
}
