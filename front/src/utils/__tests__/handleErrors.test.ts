import { AxiosError, AxiosResponse } from 'axios';
import handleErrors from '../handleErrors';

describe('handleErrors', () => {
  const spy: jest.SpyInstance = jest.spyOn(console, 'log');
  beforeEach(jest.resetAllMocks);

  it('prints a response error', () => {
    const mockResp: AxiosResponse = {
      data: 'Unauthorized',
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {},
    };
    const error: AxiosError = {
      config: {},
      isAxiosError: true,
      name: 'General error',
      toJSON: jest.fn(),
      message: 'General message',
      response: mockResp,
    };
    handleErrors(error);
    expect(spy).toHaveBeenCalledWith('error data:', 'Unauthorized');
  });

  it('prints a request error', () => {
    const error: AxiosError = {
      config: {},
      isAxiosError: true,
      name: 'Request error',
      request: 'Request error',
      toJSON: jest.fn(),
      message: 'Request error',
    };
    handleErrors(error);
    expect(spy).toHaveBeenCalledWith('error request:', 'Request error');
  });

  it('prints a general error', () => {
    const error: AxiosError = {
      config: {},
      isAxiosError: true,
      name: 'General error',
      toJSON: jest.fn(),
      message: 'General error',
    };
    handleErrors(error);
    expect(spy).toHaveBeenCalledWith('General error:', 'General error');
  });
});
