from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # Import CORS
import os
import json
import re
from sentence_transformers import SentenceTransformer
import faiss
from openai import OpenAI

app = Flask(__name__, static_folder='build')
CORS(app)  # Enable CORS for all routes

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    tokens = re.findall(r'\b\w+\b', text)
    return " ".join(tokens)

# Load data and preprocess
with open("Data.json", "r") as f:
    data = json.load(f)

processed_data = []
for item in data:
    processed_question = preprocess_text(item["question"])
    processed_answer = preprocess_text(item["answer"])
    processed_data.append({"question": processed_question, "answer": processed_answer})

# Initialize embedding model and FAISS index
model = SentenceTransformer('all-MiniLM-L6-v2')
question_embeddings = model.encode([item["question"] for item in processed_data])

faiss_index = faiss.IndexFlatL2(question_embeddings.shape[1])
faiss_index.add(question_embeddings)

# Function to retrieve relevant answers using FAISS
def retrieve_answers(query, faiss_index, model, k=3):
    query_embedding = model.encode(query)
    D, I = faiss_index.search(query_embedding.reshape(1, -1), k)
    retrieved_answers = [processed_data[i]["answer"] for i in I[0]]
    return retrieved_answers

# Initialize OpenAI client
OPENROUTER_API_KEY = "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"
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# Function to generate answers using OpenAI API
def generate_answers(query, retrieved_answers, model):
    if isinstance(retrieved_answers, list):
        retrieved_answers = " ".join(retrieved_answers)
    prompt = (
        f"Question: {query}\nContext: {retrieved_answers}\n"
        "Provide a concise answer in bullet points. Each point should start with a '-' and be clear and actionable."
    )
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.3,
        )
        generated_text = response.choices[0].message.content.strip()
        bullet_points = generated_text.split("\n")
        return bullet_points[:3]
    except Exception as e:
        print(f"Error: {e}")
        return None

# Serve React app's static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Flask route to handle chat requests
@app.route('/chat', methods=['POST'])
def chat():
    user_query = request.json.get('query', '').strip()
    if not user_query:
        return jsonify({'response': ["Please provide a valid question."]})

    try:
        # Step 1: Retrieve relevant answers using FAISS
        retrieved_answers = retrieve_answers(user_query, faiss_index, model)

        # Step 2: Generate an answer using OpenAI API
        mistral_response = generate_answers(user_query, retrieved_answers, model="qwen/qwen2.5-vl-3b-instruct:free")

        # Handle errors in response generation
        if not mistral_response:
            return jsonify({'response': ["Could not generate an answer."]})

        # Step 3: Return the response to the frontend
        return jsonify({'response': mistral_response})
    except Exception as e:
        print(f"Error in /chat endpoint: {e}")
        return jsonify({'response': ['An error occurred. Please try again.']})

if __name__ == "__main__":
    app.run(debug=True)