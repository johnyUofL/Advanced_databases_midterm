$(document).ready(function () {
  $("form").on("submit", function (event) {
    event.preventDefault();

    const year = $('select[name="year"]').val();
    const indicator = $('select[name="indicator"]').val();
    const country = $('select[name="country"]').val();

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
          $("#result").html("<p>" + data.message + "</p>");
        } else {
          $("#result").html(`
 
            <h1>Data for ${data.country} in ${data.year}</h1>
            <p>The ${data.indicator} is ${data.value}.</p>

          `);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error:", textStatus, errorThrown);
      },
    });
  });
});
