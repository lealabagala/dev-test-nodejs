import { Request, Response, NextFunction } from 'express';

import { Country } from '../types';
import * as redis from '../services/redis';

const getCountries = () => redis.get<Country[]>('countries');
const setCountries = (countries: Country[]) => redis.set<Country[]>('countries', countries);

/**
 * Simulates a success or fail request
 * @param {function} request
 */
const simulateResponse = (request: any): Promise<Country[] | null> => new Promise(async (resolve, reject) => {
  const response = await request();
  setTimeout(() => {
    const randNum = Math.round(Math.random() * 10) + 1; // Fails 1 out of 10 times
    randNum !== 1 ? resolve(response) : reject(new Error(`${request.name} failed to get response`));
  }, 100);
  // resolve(response);
});

/**
* API to get the countries, sometimes this fails.
*
* @param {express.Request} req
* @param {express.Response} res
* @param {express.NextFunction} next
* @returns {Promise<void>}
*/
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await simulateResponse(getCountries);

    if (!data) {
      res.status(404).json({
        message: 'No resources found.',
      });
      return;
    }

    res.json({
      data: data.sort((a, b) => (a.population - b.population)),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * API to update a country, sometimes this fails.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, population } = req.body;
    const code = req.params.code || req.body.code;

    const countries: Country[] | null = await getCountries() || [];
    const countryIdx = countries.findIndex(country => country.code === code.toLowerCase());

    if (!countries || countryIdx === -1) {
      res.status(404).json({
        message: `Country code ${code} not found.`,
      });
      return;
    }
    
    const { name: existingName, code: existingCode, population: existingPopulation } = countries[countryIdx];
    countries[countryIdx].name = name || existingName;
    countries[countryIdx].code = code || existingCode;
    countries[countryIdx].population = population || existingPopulation;

    await simulateResponse(() => setCountries(countries));

    res.sendStatus(200);
  } catch (error) {
    next(Error);
  }
};

/**
 * API to delete a country, sometimes this fails.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code } = req.params;

    const countries = await getCountries() || [];
    const countryIndex = countries.findIndex(country => country.code === code.toLowerCase());

    if (!countries || countryIndex === -1) {
      res.status(404).send({
        message: `Country code ${code} not found.`,
      });
      return;
    }

    countries.splice(countryIndex, 1);
    await simulateResponse(() => setCountries(countries));

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
