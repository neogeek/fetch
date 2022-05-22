// Copyright (c) Scott Doxey. All Rights Reserved. Licensed under the MIT License. See LICENSE in the project root for license information.

// GitHub: https://github.com/neogeek/fetch

/**
 * Provides a wrapper around the browser method fetch that handles errors and response.
 *
 *     const { error, data } = await get('/api/messages');
 *
 * @param {string} method Request method. GET, POST, PUT and DELETE are supported.
 * @param {RequestInfo} resource Resource to request. Can be represented as a string, URL or Request object.
 * @param {string|object} body Optional body object. Can be represented as a string or an object.
 * @param {object} headers Optional headers object. Default header sent with all requests is `'Content-Type': 'application/json'`.
 * @return {Promise<{ error?: { code?: number; message: string }; data?: T>} Response with an error and data object.
 * @public
 */

export const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  resource: RequestInfo,
  body?: {},
  headers?: {}
): Promise<{
  error?: { code?: number; message: string };
  data?: T;
  text?: string;
}> => {
  try {
    const response = await fetch(resource, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: (body instanceof String ? body : JSON.stringify(body)) as string,
    });

    if (!response.ok) {
      if (response.headers.get('content-type')?.match(/json/)) {
        const { code, message } = (await response.json()) as {
          code: number;
          message: string;
        };

        if (code && message) {
          return { error: { code, message } };
        }
      }

      throw new Error(`${response.status} ${response.statusText}`);
    }

    const text = await response.text();

    if (response.headers.get('content-type')?.match(/json/)) {
      return { data: JSON.parse(text) as T, text };
    }

    return { text };
  } catch (error) {
    if (error instanceof Error) {
      return { error: { message: error.message } };
    }

    throw error;
  }
};

export const get = async <T>(url: string, headers?: {}) =>
  request<T>('GET', url, headers);

export const post = async <T>(url: string, body?: {}, headers?: {}) =>
  request<T>('POST', url, body, headers);

export const put = async <T>(url: string, body?: {}, headers?: {}) =>
  request<T>('PUT', url, body, headers);

export const del = async <T>(url: string, headers?: {}) =>
  request<T>('DELETE', url, headers);
