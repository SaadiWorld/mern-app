import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async <T = unknown>(
      url: string,
      method: HttpMethod = "GET",
      body: BodyInit | Record<string, unknown> | FormData | null = null,
      headers: Record<string, string> = {},
    ): Promise<T> => {
      setIsLoading(true);
      setError(null);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const requestConfig: AxiosRequestConfig = {
          url,
          method,
          data: body ?? undefined,
          headers:
            body instanceof FormData
              ? headers
              : { "Content-Type": "application/json", ...headers },
          signal: httpAbortCtrl.signal,
        };

        const response = await axios.request<T>(requestConfig);

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl,
        );

        setIsLoading(false);
        return response.data;
      } catch (err: unknown) {
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl,
        );

        const message = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? err.message)
          : err instanceof Error
            ? err.message
            : "Request failed";

        setError(message);
        setIsLoading(false);
        throw err;
      }
    },
    [],
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
