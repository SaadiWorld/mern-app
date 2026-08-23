import axios from 'axios';
import HttpError from "../utils/http-error";

const getCoordsForAddress = async (address: string) => {
  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: address,
          format: 'jsonv2',
          limit: 1,
          addressdetails: 1,
        },
        headers: {
          // Nominatim requires an identifying User-Agent.
          'User-Agent': `${process.env.APP_NAME}/1.0 (${process.env.APP_EMAIL})`,
          Accept: 'application/json',
        },
      }
    );

    const data = response.data;

    if (!data || data.length === 0) {
      throw new HttpError(
        'Could not find location for the specified address.',
        422
      );
    }

    const coordinates = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };

    return coordinates;
  } catch (error) {
    // Preserve our own HttpError
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(
      'Could not find location for the specified address.',
      422
    );
  }
}

export default getCoordsForAddress;
