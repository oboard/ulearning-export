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

export default function Home() {
  const [authorization, setAuthorization] = useLocalStorage(
    "authorization",
    ""
  );
  const [traceId, setTraceId] = useLocalStorage("traceId", "");
  const [courseId, setCourseId] = useLocalStorage("courseId", "");
  const [questions, setQuestions] = useLocalStorage("questions", "");
  const [answerCondition, setAnswerCondition] = useLocalStorage(
    "questions",
    ""
  );
  const config = {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh",
      authorization: authorization,
      "cache-control": "no-cache",
      pragma: "no-cache",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
    },
    referrer: "https://utest.ulearning.cn/index.html?v=1686750539947",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  };
  let answerMap = {};
  let ocId, orgId;
  let answers = {};
  let qtId;
  const loadQuestion = async (e) => {
    e.preventDefault();
    // 获取题目数量
    console.log(authorization);

    const listResponse = await fetch(
      `/utestapi/questionTraining/list?ocId=${courseId}&lang=zh`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          authorization: authorization,
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://courseweb.ulearning.cn/ulearning/index.html",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    );

    //   {
    //     "code": 1,
    //     "message": "成功",
    //     "result": [
    //         {
    //             "id": 1511,
    //             "ocId": 120798,
    //             "orgId": 3755,
    //             "state": 1,
    //             "createTime": 1685500773000,
    //             "updateTime": 1685500868000
    //         }
    //     ]
    // }
    const listJson = await listResponse.json();
    if (listJson.code >= 2000) {
      setQuestions(listJson.message);
      return;
    }
    console.log(listJson);
    ocId = listJson.result[0].ocId;
    orgId = listJson.result[0].orgId;
    qtId = listJson.result[0].id;

    const answerConditionResponse = await fetch(
      `/utestapi/questionTraining/student/training?qtId=${qtId}&ocId=${ocId}&qtType=1&traceId=${traceId}`,
      config
    );
    // {
    //   "code": 1,
    //   "message": "成功",
    //   "result": {
    //     "qtId": 1511,
    //     "state": 1,
    //     "orderProgress": 0.2,
    //     "correctAccuracy": 100,
    //     "orderTotal": 578,
    //     "answeredTotal": 1,
    //     "wrongTotal": 0
    //   }
    // }
    const answerConditionJson = await answerConditionResponse.json();

    console.log(answerConditionJson);
    if (answerConditionJson.code >= 2000) {
      setQuestions(answerConditionJson.message);
      return;
    }
    setAnswerCondition(answerConditionJson.result);

    // 答案
    const answersResponse = await fetch(
      `/utestapi/questionTraining/student/answerSheet?qtId=${qtId}&ocId=${ocId}&qtType=1&traceId=${traceId}`,
      config
    );
    answers = await answersResponse.json();
    //   {
    //     "code": 1,
    //     "message": "成功",
    //     "result": {
    //         "version": 1,
    //         "state": 1,
    //         "index": 0,
    //         "total": 578,
    //         "list": [
    //             {
    //                 "id": 103488,
    //                 "questionType": 1,
    //                 "correct": true,
    //                 "answer": [
    //                     "A"
    //                 ]
    //             },
    //             {
    //                 "id": 103489,
    //                 "questionType": 1,
    //                 "correct": true,
    //                 "answer": [
    //                     "A"
    //                 ]
    //             },
    //             {
    //                 "id": 103493,
    //                 "questionType": 1,
    //                 "correct": null,
    //                 "answer": null
    //             },
    //             {
    //                 "id": 103497,
    //                 "questionType": 1,
    //                 "correct": null,
    //                 "answer": null
    //             },
    //             {
    //                 "id": 103498,
    //                 "questionType": 1,
    //                 "correct": null,
    //                 "answer": null
    //             },
    //         ]
    //     }
    // }
    // 整理成map
    answers.result.list.forEach((item) => {
      if(item.correct){
        answerMap[item.id] = item.answer;
      } else {
        if(item.answer){
          answerMap[item.id] = 1;
        }
      }
    });
    console.log(answers);

    // 题库
    const questionBankResponse = await fetch(
      `/utestapi/questionTraining/student/questionList?qtId=${qtId}&ocId=${ocId}&qtType=1&pn=1&ps=${answerCondition.orderTotal}&traceId=${traceId}`,
      config
    );

    let ques = "";
    const quesitionBankJson = await questionBankResponse.json();

    console.log(quesitionBankJson);
    let index = 0;
    quesitionBankJson.result.trainingQuestions.forEach((item) => {
      index++;
      ques += index + "、 " + item.title + "\n";
      switch (item.type) {
        case 1:
        case 2:
          item.item.forEach((item2, i) => {
            ques +=
              ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"][i] +
              ". " +
              item2.title +
              "\n";
          });
          break;
        case 3:
          break;
        case 4:
          // ques += "正确 错误\n";
          break;
      }
      if (answerMap[item.id] === 1) {
        ques += "答案错误\n";
      } else if(answerMap[item.id] === undefined){
        ques += "未答题\n";
      } else {
        ques += "答案：" + answerMap[item.id].join("") + "\n";
      }
      ques += "\n";
      // {
      // "id": 103488,
      //         "type": 1,
      //         "title": "甲午海战发生的年度是 ( ) ",
      //         "hardlevel": 3,
      //         "blankOrder": 0,
      //         "item": [
      //             {
      //                 "choiceItemID": 0,
      //                 "questionID": 0,
      //                 "title": "1894年",
      //                 "link": ""
      //             },
      //             {
      //                 "choiceItemID": 0,
      //                 "questionID": 0,
      //                 "title": "1895年",
      //                 "link": ""
      //             },
      //             {
      //                 "choiceItemID": 0,
      //                 "questionID": 0,
      //                 "title": "1931年",
      //                 "link": ""
      //             },
      //             {
      //                 "choiceItemID": 0,
      //                 "questionID": 0,
      //                 "title": "1937年",
      //                 "link": ""
      //             }
      //         ],
      //         "subQuestions": null,
      //         "link": null,
      //         "answerLinkList": null,
      //         "demoLinkList": null,
      //         "formulaVar": null,
      //         "linkOptionList": null
      //     },
    });
    ques = ques
      .replace(/&nbsp;/g, " ")
      .replace("&lt;", "<")
      .replace("&gt;", ">")
      .replace("&amp;", "&")
      .replace("&quot;", '"')
      .replace("&apos;", "'")
      .replace("<br />", "")
      .replace("<br/>", "")
      .replace("答案：true", "答案：正确")
      .replace("答案：false", "答案：错误")
      .replace("<br>", "")
      .replace(/<[^>]+>/g, ""); // 去掉所有的html标记
    setQuestions(ques);
  };
  const fixAnswer = async (e) => {
    e.preventDefault();
    await loadQuestion(e);
    // 循环，检查答案是否错误，如果错误，发送请求，其中请求的body的answer为发送的答案，响应的result.correctAnswer为正确答案
    // 响应：
    // {
    //   "code": 1,
    //   "message": "回答正确",
    //   "result": {
    //     "id": null,
    //     "subQuestions": null,
    //     "correctAnswer": [
    //       "B"
    //     ],
    //     "correctreply": "",
    //     "analyLinkList": null,
    //     "answerLinkList": null,
    //     "correct": true
    //   }
    // }
    // 请求：
    //     fetch("https://utestapi.ulearning.cn/questionTraining/student/answer?traceId=11735745", {
    //   "headers": {
    //     "accept": "application/json, text/plain, */*",
    //     "accept-language": "zh",
    //     "authorization": "5D4CED0795511D9216C79CB8734EAC13",
    //     "cache-control": "no-cache",
    //     "content-type": "application/json;charset=UTF-8",
    //     "pragma": "no-cache",
    //     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\"",
    //     "sec-ch-ua-mobile": "?0",
    //     "sec-ch-ua-platform": "\"macOS\"",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-site"
    //   },
    //   "referrer": "https://utest.ulearning.cn/index.html?v=1687000809024",
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body": "{\"qtId\":1511,\"qtType\":1,\"index\":2,\"relationId\":103493,\"answer\":[\"B\"]}",
    //   "method": "POST",
    //   "mode": "cors",
    //   "credentials": "include"
    // });
    setQuestions("正在修复答案...");
    for(let i in answers.result.list) {
      let item = answers.result.list[i];
      if(!item.correct){
          let answer = item.answer;
          if(!answer) {
            answer = ['A'];
          }
          // 转换 `{\"qtId\":${qtId},\"qtType\":1,\"index\":2,\"relationId\":${item.id},\"answer\":${answer}}`
          let ansbody = JSON.stringify({
            "qtId": qtId,
            "qtType": 1,
            "index": i,
            "relationId": item.id,
            "answer": [
              "C"
            ]
          });
          let res = await fetch(
            `/utestapi/questionTraining/student/answer?traceId=${traceId}`,
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "zh",
                authorization: authorization,
                "cache-control": "no-cache",
                "content-type": "application/json;charset=UTF-8",
                pragma: "no-cache",
                "sec-ch-ua":
                  '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
              },
              referrer: "https://utest.ulearning.cn/index.html?v=1687000809024",
              referrerPolicy: "strict-origin-when-cross-origin",
              body: ansbody,
              method: "POST",
              mode: "cors",
              credentials: "include",
            }
          );
          let resJson = await res.json();
          console.log(resJson);
          
            answerMap[item.id] = answer = resJson.result.correctAnswer;
            ansbody = JSON.stringify({
              "qtId": qtId,
              "qtType": 1,
              "index": i,
              "relationId": item.id,
              "answer": answer
            });
            let json =await (await fetch(
              `/utestapi/questionTraining/student/answer?traceId=${traceId}`,
              {
                headers: {
                  accept: "application/json, text/plain, */*",
                  "accept-language": "zh",
                  authorization: authorization,
                  "cache-control": "no-cache",
                  "content-type": "application/json;charset=UTF-8",
                  pragma: "no-cache",
                  "sec-ch-ua":
                    '" Not A;Brand";v="99", "Chromium";v="112", "Google Chrome";v="112"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"macOS"',
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                },
                referrer: "https://utest.ulearning.cn/index.html?v=1687000809024",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: ansbody,
                method: "POST",
                mode: "cors",
                credentials: "include",
              }
            )).json();
            console.log(json);
            // 显示修复进度
            setQuestions( `正在修复答案...第${i}/${answers.result.list.length}题 ${json.result.correctAnswer}`);
      }
    }
    
    setQuestions("正在导出题库...");
    // 导出题库
    await loadQuestion(e);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-8 `}
    >
      {/* <h1 className="text-4xl font-bold text-center">
        优学院题库导出助手
        <br />
        <span className="text-2xl font-normal">
          一键导出优学院题库，支持导出题库、题目、答案、解析等
        </span>
      </h1> */}
      {/* 上面是桌面端代码，为了适配移动端，使用响应式布局 */}
      <div className="text-2xl font-bold text-center">
        优学院题库导出助手
        <br />
        <span className="text-sm font-normal">
          一键导出优学院题库，支持导出题库、题目、答案、解析等
        </span>
      </div>

      {/* 表单 */}
      <form className="flex flex-col items-center justify-center space-y-4 py-4">
        <input
          className="w-64 p-2 border border-gray-300 rounded-md"
          value={traceId}
          onChange={(e) => {
            setTraceId(e.target.value);
          }}
          placeholder="请输入优学院账号UserId/TraceId"
        />
        <input
          className="w-64 p-2 border border-gray-300 rounded-md"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
          }}
          placeholder="请输入优学院题库CourseId"
        />
        {/* Authorization: */}
        <input
          className="w-64 p-2 border border-gray-300 rounded-md"
          value={authorization}
          onChange={(e) => {
            setAuthorization(e.target.value);
          }}
          placeholder="请输入优学院Cookie"
        />
        <button className="w-64 btn" onClick={loadQuestion}>
          导出题库
        </button>
        <button className="w-64 btn" onClick={fixAnswer}>
          修正错误答案
        </button>
      </form>
      {/* {
    "qtId": 1511, //题目ID
    "state": 1, //状态
    "orderProgress": 0.3, //进度
    "correctAccuracy": 100, //正确率
    "orderTotal": 578, //题目总数
    "answeredTotal": 2, //已答题目数
    "wrongTotal": 0 //错误题目数
} */}
      {/* 答题情况展示 */}
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <div className="flex flex-row items-center justify-center space-x-4 px-4">
          <div>题目ID：{answerCondition.qtId}</div>
          <div>状态：{answerCondition.state}</div>
          <div>进度：{answerCondition.orderProgress}</div>
          <div>正确率：{answerCondition.correctAccuracy}</div>
          <div>题目总数：{answerCondition.orderTotal}</div>
          <div>已答题目数：{answerCondition.answeredTotal}</div>
          <div>错误题目数：{answerCondition.wrongTotal}</div>
        </div>
      </div>
      {/* 题库展示 */}
      <textarea
        value={questions}
        spellCheck={false}
        readOnly={true}
        className="w-full my-8 min-h-16 h-64 p-2 border border-gray-300 rounded-md"
      />
    </main>
  );
}
