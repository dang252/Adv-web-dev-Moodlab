import axios from "axios";
import { store } from "../redux/store";
import { refresh } from "../redux/reducers/user.reducer";

export const axiosAuthRequest = axios.interceptors.request.use(
    function (request: any) {
        // console.log("interceptor resquest")
        if (!(request.url?.includes("/login") || request.url?.includes("/register") || request.url?.includes("/forgot"))) {
            if (!request.headers.Authorization) {
                const accessToken = localStorage
                    .getItem("accessToken")
                    ?.toString()
                    .replace(/^"(.*)"$/, "$1");

                if (accessToken) {
                    const newHeaders = {
                        ...request.headers,
                        'Authorization': `Bearer ${accessToken}`,
                    }
                    request = {
                        ...request,
                        headers: newHeaders
                    }
                }

            }
        }
        return request
    },
    function (error) {
        Promise.reject(error);
    }
)

export const axiosAuthResponse = axios.interceptors.response.use(
    function (response: any) {
        return response
    },
    async function (error: any) {
        // console.log("interceptor response", error)
        if (error.request.status == 401 && !error.config.url?.includes("/auth/refresh")) {
            // console.log("request url", error.config.url)
            try {
                // const refreshToken = localStorage
                //     .getItem("refreshToken")
                //     ?.toString()
                //     .replace(/^"(.*)"$/, "$1");

                // const res = await axios.post(
                //     `${import.meta.env.VITE_API_URL}/auth/refresh`,
                //     {
                //         //null data
                //     },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${refreshToken}`,
                //         }
                //     }
                // );
                // localStorage.setItem("accessToken", JSON.stringify(res.data.access_token));
                // localStorage.setItem("refreshToken", JSON.stringify(res.data.refresh_token));
                const res: any = await store.dispatch(refresh()).unwrap()
                //retry
                const originalRequest = error.config;
                originalRequest.headers["Authorization"] = `Bearer ${res.access_token}`;
                return axios(originalRequest)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.log(err)
            }
        }
        return Promise.reject(error);
    }
)