const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Handle the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the API server. Use /api/hello?visitor_name=Emmanuel');
});

// Handle the test api endpoint
app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || "Emmanuel";
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // Using WeatherAPI to get my location and weather data
        const apiKey = 'f8a69c8497b943b8a2883252240107';
        const weatherApiResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${clientIp}`);
        const weatherData = weatherApiResponse.data;
        const city = weatherData.location.name;
        const temperature = weatherData.current.temp_c;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
