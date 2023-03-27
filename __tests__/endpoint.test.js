const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	return db.end();
});

describe('GET /api/categories', () => {
	test('should return a status code 200', () => {
		return request(app).get('/api/categories').expect(200);
	});
	test('200: return a object', () => {
		return request(app)
			.get('/api/categories')
			.then(({ body }) => {
				expect(typeof body).toBe('object');
				expect(Array.isArray(body)).toBe(false);
			});
	});
	test('200: should return an array of category objects, each of which should have the following properties: slug, description', () => {
		return request(app)
			.get('/api/categories')
			.then(({body}) => {
        const {categories} = body;
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toHaveProperty('slug', expect.any(String))
          expect(category).toHaveProperty('description', expect.any(String));
        })
      });
	});
  test('should return status code 404 when path is spelt incorrectly', () => {
		return request(app).get('/api/category').expect(404);
	});
});
