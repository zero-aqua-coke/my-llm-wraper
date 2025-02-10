// https://expressjs.com/
// https://expressjs.com/en/resources/middleware/cors.html

require("dotenv").config();
// process.env -> .env

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;

// !!!
app.use(express.json()); // JSON으로 들어오는 body를 인식

app.use(cors()); // 미들웨어
// 모두에게 오픈.

app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.send("Bye Earth!");
  // 수정 후 자동으로 리빌드 되는 건 자연스러운게 아님
  // 무언가 툴들이 도는 거에요... 여기선 nodemon
});

app.post("/", async (req, res) => {
  const { text } = req.body;
  // console.log(text);
  // https://www.together.ai/models
  // https://console.groq.com/docs/models
  // 1. 텍스트를 받아옴
  // 2-1. 이미지를 생성하는 프롬프트
  // llama-3-3-70b-free (together) -> 속도 측면
  // llama-guard-3-8b (groq) -> 안전하게 (이상한 표현)
  // 2-2. 그거에서 프롬프트만 JSON으로 추출
  // https://console.groq.com/docs/text-chat
  // - Mixtral performs best at generating JSON, followed by Gemma, then Llama
  // mixtral-8x7b-32768	(groq) 성능 1위
  // + gemma2-9b-it	(groq) 성능 2위 (그리고 나머지...)
  // + ... => 무료일경우에는 사용량문제고, 유료라면 단가?
  // 2-3. 그걸로 이미지를 생성
  // stable-diffusion-xl-base-1.0 (together)
  // 3-1. 설명을 생성하는 프롬프트
  // llama-3-3-70b-free (together)
  // 3-2. 그거에서 프롬프트만 추출
  // mixtral-8x7b-32768 (groq)
  // 3-3. 그걸로 thinking 사용해서 설명을 작성
  // DeepSeek-R1-Distill-Llama-70B-free (together)
  // 4. 그 결과를 { image: _, desc: _ }

  // https://www.together.ai/models/llama-3-3-70b-free

  const { TOGETHER_API_KEY } = process.env;
  const url = "https://api.together.xyz/v1/chat/completions";
  const model = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";
  const api_key = TOGETHER_API_KEY;
  const response = await axios.post(
    url,
    {
      model,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    }
  );
  res.json({ data: response.data });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
