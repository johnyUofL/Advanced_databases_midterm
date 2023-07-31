$(document).ready(function () {
  $("form").on("submit", function (event) {
    event.preventDefault();

    const year = $('select[name="year"]').val();
    const indicator = $('select[name="indicator"]').val();
    const country = $('select[name="country"]').val();

    $.ajax({
      url: "/api/graph",
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
          $("#result").html("<p>" + data.message + "</p>");
        } else {
          $("#result").html(`
            <p>Value: ${data.value}</p>
            <p>Country: ${data.country}</p>
            <p>Indicator: ${data.indicator}</p>
            <p>Year: ${data.year}</p>
          `);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error:", textStatus, errorThrown);
      },
    });
  });
});
