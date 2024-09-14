const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const videoUrl = event.queryStringParameters.url;
  try {
    const response = await fetch(videoUrl);
    const data = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "video/webm",
        "Access-Control-Allow-Origin": "*", // 필요시 CORS 헤더 설정
      },
      body: data.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
