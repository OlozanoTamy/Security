import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiKey = "M7I2xAShQNBgHzqUkZHYKcxV3HoTaMpHi6evaaso";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta GET inicial que envía un arreglo vacío por defecto
app.get("/", (req, res) => {
    res.render("index", { arreglo: [] });
});

app.post("/images", async (req, res) => {
    try {
        let start = req.body["start-date"];
        let end = req.body["end-date"];

        const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
            params: {
                start_date: start,
                end_date: end,
                api_key: apiKey,
            }
        });

        let arreglo = [];
        const nearEarthObjects = response.data['near_earth_objects'];
        for (let date in nearEarthObjects) {
            arreglo = arreglo.concat(nearEarthObjects[date]);
        }

        res.render("index", { arreglo: arreglo });
    } catch (error) {
        console.error("Error fetching data from NASA API", error);
        res.render("index", { arreglo: [] });
    }
});


app.listen(port, () => {
    console.log(`The server is on port ${port}`);
});
