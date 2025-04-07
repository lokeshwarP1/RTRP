from flask import Flask, render_template, request, jsonify
import json
import re
from sentence_transformers import SentenceTransformer
import faiss
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
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

# Initialize FAISS index
faiss_index = faiss.IndexFlatL2(question_embeddings.shape[1])
faiss_index.add(question_embeddings)

def retrieve_answers(query, faiss_index, model, k=3):
    query_embedding = model.encode(query)
    D, I = faiss_index.search(query_embedding.reshape(1, -1), k)  # Search for top k
    retrieved_answers = [processed_data[i]["answer"] for i in I[0]]
    return retrieved_answers

# Initialize OpenAI client
OPENROUTER_API_KEY = "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"
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# Generate answers using Mistral (in bullet points, limit to 2-3)
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
            max_tokens=200,  # Allow space for multiple bullet points
            temperature=0.3,  # Lower temperature for clarity
        )
        generated_text = response.choices[0].message.content.strip()
        bullet_points = generated_text.split("\n")  # Split into a list of bullet points
        return bullet_points[:3]  # Return only the first 2-3 points
    except Exception as e:
        print(f"Error: {e}")
        return None

# Flask routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_query = request.json.get('query', '').strip()
    if not user_query:
        return jsonify({'response': 'Please provide a question.'}), 400

    try:
        # Step 1: Retrieve relevant answers using FAISS
        retrieved_answers = retrieve_answers(user_query, faiss_index, model)
        
        # Step 2: Generate an answer using Mistral
        mistral_response = generate_answers(user_query, retrieved_answers, model="qwen/qwen2.5-vl-3b-instruct:free")
        if not mistral_response:
            return jsonify({'response': 'Could not generate an answer.'}), 500
        
        # Return the response
        return jsonify({'response': mistral_response})
    
    except Exception as e:
        print(f"Error in /chat endpoint: {e}")
        return jsonify({'response': 'An error occurred. Please try again.'}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    # Implement chat history retrieval if needed
    return jsonify([])

@app.route('/api/history', methods=['DELETE'])
def clear_history():
    # Implement chat history clearing if needed
    return '', 204

@app.route('/api/rate', methods=['POST'])
def rate_message():
    # Implement message rating if needed
    return '', 204

if __name__ == "__main__":
    app.run(debug=True, port=5000)