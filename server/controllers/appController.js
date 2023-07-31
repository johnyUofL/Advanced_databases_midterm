const mysql = require("mysql");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "admin",
  password: "",
  database: "WorldBankData",
});

exports.getGraphData = (req, res) => {
  const { year, country, indicator } = req.query;

  let sql = `SELECT y.Value, c.CountryName, s.SeriesName
             FROM YearData y
             INNER JOIN Countries c ON y.CountryID = c.CountryID
             INNER JOIN Series s ON y.SeriesID = s.SeriesID
             WHERE c.CountryName = ? AND s.SeriesName = ? AND y.Year = ?`;

  db.query(sql, [country, indicator, year], (err, results) => {
    if (err) {
      console.log(err);
      res.json({ error: err.message });
    } else if (results.length > 0) {
      const result = results[0];
      res.json({
        value: result.Value,
        country: result.CountryName,
        indicator: result.SeriesName,
        year: year,
      });
    } else {
      res.json({ message: "No data found for the given parameters." });
    }
  });
};

exports.getSelectors = (req, res) => {
  const yearQuery = `SELECT DISTINCT Year FROM YearData ORDER BY Year`;
  const countryQuery = `SELECT CountryName FROM Countries`;
  const seriesQuery = `SELECT SeriesName FROM Series`;

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(yearQuery, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(countryQuery, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(seriesQuery, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    }),
  ])
    .then((data) => {
      const [years, countries, indicators] = data;
      res.render("home", { years, countries, indicators });
    })
    .catch((err) => {
      console.log(err);
      res.render("error", { error: err });
    });
};
