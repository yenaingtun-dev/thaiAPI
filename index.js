const axios = require("axios");
const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    const newDataArray = response.data.result;
    updateFile(newDataArray);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateFile(newDataArray) {
  const filePath = "data.json";
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading file:", err);
      return;
    }
    let existingData = [];
    if (data) {
      existingData = JSON.parse(data);
    }
    const newDataToAdd = newDataArray.filter(
      (newItem) =>
        !existingData.some(
          (existingItem) =>
            JSON.stringify(existingItem) === JSON.stringify(newItem)
        )
    );
    if (newDataToAdd.length > 0) {
      existingData.push(...newDataToAdd);
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log("Data updated in data.json");
        }
      });
    } else {
      console.log("No new data to update");
    }
  });
}

const url = "https://api.thaistock2d.com/live";
fetchData(url);
setInterval(() => fetchData(url), 60000);

app.get("/", (req, res) => {
  const filePath = "data.json";
  fs.readFile(filePath, "utf8", (err, jsonData) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading file:", err);
      return;
    }
        try {
            const stockDatas = JSON.parse(jsonData);
            res.render(__dirname + '/views/index.ejs', { stockDatas });
        } catch (parseError) {
            return res.status(500).send('Error parsing JSON data');
        }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
