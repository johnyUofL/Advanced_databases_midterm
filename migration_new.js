const fs = require("fs");
const csv = require("csv-parser");
const mysql = require("mysql");
const util = require("util");

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "admin",
  password: "",
  database: "worldbankdata",
});

// Promisify for Node.js async/await
pool.query = util.promisify(pool.query);

// Define promises array outside the data event handler
const promises = [];

fs.createReadStream("RAW_data/Data.csv")
  .pipe(csv())
  .on("data", (row) => {
    const countryName = row["Country Name"];
    const countryCode = row["Country Code"];
    const seriesName = row["Series Name"];
    const seriesCode = row["Series Code"];
    const years = [2015, 2016, 2017, 2018, 2019];

    const promise = (async () => {
      // Insert country if not exists (ignore if duplicate key error occurs)
      await pool.query(
        `INSERT IGNORE INTO Countries (CountryName, CountryCode) VALUES (?, ?)`,
        [countryName, countryCode]
      );

      // Insert series if not exists (ignore if duplicate key error occurs)
      await pool.query(
        `INSERT IGNORE INTO Series (SeriesName, SeriesCode) VALUES (?, ?)`,
        [seriesName, seriesCode]
      );

      // Insert year data for each year
      for (const year of years) {
        const value = row[`${year} [YR${year}]`];
        if (value !== "..") {
          // Ignore missing values
          await pool.query(
            `INSERT IGNORE INTO YearData (Year, Value, CountryID, SeriesID)
             VALUES (?, ?, (SELECT CountryID FROM Countries WHERE CountryCode = ?), (SELECT SeriesID FROM Series WHERE SeriesCode = ?))`,
            [year, value, countryCode, seriesCode]
          );
        }
      }
    })();

    promises.push(promise);
  })
  .on("end", () => {
    // Wait for all promises to resolve before ending the pool
    Promise.all(promises)
      .then(() => {
        pool.end();
        console.log("CSV file successfully processed");
      })
      .catch((err) => {
        console.error("Error while processing CSV:", err);
        pool.end();
      });
  });
