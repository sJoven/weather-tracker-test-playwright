const { test, expect } = require('@playwright/test');

const API_KEY = 'd80899bfa8eecf987dd399fb1d7e1281'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

test.describe('OpenWeatherMap API Contract Tests', () => {

    test('Should return 200 OK and valid data for a known city (London)', async ({ request }) => {
        const city = 'London';
        const response = await request.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        expect(response.status()).toBe(200);

        const data = await response.json();

        expect(data).toHaveProperty('name', 'London');
        expect(data).toHaveProperty('main');
        expect(data.main).toHaveProperty('temp');
        expect(data.main).toHaveProperty('humidity');
        expect(data).toHaveProperty('weather');
        expect(Array.isArray(data.weather)).toBe(true);
    });

    test('Should return 404 Not Found for an unknown city', async ({ request }) => {
        const city = 'NonExistentCityXYZ123';
        const response = await request.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        expect(response.status()).toBe(404);

        const data = await response.json();

        expect(data).toHaveProperty('message', 'city not found');
    });

    test('Should return 401 Unauthorized for an invalid API Key', async ({ request }) => {
        const city = 'Tokyo';
        const invalidKey = 'invalidKey12345';
        const response = await request.get(`${BASE_URL}/weather?q=${city}&appid=${invalidKey}&units=metric`);
        
        expect(response.status()).toBe(401);
    });

    test('Should return 400 Bad Request or 404 Not Found for an empty query string', async ({ request }) => {
        const city = '';
        const response = await request.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        expect([400, 404]).toContain(response.status());
    });

    test('Should return 400 Bad Request or 404 Not Found for an excessively long query string', async ({ request }) => {
        const city = 'a'.repeat(1000); 
        const response = await request.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        expect([400, 404]).toContain(response.status());
    });

    test('Should return data in Celsius when units=metric is specified', async ({ request }) => {
        const city = 'London';
        const response = await request.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        expect(response.status()).toBe(200);

        const data = await response.json();

        expect(data.main).toHaveProperty('temp');
        expect(data.main.temp).toBeGreaterThanOrEqual(-50);
        expect(data.main.temp).toBeLessThanOrEqual(50);
    });
});
