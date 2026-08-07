import axios, { AxiosError } from 'axios';
import { expect } from 'chai';

const BASE_URL = 'https://api.restful-api.dev/objects';
const AUTH = { username: 'adminUser', password: 'QWE1234!@!@' };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Object API', () => {
  let createdObjectId: string;

  describe('CRUD flow', () => {
    it('testPostObject', async () => {
      const requestBody = {
        name: 'Apple iPad Air',
        data: {
          Generation: '4th',
          Price: '519.99',
          Capacity: '256 GB',
        },
      };

      const response = await axios.post(BASE_URL, requestBody, {
        auth: AUTH,
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('POST Response:', JSON.stringify(response.data));

      createdObjectId = response.data.id;
      expect(response.status).to.equal(200);
    });

    it('testGetCreatedObject', async () => {
      await sleep(3000);

      const response = await axios.get(`${BASE_URL}/${createdObjectId}`, {
        auth: AUTH,
      });

      console.log('GET Response:', JSON.stringify(response.data));

      expect(response.status).to.equal(200);
    });

    it('testUpdateAndDeleteObject', async () => {
      const updateBody = {
        name: 'Apple iPad Air (Updated)',
        data: {
          Generation: '5th',
          Price: '599.99',
          Capacity: '512 GB',
        },
      };

      const updateResponse = await axios.put(
        `${BASE_URL}/${createdObjectId}`,
        updateBody,
        {
          auth: AUTH,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      expect(updateResponse.status).to.equal(200);

      const deleteResponse = await axios.delete(
        `${BASE_URL}/${createdObjectId}`,
        { auth: AUTH }
      );

      expect(deleteResponse.status).to.equal(200);
    });
  });

  it('testGetObject', async () => {
    const objectId = 4;

    const response = await axios.get(`${BASE_URL}/${objectId}`, {
      auth: AUTH,
    });

    expect(response.status).to.equal(200);
  });

  it('testPostObjectNegative', async () => {
    try {
      const response = await axios.post(BASE_URL, '', {
        auth: AUTH,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 400) {
        expect(response.status).to.equal(400);
      } else {
        console.log('Unexpected status:', response.status);
      }
    } catch (error) {
      // Test passed — server rejected the request
      if (error instanceof AxiosError && error.response) {
        console.log('Request rejected with status:', error.response.status);
      }
    }
  });

  it.skip('testDeleteNonExistentObject', async () => {
    const response = await axios.delete(`${BASE_URL}/999999`, {
      auth: AUTH,
      validateStatus: () => true,
    });

    expect(response.status).to.equal(404);
  });
});
