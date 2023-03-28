const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	db.end();
});

describe('GET /api/categories', () => {
	test('should return a status code 200', () => {
		return request(app).get('/api/categories').expect(200);
	});
	test('200: return an object', () => {
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

describe('GET /api/reviews/:review_id', () => {
	test('should return a status code 200', () => {
		return request(app).get('/api/reviews/1').expect(200);
	});
	test('200: return an object', () => {
		return request(app)
			.get('/api/reviews/1')
			.then(({ body }) => {
				expect(typeof body).toBe('object');
				expect(Array.isArray(body)).toBe(false);
			});
	});
	test('200: should return the correct review object with the corresponding review_ id given in the endpoint.', () => {
    const review1 = {
			title: 'Agricola',
			designer: 'Uwe Rosenberg',
			owner: 'mallionaire',
			review_img_url:
				'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
			review_body: 'Farmyard fun!',
			category: 'euro game',
			created_at: new Date(1610964020514),
			votes: 1,
      review_id: 1
		};

		return request(app)
			.get('/api/reviews/1')
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toHaveLength(1);
        expect(review[0]).toHaveProperty('review_id', 1);
			});
	});
  test('400: should return 400 when user enters something that is not a number as a param', () => {
    return request(app).get('/api/reviews/not_a_num').expect(400).then(({body}) => {
      expect(body).toEqual({message: 'Bad request'})
    });
  });
  test('404: should return 404 when user enters a number that is too big', () => {
    return request(app).get('/api/reviews/99999').expect(404).then(({body}) => {
      expect(body).toEqual({message: 'Not found'})
    })
  });
});

describe('GET /api/reviews', () => {
	test('should return a status code 200', () => {
		return request(app).get('/api/reviews').expect(200);
	});
	test('200: return an object', () => {
		return request(app)
			.get('/api/reviews')
			.then(({ body }) => {
				expect(typeof body).toBe('object');
				expect(Array.isArray(body)).toBe(false);
			});
	});
	test('200: should return an array of review objects containing the correct properties', () => {
		return request(app)
			.get('/api/reviews')
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toHaveLength(13);
				reviews.forEach((review) => {
					expect(review).toMatchObject({
						owner: expect.any(String),
						title: expect.any(String),
						review_id: expect.any(Number),
						category: expect.any(String),
						review_img_url: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						designer: expect.any(String),
						comment_count: expect.any(String),
					});
				});
			});
	});
	test('200: should return an array of objects that is sorted by the value of the date property in descending order', () => {
		return request(app)
			.get('/api/reviews')
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
        const reviewsCopy = [...reviews];
        const sortedReviews = reviewsCopy.sort((a,b) => {
          return b.created_at.localeCompare(a.created_at)
        });
        expect(reviews).toEqual(sortedReviews);	        
			});
	});
  test('404: should return an error 404 when the user has entered an invalid endpoint', () => {
    return request(app).get('/api/revie').expect(404)
  });
});
