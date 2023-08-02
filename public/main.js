$(document).ready(function () {
  // Handle the first form submission
  $("#form1").submit(function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const year = $("#year").val();
    const indicator = $("#indicator").val();
    const country = $("#country").val();

    // AJAX request for the first API /api/data
    $.ajax({
      url: "/api/data",
      type: "GET",
      data: {
        year: year,
        country: country,
        indicator: indicator,
      },
      success: function (data) {
        if (data.error) {
          alert(data.error);
        } else if (data.message) {
          $("#result1").html("<p>" + data.message + "</p>");
        } else {
          $("#result1").html(`
              <h1>Data for ${data.country} in ${year}</h1>
              <p>The ${data.indicator} is ${data.value}.</p>
            `);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error:", textStatus, errorThrown);
      },
    });
  });
  // Initialize the chart variable
  let myChart;

  // Add event listener to the download button
  document
    .getElementById("downloadButton")
    .addEventListener("click", function () {
      if (myChart) {
        // Save the original chart size
        const originalWidth = myChart.width;
        const originalHeight = myChart.height;

        // Temporarily increase the chart size to ensure the entire chart is captured
        myChart.resize(1200, 600);

        // Convert the chart to a base64 image
        const base64URL = myChart.toBase64Image();

        // Restore the original chart size
        myChart.resize(originalWidth, originalHeight);

        // Create a temporary anchor element and set the attributes for download
        const downloadLink = document.createElement("a");
        downloadLink.href = base64URL;
        downloadLink.download = "chart.png"; // Specify the default file name for the downloaded image

        // Trigger the click event of the anchor element to download the image
        downloadLink.click();
      }
    });

  // Function to create the chart
  function createChart(response, country, indicator) {
    // Get the data for the chart
    const years = response.data.map((item) => item.year);
    const values = response.data.map((item) => item.value);

    // Define an array of 5 colors (you can customize this as per your requirement)
    const colors = [
      "rgba(75, 192, 192, 0.2)",
      "rgba(192, 75, 75, 0.2)",
      "rgba(192, 192, 75, 0.2)",
      "rgba(75, 192, 75, 0.2)",
      "rgba(192, 75, 192, 0.2)",
    ];

    // Create the chart
    const ctx = document.getElementById("chart").getContext("2d");
    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            label: `${indicator} for ${country}`,
            data: values,
            backgroundColor: colors,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Handle the second form submission

  $("#form2").submit(function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const indicator = $("#indicator").val();
    const country = $("#country").val();

    // AJAX request for the second API /api/datacountryindicator
    $.ajax({
      url: "/api/datacountryindicator",
      type: "GET",
      data: {
        country: country,
        indicator: indicator,
      },
      success: function (response) {
        // Call the function to create the chart
        createChart(response, country, indicator);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error:", textStatus, errorThrown);
      },
    });
  });
});
