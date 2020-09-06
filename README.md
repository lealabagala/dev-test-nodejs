# Nodejs Developer Test

## The Task

Create a simple node service that provides provides some endpoints to allow the listing and updating of a
list of countries and their population. This task should take 2-3 hours but don't worry if you aren't able to 
complete all items, just make sure to show your understanding of the core technologies we use.

1. Fork this repo
2. Create an endpoint that allows the listing of the countries using the method from `src/api/country.ts`
3. Create an endpoint to fetch all of the countries sorted by their population
4. Allow the populations to be updated
5. Allow countries to be updated
6. Allow countries to be deleted 
7. Add authentication using the `src/api/authenticate.ts` method
8. When you're done commit your code and create a pull request

Bonus points for

1. Storing the data in Redis
2. Allowing the app to be run from a docker-compose file

A basic project outline has been created to help you get started quickly but feel free to start from scratch if you have a preferred setup.

Feel free to use the internet including Google and Stackoverflow to help with the task

## Any questions?

Please just ask.

Good luck and thanks for taking the time to complete this task!

## Starting the App

1. Rename `.env.example` to `.env`, and update the values accordingly.
2. Make sure Redis is running locally by running `redis-server`.
3. Run `npm run seed` to populate data into redis server.
3. Run `npm start`.

## Endpoints

### `GET` /countries

Returns the list of countries sorted by their population (ascending).

Response:

```json
{
  "data": [
    {
      "name": "AFGHANISTAN",
      "code": "afg",
      "population": 123456
    },
    {
      "name": "ALBANIA",
      "code": "alb",
      "population": 123457
    }
  ]
}
```

### `PUT` /countries/:code

Updates the country object given the country code.

Body:

```json
{
  "population": 123456
}
```

Response:

```json
200
```

### `DELETE` /countries/:code

Deletes the country object given the country code.

Response:

```json
200
```
