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
  test('200: should be able to select by category using a query', () => {
    return request(app).get(
			'/api/reviews?category=dexterity'
		).expect(200).then(({body}) => {
      const {reviews} = body
      expect(reviews).toHaveLength(1)
      expect(reviews[0]).toHaveProperty('category', 'dexterity')
    })
  });
  test('200: should be able to sort by a column via query', () => {
    return request(app)
			.get('/api/reviews?sort_by=designer')
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toBeSortedBy('designer', {descending : true});
			});
  });
  test('200: should be able to order by via query', () => {
    return request(app)
			.get('/api/reviews?sort_by=designer&order=asc')
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toBeSortedBy('designer', { ascending: true });
			});
  });
  test('200: should set default sort by to created_at and default order to desc when passed no queries', () => {
    return request(app)
			.get('/api/reviews')
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toBeSortedBy('created_at', { descending: true });
			});
  });
  test('404: should return a 404 error if user tries to query a column that does exist', () => {
    return request(app).get('/api/reviews?category=edsgh').expect(404)
  });
  test('404: should return a 404 error if user enters an order that is not whitelisted', () => {
    return request(app).get('/api/reviews?order=fshg').expect(404)
  });
  test('404: should return a 404 error if user enters a sort_by that is not whitelisted', () => {
		return request(app).get('/api/reviews?sort_by=fshg').expect(404);
	});
  test('404: should return a 404 error when the category exists but there are no reviews associated with it', () => {
    return request(app).get("/api/reviews?category=children's games").expect(404)
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
	test('should return with a status code of 200', () => {
		return request(app).get('/api/reviews/2/comments').expect(200);
	});
	test('200: return an object', () => {
		return request(app)
			.get('/api/reviews/2/comments')
			.then(({ body }) => {
				expect(typeof body).toBe('object');
				expect(Array.isArray(body)).toBe(false);
			});
	});
	test('200: should return an array of comments object that have the review_id of 2', () => {
		return request(app)
			.get('/api/reviews/2/comments')
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toHaveLength(3);
				comments.forEach((comment) => {
					expect(comment).toEqual({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						review_id: 2,
					});
				});
			});
	});
	test('200: should return comments objects array in order sorted by date DESC', () => {
		return request(app)
			.get('/api/reviews/2/comments')
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('200: should return 200 and an empty array when review_id exists but no comments', () => {
		return request(app)
			.get('/api/reviews/6/comments')
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toEqual([]);
			});
	});
	test('404: should return a 404 not found error when review_id does not exist', () => {
		return request(app)
			.get('/api/reviews/999/comments')
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ message: 'Not found' });
			});
	});
  test('400: should return a 400 error due to invalid user input', () => {
    return request(app).get('/api/reviews/hello/comments').expect(400).then(({body}) => {
      expect(body).toEqual({message: 'Bad request'})
    })
  });
});

describe('POST /api/reviews/:review_id/comments', () => {
  test('should return with status code 201', () => {
		const commentToPost = { username: 'bainesface', body: 'Game was great' };
		return request(app)
			.post('/api/reviews/3/comments')
			.send(commentToPost)
			.expect(201);
	});
	test('201: return an object', () => {
		return request(app)
			.post('/api/reviews/2/comments')
			.then(({ body }) => {
				expect(typeof body).toBe('object');
				expect(Array.isArray(body)).toBe(false);
			});
	});
	test('201: should return with the comment that was posted to the database', () => {
		const commentToPost = { username: 'bainesface', body: 'Game was great' };
		return request(app)
			.post('/api/reviews/3/comments')
			.send(commentToPost)
			.expect(201)
      .then(({body}) => {
        const {comment} = body;
        expect(comment[0]).toMatchObject({
					comment_id: 7,
					body: 'Game was great',
					votes: 0,
					author: 'bainesface',
					review_id: 3,
					created_at: expect.any(String),
				});
      })
	});
  test('404: should return a 404 not found error when review_id does not exist', () => {
    const commentToPost = { username: 'bainesface', body: 'Game was great' };
		return request(app)
			.post('/api/reviews/999/comments')
      .send(commentToPost)
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ message: 'Not found' });
			});
	});
  test('400: should return a 400 Bad request error when invalid user input', () => {
    const commentToPost = {username: '', body: 'Game was great' };
    return request(app)
			.post('/api/reviews/3/comments')
			.send(commentToPost)
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ message: 'Bad request' });
			});
  });
  test('400: should return a 400 Bad Request when missing required input fields', () => {
    const commentToPost = {body: 'Game was great' };
    return request(app).post('/api/reviews/3/comments').send(commentToPost).expect(400).then(({body}) => {
      expect(body).toEqual({ message: 'Bad request' });
    })
  });
  test('404: should return 404 error Not found if username does not exist', () => {
    const commentToPost = { username: 'Jake', body: 'Game was great' };
		return request(app)
			.post('/api/reviews/3/comments')
			.send(commentToPost)
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ message: 'Not found' });
			});
  });
});

describe('Patch /api/reviews/:review_id changing votes', () => {
    test('should return with status code 200', () => {
			const incrementVotesBy = { inc_votes : 10};
			return request(app)
				.patch('/api/reviews/3')
				.send(incrementVotesBy)
				.expect(200);
		});
    test('200: should return an object', () => {
      const incrementVotesBy = { inc_votes: 10 };
			return request(app)
				.patch('/api/reviews/3')
				.send(incrementVotesBy)
				.expect(200)
        .then(({body}) => {
          expect(typeof body).toBe('object');
					expect(Array.isArray(body)).toBe(false);
        })
    });
    test('200: should return the updated review object', () => {
      const incrementVotesBy = { inc_votes: 10 };
			return request(app)
				.patch('/api/reviews/3')
				.send(incrementVotesBy)
				.expect(200)
				.then(({ body }) => {
					const {review} = body;
          expect(review[0]).toHaveProperty('votes', 15)
				});
    });
    test('200: should also work for applying negative votes', () => {
      const incrementVotesBy = { inc_votes: -10 };
			return request(app)
				.patch('/api/reviews/3')
				.send(incrementVotesBy)
				.expect(200)
				.then(({ body }) => {
					const { review } = body;
					expect(review[0]).toHaveProperty('votes', -5);
				});
    });
    test('400: return error 400 Bad request when trying to send a malformed body / missing required property', () => {
      const incrementVotesBy = {};
			return request(app)
				.patch('/api/reviews/3')
				.send(incrementVotesBy)
				.expect(400)
    });
    test('400: return Bad request when trying to send data with an incorrect type that cant be processed', () => {
      const incrementVotesBy = {inc_votes: 'cat'};
			return request(app)
				.patch('/api/reviews/3')
				.send(incrementVotesBy)
				.expect(400);
    });
    test('404: return a 404 error Not found if the review_id does not exist', () => {
      const incrementVotesBy = { inc_votes: 10 };
			return request(app)
				.patch('/api/reviews/999')
				.send(incrementVotesBy)
				.expect(404);
    });
    test('400: return error 400 when the review id entered is the wrong data type', () => {
      const incrementVotesBy = { inc_votes: 10 };
			return request(app)
				.patch('/api/reviews/cat')
				.send(incrementVotesBy)
				.expect(400);
    });
});

describe('Delete /api/comments/:comment_id', () => {
  test('should return with status code 204', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });
	test('204: should return No content if the comment has been deleted', () => {
		return request(app)
			.get('/api/reviews/2/comments')
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
        let count = 0;
				comments.forEach((comment) => {
          if (comment.comment_id === 1) count++;
				});
        expect(count).toBe(1);
			})
			.then(() => {
				return request(app)
					.delete('/api/comments/1')
					.expect(204)
					.then(() => {
						return request(app)
							.get('/api/reviews/2/comments')
							.expect(200)
							.then(({ body }) => {
								const {comments} = body;
                comments.forEach(comment => {
                  expect(comment.comment_id !== 1).toBe(true);
                })
							});
					});
			});
	});
  test('404: should return error 404 Not found if user enters a comment_id that does not exist', () => {
    return request(app).delete('/api/comments/99999').expect(404);
  });
  test('400: should return 400 error if use inputs an invalid comment_id', () => {
    return request(app).delete('/api/comments/not_a_num').expect(400);
  });
});

describe('GET /api/users', () => {
  test('should return a 200 status code', () => {
    return request(app).get('/api/users').expect(200);
  });
  test('200: return an object', () => {
		return request(app)
			.get('/api/users')
			.then(({ body }) => {
				expect(typeof body).toBe('object');
				expect(Array.isArray(body)).toBe(false);
			});
	});
  test('200: should return an array of objects containing users', () => {
    return request(app)
			.get('/api/users')
			.then(({ body }) => {
				const { users } = body;
				expect(users).toHaveLength(4);
				users.forEach((user) => {
					expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
				});
			});
  });
  test('should return status code 404 when path is spelt incorrectly', () => {
		return request(app).get('/api/use').expect(404);
	});
});