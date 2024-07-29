import axios from "axios";
import format from "pretty-format";

const ruverseClient = axios.create({
  baseURL: import.meta.env.VITE_RUVERSE_SERVER_URL,
});

// 요청 인터셉터
ruverseClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // 2. 요청 에러가 있는 작업 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터
ruverseClient.interceptors.response.use(
  function (response) {
    // console.log(format(response));
    return response;
  },
  function (error) {
    // 응답 200번대가 아닌 status일 때 응답 에러 직전 호출
    // 4. 이 작업 이후 .catch()로 이어진다
    return Promise.reject(error);
  }
);

export { ruverseClient };
