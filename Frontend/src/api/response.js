// Every backend endpoint answers with `{ success, data }`. These helpers unwrap that
// envelope in one place instead of each page guessing the shape.

export const getData = (response) => {
  if (!response || typeof response !== "object") return response;
  return "data" in response ? response.data : response;
};

export const getList = (response) => {
  const payload = getData(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(response?.data)) return response.data;

  return [];
};

export const getItem = (response) => {
  const payload = getData(response);

  return payload?.pullRequest ?? payload ?? null;
};

export const getPagination = (response) => {
  const pagination = response?.pagination ?? response?.data?.pagination;

  return {
    page: pagination?.page ?? 1,
    totalPages: pagination?.totalPages ?? 1,
    total: pagination?.total ?? 0,
    limit: pagination?.limit ?? 0,
  };
};
