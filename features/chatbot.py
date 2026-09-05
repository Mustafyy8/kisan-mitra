import streamlit as st
from services.llm import generate_agricultural_response

def chatbot_ui():
    st.markdown("<h2 style='color: #4ade80;'>🤖 AI Farming Copilot</h2>", unsafe_allow_html=True)
    st.write("Ask me anything about crops, diseases, soil health, or weather!")

    # Initialize chat history
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = [
            {"role": "assistant", "content": "Hello! I am your KISAN MITRA AI. How can I help your farm today?"}
        ]

    # Display chat messages from history on app rerun
    for message in st.session_state.chat_history:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # React to user input
    if prompt := st.chat_input("E.g., What is the best fertilizer for Rice?"):
        # Display user message in chat message container
        st.chat_message("user").markdown(prompt)
        
        # Add user message to chat history
        st.session_state.chat_history.append({"role": "user", "content": prompt})

        # Generate response using LLM
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = generate_agricultural_response(prompt, st.session_state.chat_history[:-1])
                st.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.chat_history.append({"role": "assistant", "content": response})
