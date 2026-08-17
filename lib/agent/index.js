import { END,START, MessagesAnnotation, StateGraph, MemorySaver } from '@langchain/langgraph';
import readline from 'node:readline/promises';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { HumanMessage } from '@langchain/core/messages';
import { TavilySearch } from '@langchain/tavily';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import ModelManager from './modelManager.js';
dotenv.config();

// IMPORTING TOOLS
import { searchInfo } from './infoTool.js';

const checkpointer = new MemorySaver()

const tools = [searchInfo]
const toolNode = new ToolNode(tools)

// Initialize ModelManager for automatic model switching
const modelManager = new ModelManager(tools)

// 1. define node function
// 2. build the graph
// 3. Compile and invoke the graph

async function callModel(state) {
    //call the llm using the model manager with automatic fallback
    console.log("Calling the model via ModelManager")
    const modelInfo = modelManager.getCurrentModelInfo()
    console.log(`Using model: ${modelInfo.name}${modelInfo.isRateLimited ? ' (rate limited)' : ''}`)
    
    const response = await modelManager.invoke(state.messages)
    return {messages:[response]}
}

function shouldContinue(state) {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage?.tool_calls?.length > 0) {
        return "tools";
    }
    return END;
}

// BUILD THE GRAPH
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel) 
    .addNode('tools', toolNode)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', shouldContinue)
    .addEdge('tools', 'agent')

// COMPILE THE GRAPH

const app = workflow.compile({checkpointer})

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    while (true) {

        const userInput = await rl.question('You: ');
        if (userInput.toLowerCase() === 'exit') {
            console.log("Exiting...");
            break;
        }

        const finalState = await app.invoke({
            messages: [new HumanMessage(userInput)]
        },{configurable:{thread_id: 'main-thread'}});
        console.log("Final State: ", finalState);

        // const lastMessage = finalState.messages[finalState.messages.length - 1]
        // console.log("Final State: ", lastMessage.text);
    }
    rl.close();

}

export { app };

const isMain = typeof process !== 'undefined' && process.argv && process.argv[1] && (
  process.argv[1] === fileURLToPath(import.meta.url) || 
  process.argv[1].endsWith('agent/index.js') ||
  process.argv[1].endsWith('agent\\index.js')
);

if (isMain) {
  main();
}