const fs = require("fs");
const csv = require("csv-parser");
const mysql = require("mysql");
const util = require("util");

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // adjust as needed
  host: "127.0.0.1",
  user: "admin",
  password: "",
  database: "worldbankdata",
});

// Promisify for Node.js async/await
pool.query = util.promisify(pool.query);

let promises = [];

fs.createReadStream("RAW_data/Data.csv")
  .pipe(csv())
  .on("data", (row) => {
    const countryName = row["Country Name"];
    const countryCode = row["Country Code"];
    const seriesName = row["Series Name"];
    const seriesCode = row["Series Code"];
    const years = [2015, 2016, 2017, 2018, 2019];

    const promise = (async () => {
      // Insert country
      await pool.query(
        `INSERT INTO Countries (CountryName, CountryCode) VALUES (?, ?) 
   ON DUPLICATE KEY UPDATE CountryName=CountryName, CountryCode=CountryCode`,
        [countryName, countryCode]
      );

      // Insert series
      await pool.query(
        `INSERT INTO Series (SeriesName, SeriesCode) VALUES (?, ?) 
   ON DUPLICATE KEY UPDATE SeriesName=SeriesName, SeriesCode=SeriesCode`,
        [seriesName, seriesCode]
      );

      // Insert year data for each year
      for (const year of years) {
        const value = row[`${year} [YR${year}]`];
        if (value !== "..") {
          // Ignore missing values
          await pool.query(
            "INSERT INTO YearData (Year, Value, CountryID, SeriesID) VALUES (?, ?, (SELECT CountryID FROM Countries WHERE CountryCode = ?), (SELECT SeriesID FROM Series WHERE SeriesCode = ?))",
            [year, value, countryCode, seriesCode]
          );
        }
      }
    })();

    promises.push(promise);
  })
  .on("end", async () => {
    await Promise.all(promises);
    pool.end();
    console.log("CSV file successfully processed");
  });
