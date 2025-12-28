import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import handleRequest from './handle-request';

describe('handleRequest', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
    vi.clearAllMocks();
  });

  it('calls onSuccess when request succeeds', async () => {
    const data = { id: 1 };
    mockAxios.onGet('/test').reply(200, data);
    const request = () => axios.get('/test');
    const onSuccess = vi.fn();

    await handleRequest(request, onSuccess);

    expect(onSuccess).toHaveBeenCalledWith(data);
  });

  it('calls correct status handler when error status occurs', async () => {
    const errorData = { message: 'Not Found' };
    mockAxios.onGet('/test').reply(404, errorData);
    const request = () => axios.get('/test');
    const statusHandler = vi.fn();
    const onError = vi.fn();

    await handleRequest(request, vi.fn(), { 404: statusHandler }, onError);

    expect(statusHandler).toHaveBeenCalledWith(errorData);
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError when error status has no handler', async () => {
    const errorData = { message: 'Server Error' };
    mockAxios.onGet('/test').reply(500, errorData);
    const request = () => axios.get('/test');
    const onError = vi.fn();

    await handleRequest(request, vi.fn(), { 404: vi.fn() }, onError);

    expect(onError).toHaveBeenCalled();
  });

  it('calls onError for network errors', async () => {
    mockAxios.onGet('/test').networkError();
    const request = () => axios.get('/test');
    const onError = vi.fn();

    await handleRequest(request, vi.fn(), {}, onError);

    expect(onError).toHaveBeenCalled();
  });
});
