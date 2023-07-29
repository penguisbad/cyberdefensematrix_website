/*
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { Chroma } from "langchain/vectorstores";
import { VectorDBQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
*/

const query = async (prompt, temperature) => {
  let response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": prompt}],
      "temperature": temperature,
      "max_tokens": 100
    })
  });
  return response.json();
}

const mapProduct = async (product) => {
  let response = await query('Which of the five NIST framework functions does ' + product +' perform? Answer "Identify", "Protect", "Detect", "Respond" or "Recover" and choose only one answer.', 0);
  let textResponse = response.choices[0].message.content;
  let xAxis = "";
  console.log(response, textResponse);
  ["Identify", "Protect", "Detect", "Respond", "Recover"].forEach(element => {
    if (textResponse.includes(element)) {
      xAxis = element;
    }
  });
  response = await query('Explain very briefly how ' + product + ' performs the "' + xAxis + '" of the NIST framework', 0.3);
  console.log(response)
  let xAxisExplanation = response.choices[0].message.content;

  response = await query('What does ' + product + ' protect? Answer "Devices", "Applications", "Networks", "Data", or "Users" and choose only one answer.', 0);
  textResponse = response.choices[0].message.content;
  let yAxis = "";
  console.log(response, textResponse);
  ["Devices", "Applications", "Networks", "Data", "Users"].forEach(element => {
    if (textResponse.includes(element)) {
      yAxis = element;
    }
  });
  response = await query('Explain very briefly how ' + product + ' protects ' + yAxis, 0.3);
  console.log(response);
  let yAxisExplanation = response.choices[0].message.content;

  return [[xAxis, yAxis], [xAxisExplanation, yAxisExplanation]];
}

let previousCoordinates = null;
let waiting = false;

document.getElementById("go").addEventListener("click", async (event) => {
  if (waiting) {
    return;
  }
  waiting = true;
  if (previousCoordinates != null) {
    document.getElementById(previousCoordinates[0][0] + "-" + previousCoordinates[0][1]).style.backgroundColor = "black";
  }
  let coordinates = await mapProduct(document.getElementById("input").value);
  previousCoordinates = coordinates;
  document.getElementById(coordinates[0][0] + "-" + coordinates[0][1]).style.backgroundColor = "green";
  document.getElementById("explanation").innerHTML = coordinates[1][0] + "<br>" + coordinates[1][1];
  waiting = false;
});