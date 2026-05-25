from agentops import AgentOpsClient
from agentops.integrations.langchain import AgentOpsLangChainCallbackHandler


def main() -> None:
    client = AgentOpsClient(base_url="http://127.0.0.1:8000")

    callback = AgentOpsLangChainCallbackHandler(
        client=client,
        agent_id="agent-demo-1",
    )

    print("Attach this callback to a LangChain invoke call:")
    print(
        'chain.invoke({"question": "Where is my order?"}, '
        'config={"callbacks": [callback]})'
    )
    print(callback)


if __name__ == "__main__":
    main()
