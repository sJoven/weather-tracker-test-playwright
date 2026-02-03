import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 }, 
    { duration: '1m', target: 5 },
    { duration: '30s', target: 0 },  
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], 
  },
};

export default function () {
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=Philippines&appid=d80899bfa8eecf987dd399fb1d7e1281';
  
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}