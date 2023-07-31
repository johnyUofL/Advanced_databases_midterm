$(document).ready(function () {
  // Handle the first form submission for /api/data
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

  // Handle the second form submission for /api/datacountryindicator
  // Handle the second form submission for /api/datacountryindicator
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
        console.log(response); // Log the response

        // Get the data for the chart
        const years = response.data.map((item) => item.year);
        const values = response.data.map((item) => item.value);

        // Create the chart
        const ctx = document.getElementById("chart").getContext("2d");
        if (window.myChart instanceof Chart) {
          window.myChart.destroy();
        }
        window.myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: years,
            datasets: [
              {
                label: `${indicator} for ${country}`,
                data: values,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
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
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error:", textStatus, errorThrown);
      },
    });
  });
});
