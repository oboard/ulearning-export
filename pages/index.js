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
  const loadQuestion = async (e) => {
    e.preventDefault();
    // 获取题目数量
    console.log(authorization);
    const answerConditionResponse = await fetch(
      "/api/questionTraining/student/training?qtId=1511&ocId=120798&traceId=11735745",
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
      `/api/questionTraining/student/answerSheet?qtId=1511&ocId=120798&qtType=1&traceId=${traceId}`,
      config
    );
    const answers = await answersResponse.json();
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
    const answerMap = {};
    answers.result.list.forEach((item) => {
      answerMap[item.id] = item.answer;
    });
    console.log(answers);

    // 题库
    const questionBankResponse = await fetch(
      `/api/questionTraining/student/questionList?qtId=1511&ocId=120798&qtType=1&pn=1&ps=${answerCondition.orderTotal}&traceId=11735745`,
      config
    );

    let ques = "";
    const quesitionBankJson = await questionBankResponse.json();

    console.log(quesitionBankJson);
    let index = 0;
    quesitionBankJson.result.trainingQuestions.forEach((item) => {
      index++;
      ques += index + ". " + item.title + "\n";
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
          ques += "正确 错误\n";
          break;
      }
      if(answerMap[item.id]===null) {
        ques += "未答题\n";
      } else {
        ques += "答案：" + answerMap[item.id].join(",") + "\n";
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
      .replace("&nbsp;", " ")
      .replace("&lt;", "<")
      .replace("&gt;", ">")
      .replace("&amp;", "&")
      .replace("&quot;", '"')
      .replace("&apos;", "'")
      .replace("<br />", "")
      .replace("<br/>", "")
      .replace("<br>", "")
      .replace(/<[^>]+>/g, ""); // 去掉所有的html标记
    setQuestions(ques);
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
          placeholder="请输入优学院题库TraceId"
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
