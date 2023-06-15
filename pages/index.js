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
  const loadQuestion = (e) => {
    e.preventDefault();
    // 获取题目数量
    console.log(authorization);
    fetch(
      "/api/questionTraining/student/training?qtId=1511&ocId=120798&traceId=11735745",
      {
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
      }
    ).then((res) => {
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
      res.json().then((json) => {
        console.log(json);
        if (json.code >= 2000) {
          setQuestions(json.message);
          return;
        }
        setAnswerCondition(json.result);
      });
    });

    // 题库
    fetch(
      `/api/questionTraining/student/questionList?qtId=1511&ocId=120798&qtType=1&pn=1&ps=${answerCondition.orderTotal}&traceId=11735745`,
      {
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
      }
    ).then((res) => {
      let ques = "";
      res.json().then((json) => {
        {
          /* {
      "code": 1,
      "message": "成功",
      "result": {
          "qtId": 1511,
          "trainingQuestions": [
              {
                  "id": 103488,
                  "type": 1,
                  "title": "甲午海战发生的年度是 ( ) ",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": [
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "1894年",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "1895年",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "1931年",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "1937年",
                          "link": ""
                      }
                  ],
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 103489,
                  "type": 1,
                  "title": "中国公民能够快速从关西机场撤出，告诉我们，一个国家是否强大关键在于： ( ) ",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": [
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "当你身处海外险境时祖国能第一时间把你接走",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "护照可能有近200个国家对你免签证",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "国家有丰富的石油资源",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "国家GDP很高特价也很高",
                          "link": ""
                      }
                  ],
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 103757,
                  "type": 2,
                  "title": "在信的方面，学会了 ( ) 。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": [
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "体贴",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "奉献",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "务实",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "沉默",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "风度",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "自信",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "执着",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "积极",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "认真",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "团结",
                          "link": ""
                      }
                  ],
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 104026,
                  "type": 2,
                  "title": "当前全世界仅有美国、 ( ) 等五国拥有攻击型核潜艇。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": [
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "俄罗斯     ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "英国     ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "法国     ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "中国",
                          "link": ""
                      }
                  ],
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 104027,
                  "type": 2,
                  "title": "潜艇主要分为 ( ) 三大类。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": [
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "弹道导弹核潜艇 ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "攻击型核潜艇 ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "常规潜艇   ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "防御型潜艇",
                          "link": ""
                      }
                  ],
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 104028,
                  "type": 2,
                  "title": "美国“福特”级航母较“尼米兹”级航母的主要区别在于采用了 ( ) 。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": [
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "电磁弹射器 ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "先进拦阻装置 ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "新型核动力推进系统 ",
                          "link": ""
                      },
                      {
                          "choiceItemID": 0,
                          "questionID": 0,
                          "title": "新型配电系统",
                          "link": ""
                      }
                  ],
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 103495,
                  "type": 4,
                  "title": "撤侨行动中，海军战士们听懂冷馒头加咸菜，可能是军舰伙食保障能力不好。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": null,
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 103496,
                  "type": 4,
                  "title": "也门撤侨行动中，我海军还帮助巴基斯坦等车撤走了约200名侨民。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": null,
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 103500,
                  "type": 4,
                  "title": "鸦片战争之后，中国进入了一个没完没了的割地赔款时代，一直持续到民国政府时代。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": null,
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
              {
                  "id": 103519,
                  "type": 4,
                  "title": "历史事实告诉我们轵有国防强大了，才能保一方平安，我们经济建设的成就才能不被别人抢走。",
                  "hardlevel": 3,
                  "blankOrder": 0,
                  "item": null,
                  "subQuestions": null,
                  "link": null,
                  "answerLinkList": null,
                  "demoLinkList": null,
                  "formulaVar": null,
                  "linkOptionList": null
              },
          ],
          "version": 1,
          "state": 1
      }
  } */
        }
        console.log(json);
        let index = 0;
        json.result.trainingQuestions.forEach((item) => {
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
        ques = ques.replace('&nbsp;', ' ').replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('&quot;', '"').replace('&apos;', "'").replace('<br />', '').replace('<br/>', '').replace('<br>', '');
        setQuestions(ques);
      });
    });

    // 答案
    fetch(
      `/api/questionTraining/student/answerSheet?qtId=1511&ocId=120798&qtType=1&traceId=${traceId}`,
      {
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
      }
    ).then((res) => console.log(res.json()));
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
