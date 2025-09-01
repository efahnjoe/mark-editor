type Data = {
  message: string;
};

export interface Result {
  success: boolean;
  method: "get";
  code?: number;
  data?: Data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

export function result(options: {
  success: boolean;
  method?: "get";
  code?: number;
  data?: Data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}): Result {
  const {
    success = false,
    method = "get",
    code = 404,
    data = { message: "error" },
    error = "Api is error"
  } = options;

  return {
    success,
    method,
    code,
    data,
    error
  };
}
