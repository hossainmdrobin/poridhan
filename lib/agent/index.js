import { END, START, MessagesAnnotation, StateGraph, MemorySaver } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import readline from 'node:readline/promises';
import { SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import ModelManager from './modelManager.js';
dotenv.config();

// IMPORTING TOOLS
import { searchInfo } from './infoTool';

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
    const systemMessage = new SystemMessage(`You are a customer support chatbot rot our store.
        STRICT RULES:
        1. You must NEVER invent or guess information about the store.
2. You must NEVER use your general/pretrained knowledge to answer questions about:
   - return policy
   - refund policy
   - delivery
   - shipping
   - privacy
   - terms
   - store policies
   - store services
   - any other store-specific information

3. When a user asks a store-specific question, ALWAYS use the searchInfo tool first.

4. Only answer using information returned by searchInfo.

5. If searchInfo returns no relevant results, say:
   "Sorry, I couldn't find information about that."

6. Do not assume anything that is not explicitly present in the search results.

7. If the user asks something unrelated to the store's information, politely say that you can only help with store-related questions.

Keep answers concise and accurate.
        `)
        const messages = [systemMessage,...state.messages]
    const modelInfo = modelManager.getCurrentModelInfo()
    console.log(`Using model: ${modelInfo.name}${modelInfo.isRateLimited ? ' (rate limited)' : ''}`)

    const response = await modelManager.invoke(messages)
    return { messages: [response] }
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

const app = workflow.compile({ checkpointer })

async function invokeAgent(messages, thread_id = 'chatbot') {
    const langchainMessages = messages.map((msg) => {
        if (msg instanceof HumanMessage || msg instanceof AIMessage) {
            return msg;
        }
        if (msg.role === 'user') {
            return new HumanMessage(msg.content);
        }
        if (msg.role === 'assistant') {
            return new AIMessage(msg.content);
        }
        return new HumanMessage(typeof msg === 'string' ? msg : msg.content || String(msg));
    });

    const finalState = await app.invoke({
        messages: langchainMessages
    }, { configurable: { thread_id } });

    const lastMessage = finalState.messages[finalState.messages.length - 1];

    if (lastMessage && typeof lastMessage.content === 'string') {
        return lastMessage.content;
    }

    return JSON.stringify(lastMessage?.content || '');
}

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
        }, { configurable: { thread_id: 'main-thread' } });
        console.log("Final State: ", finalState);

        // const lastMessage = finalState.messages[finalState.messages.length - 1]
        // console.log("Final State: ", lastMessage.text);
    }
    rl.close();

}

export { app, invokeAgent };

const isMain = typeof process !== 'undefined' && process.argv && process.argv[1] && (
    process.argv[1] === fileURLToPath(import.meta.url) ||
    process.argv[1].endsWith('agent/index.js') ||
    process.argv[1].endsWith('agent\\index.js')
);

if (isMain) {
    main();
}