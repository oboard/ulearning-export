import Image from "next/image";
import { useEffect, useState } from "react";

const useLocalStorage = (storageKey, fallbackState) => {
  if (typeof window !== "undefined") {
    const [value, setValue] = useState(
      JSON.parse(localStorage.getItem(storageKey)) || fallbackState
    );

    useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value, storageKey]);
    return [value, setValue];
  }
  return useState(fallbackState);
};

export default function Login() {
  const [loginName, setLoginName] = useLocalStorage("loginname", "");
  const [password, setPassword] = useLocalStorage("password", "");
  const [authorization, setAuthorization] = useLocalStorage(
    "authorization",
    ""
  );
  const login = async (e) => {
    e.preventDefault();
    // 登陆
    console.log(authorization);

    var urlencoded = new URLSearchParams();
    urlencoded.append("loginName", loginName);
    urlencoded.append("password", password);

    // 欺骗检测
    await fetch(`/courseapi/textbook/cheatCheck?loginName=${loginName}}`, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        authorization: "449D1BB6C69E938A2B422F5FC4019CA6",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '""',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrer: "https://umooc.ulearning.cn/pc.html",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    });

    await fetch(
      `/courseapi/users/check?loginName=${loginName}&password=${password}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://umooc.ulearning.cn/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "OPTIONS",
        mode: "cors",
        credentials: "omit",
      }
    );
    await fetch(
      `/courseapi/users/loginApi?loginName=${loginName}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          authorization: "449D1BB6C69E938A2B422F5FC4019CA6",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '""',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://umooc.ulearning.cn/pc.html",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    );
    const response = await fetch("/courseapi/users/login/v2", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        pragma: "no-cache",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '""',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-site",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      referrer: "https://umooc.ulearning.cn/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `loginName=${loginName}&password=${password}`,
      'COOKIE':'AUTHORIZATION=546CB9CC673F7AB341B691D12BD01E1A; ROOT_ORIGIN=www.ulearning.cn; USERINFO=%7B%22orgName%22%3A%22%E4%B8%9C%E8%8E%9E%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%22%2C%22orgLogo%22%3A%22https%3A%2F%2Fleicloud.ulearning.cn%2Fresources%2F940872%2F202012071645083905.png%22%2C%22roleId%22%3A9%2C%22sex%22%3A%221%22%2C%22orgHome%22%3A%22dgut.ulearning.cn%22%2C%22userId%22%3A11735745%2C%22orgId%22%3A3755%2C%22authorization%22%3A%22546CB9CC673F7AB341B691D12BD01E1A%22%2C%22studentId%22%3A%222022433080122%22%2C%22loginName%22%3A%22dgut2022433080122%22%2C%22name%22%3A%22%E7%BD%97%E5%AE%87%E8%88%AA%22%2C%22uversion%22%3A2%7D; USER_INFO=%7B%22orgName%22%3A%22%u4E1C%u839E%u7406%u5DE5%u5B66%u9662%22%2C%22orgLogo%22%3A%22https%3A%2F%2Fleicloud.ulearning.cn%2Fresources%2F940872%2F202012071645083905.png%22%2C%22roleId%22%3A9%2C%22sex%22%3A%221%22%2C%22orgHome%22%3A%22dgut.ulearning.cn%22%2C%22userId%22%3A11735745%2C%22orgId%22%3A3755%2C%22authorization%22%3A%22546CB9CC673F7AB341B691D12BD01E1A%22%2C%22studentId%22%3A%222022433080122%22%2C%22loginName%22%3A%22dgut2022433080122%22%2C%22name%22%3A%22%u7F57%u5B87%u822A%22%2C%22uversion%22%3A2%7D; lang=zh; lms_user_org=3755; token=546CB9CC673F7AB341B691D12BD01E1A',
      method: "POST",
      mode: "cors",
      credentials: "include",
      // 阻止重定向
      redirect: "manual",
    });
    //Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin: https://umooc.ulearning.cn
// Cache-Control: no-cache, no-store, max-age=0, must-revalidate
// Connection: keep-alive
// Content-Length: 0
// Date: Thu, 15 Jun 2023 07:40:03 GMT
// Expires: 0
// Location: https://courseweb.ulearning.cn/ulearning/index.html#/index/courseList
// Pragma: no-cache
// Server: nginx
// Set-Cookie: AUTHORIZATION=205C58B536A4375FB3BA1B51FF6A9619; Domain=.ulearning.cn; Path=/
// Set-Cookie: token=205C58B536A4375FB3BA1B51FF6A9619; Domain=.ulearning.cn; Path=/
    // 获取cookie中Set-Cookie的AUTHORIZATION,Set-Cookie有很多个
    const auth = response.headers.get("Set-Cookie").split("AUTHORIZATION=")[1].split(";")[0];

    // 设置cookie
    setAuthorization(auth);
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-8 `}
    >
      {/* <h1 className="text-4xl font-bold text-center">
        优学院题库导出助手
        <br />
        <span className="text-2xl font-normal">
          一键导出优学院题库，支持导出题库、题目、答案、解析等
        </span>
      </h1> */}
      {/* 上面是桌面端代码，为了适配移动端，使用响应式布局 */}
      <div className="text-2xl text-center p-4">
        {/* 优学院题库导出助手 */}
        <br />
        登陆
      </div>

      {/* 登陆表单，玻璃效果 */}
      <form className="flex flex-col gap-4 w-full max-w-md p-8 bg-white bg-opacity-20 rounded-md shadow-md">
        <input
          type="text"
          placeholder="用户名或手机号"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          onClick={login}
          className="btn btn-primary w-full p-2 rounded-md"
        >
          登陆
        </button>
      </form>
    </main>
  );
}
