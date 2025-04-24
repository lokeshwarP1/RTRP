# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import os
# import json
# import re
# from sentence_transformers import SentenceTransformer
# import faiss
# from openai import OpenAI
# from pymongo import MongoClient
# from bson import ObjectId
# from datetime import datetime
# import asyncio
# import sys
# sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# from sa import login_to_kmit_netra  # Import the scraping function from sa.py

# app = Flask(__name__, static_folder='build')
# CORS(app, resources={
#     r"/*": {"origins": "http://localhost:5173", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}
# })

# # Add no-cache headers to all responses
# @app.after_request
# def add_header(response):
#     response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
#     response.headers['Pragma'] = 'no-cache'
#     response.headers['Expires'] = '0'
#     return response

# # MongoDB connection
# try:
#     client = MongoClient('mongodb://localhost:27017/')
#     db = client['campus-genie']
#     chat_history_collection = db['chat_history']
#     users_collection = db['users']
#     # Test the connection
#     client.admin.command('ping')
#     print("Successfully connected to MongoDB")
# except Exception as e:
#     print(f"Error connecting to MongoDB: {e}")
#     raise

# # Create indexes for chat history
# try:
#     chat_history_collection.create_index([('user_id', 1), ('timestamp', -1)])
#     print("Created index on chat_history collection")
# except Exception as e:
#     print(f"Error creating index: {e}")

# # Preprocessing function
# def preprocess_text(text):
#     text = text.lower()
#     tokens = re.findall(r'\b\w+\b', text)
#     return " ".join(tokens)

# # Load and preprocess data
# with open("Data.json", "r") as f:
#     data = json.load(f)

# processed_data = []
# for item in data:
#     processed_question = preprocess_text(item["question"])
#     processed_answer = preprocess_text(item["answer"])
#     processed_data.append({"question": processed_question, "answer": processed_answer})

# # Initialize embedding model and FAISS
# model = SentenceTransformer('all-MiniLM-L6-v2')
# question_embeddings = model.encode([item["question"] for item in processed_data])

# faiss_index = faiss.IndexFlatL2(question_embeddings.shape[1])
# faiss_index.add(question_embeddings)

# # FAISS retrieval
# def retrieve_answers(query, faiss_index, model, k=3):
#     query_embedding = model.encode(query)
#     D, I = faiss_index.search(query_embedding.reshape(1, -1), k)
#     retrieved_answers = [processed_data[i]["answer"] for i in I[0]]
#     return retrieved_answers

# # OpenAI client
# OPENROUTER_API_KEY = "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" #api key
# client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key=OPENROUTER_API_KEY,
# )

# # Generate response
# def generate_answers(query, retrieved_answers, model):
#     if isinstance(retrieved_answers, list):
#         retrieved_answers = " ".join(retrieved_answers)
#     prompt = (
#         f"Question: {query}\nContext: {retrieved_answers}\n"
#         "Provide a concise answer in bullet points. Each point should start with a '-' and be clear and actionable."
#     )
#     try:
#         response = client.chat.completions.create(
#             model=model,
#             messages=[{"role": "user", "content": prompt}],
#             max_tokens=200,
#             temperature=0.7,
#         )
#         generated_text = response.choices[0].message.content.strip()
#         bullet_points = generated_text.split("\n")
#         return bullet_points[:3]
#     except Exception as e:
#         print(f"Error: {e}")
#         return None

# # Global variable to store dashboard data
# dashboard_data = {
#     'attendance': None,
#     'timetable': None,
#     'last_updated': None
# }

# @app.route('/api/dashboard-data', methods=['GET'])
# def get_dashboard_data():
#     return jsonify(dashboard_data)

# @app.route('/api/update-dashboard', methods=['POST'])
# def update_dashboard():
#     try:
#         mobile_number = request.json.get('mobile_number')
#         if not mobile_number:
#             return jsonify({'error': 'Mobile number is required'}), 400

#         # Use asyncio.run for the async scraper
#         data = asyncio.run(login_to_kmit_netra(mobile_number))
        
#         # Update the dashboard data
#         dashboard_data.update(data)
        
#         return jsonify({
#             'message': 'Dashboard data updated successfully',
#             'data': dashboard_data
#         })
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Error handlers
# @app.errorhandler(404)
# def not_found_error(error):
#     if request.path.startswith('/api/'):
#         return jsonify({
#             'error': 'Resource not found',
#             'status': 404
#         }), 404
#     return send_from_directory(app.static_folder, 'index.html')

# # Auth endpoints
# @app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
# def login():
#     if request.method == 'OPTIONS':
#         return '', 200
        
#     try:
#         data = request.json
#         print(f"Login request data: {data}")  # Debug log
#         email = data.get('email')
#         password = data.get('password')
        
#         if not email or not password:
#             return jsonify({'error': 'Email and password are required'}), 400
            
#         user = users_collection.find_one({'email': email})
#         if not user:
#             return jsonify({'error': 'User not found'}), 404
            
#         # In a real app, you would verify the password hash here
#         if user['password'] != password:  # This is just for testing
#             return jsonify({'error': 'Invalid password'}), 401
            
#         return jsonify({
#             'user': {
#                 '_id': str(user['_id']),
#                 'email': user['email'],
#                 'name': user.get('name', '')
#             }
#         })
#     except Exception as e:
#         print(f"Login error: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/auth/profile', methods=['GET', 'OPTIONS'])
# def get_profile():
#     if request.method == 'OPTIONS':
#         return '', 200
        
#     try:
#         user_id = request.args.get('userId')
#         if not user_id:
#             return jsonify({'error': 'User ID is required'}), 400
            
#         user = users_collection.find_one({'_id': ObjectId(user_id)})
#         if not user:
#             return jsonify({'error': 'User not found'}), 404
            
#         return jsonify({
#             'user': {
#                 '_id': str(user['_id']),
#                 'email': user['email'],
#                 'name': user.get('name', '')
#             }
#         })
#     except Exception as e:
#         print(f"Profile error: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# # Chat history collection
# chat_history = {}

# @app.route('/api/chat/history/<user_id>', methods=['GET'])
# def get_chat_history(user_id):
#     try:
#         # Handle undefined or invalid user_id
#         if not user_id or user_id == 'undefined':
#             return jsonify({
#                 'error': 'Invalid user ID',
#                 'status': 400
#             }), 400

#         try:
#             # Convert string to ObjectId
#             user_id_obj = ObjectId(user_id)
#         except:
#             return jsonify({
#                 'error': 'Invalid user ID format',
#                 'status': 400
#             }), 400

#         # Check if user exists first
#         user = users_collection.find_one({'_id': user_id_obj})
#         if not user:
#             return jsonify({
#                 'error': 'User not found',
#                 'status': 404
#             }), 404

#         # Get chat history from MongoDB sorted by timestamp
#         history = list(chat_history_collection.find(
#             {'user_id': user_id},  # Changed from userId to user_id
#             {'_id': 1, 'query': 1, 'response': 1, 'timestamp': 1}
#         ).sort('timestamp', -1))
        
#         # Convert ObjectId to string for JSON serialization
#         for chat in history:
#             chat['_id'] = str(chat['_id'])
#             chat['timestamp'] = chat['timestamp'].isoformat() if isinstance(chat['timestamp'], datetime) else chat['timestamp']
        
#         return jsonify(history)
#     except Exception as e:
#         print(f"Chat history error: {str(e)}")
#         return jsonify({
#             'error': str(e),
#             'status': 500
#         }), 500

# @app.route('/api/chat/history/<user_id>', methods=['DELETE'])
# def clear_chat_history(user_id):
#     try:
#         result = chat_history_collection.delete_many({'user_id': user_id})  # Changed from userId to user_id
#         return jsonify({
#             'message': 'Chat history cleared successfully',
#             'deleted_count': result.deleted_count
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/chat', methods=['POST'])
# def chat():
#     try:
#         data = request.json
#         query = data.get('query')
#         user_id = data.get('userId')
        
#         if not query:
#             return jsonify({'error': 'Query is required'}), 400
            
#         if not user_id:
#             return jsonify({'error': 'User ID is required'}), 400

#         # Get response from your existing chat logic
#         response = generate_answers(query, retrieve_answers(query, faiss_index, model), "openai/gpt-3.5-turbo")
        
#         # Store in MongoDB
#         chat_history_collection.insert_one({
#             'user_id': user_id,
#             'query': query,
#             'response': response,
#             'timestamp': datetime.now()
#         })
        
#         return jsonify({'response': response})
        
#     except Exception as e:
#         print(f"Chat error: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/rate', methods=['POST'])
# def rate_message():
#     try:
#         data = request.json
#         message_id = data.get('messageId')
#         rating = data.get('rating')
#         user_id = data.get('userId')
        
#         if not all([message_id, rating, user_id]):
#             return jsonify({'error': 'Message ID, rating, and user ID are required'}), 400
            
#         # Update the message rating in MongoDB
#         result = chat_history_collection.update_one(
#             {'_id': ObjectId(message_id), 'user_id': user_id},
#             {
#                 '$set': {
#                     'rating': rating,
#                     'rated_at': datetime.now()
#                 }
#             }
#         )
        
#         if result.modified_count == 0:
#             return jsonify({'error': 'Message not found or not owned by user'}), 404
            
#         return jsonify({'message': 'Message rated successfully'})
#     except Exception as e:
#         print(f"Rate error: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# # Serve static files and handle client-side routing
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_react_app(path):
#     if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
#         return send_from_directory(app.static_folder, path)
#     return send_from_directory(app.static_folder, 'index.html')

# # Run on port 4000
# if __name__ == "__main__":
#     app.run(debug=True, port=4000)


from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from bson import ObjectId
from datetime import datetime
import asyncio
from langchain_core.messages import HumanMessage, AIMessage
from openai import OpenAI  # OpenRouter uses the OpenAI-compatible API
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from pymongo import MongoClient

app = Flask(__name__, static_folder='build')
CORS(app, resources={
    r"/*": {"origins": "http://localhost:5173", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}
})

# Add no-cache headers to all responses
@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

# MongoDB connection
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['campus-genie']
    chat_history_collection = db['chat_history']
    users_collection = db['users']
    # Test the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise

# Create indexes for chat history
try:
    chat_history_collection.create_index([('user_id', 1), ('timestamp', -1)])
    print("Created index on chat_history collection")
except Exception as e:
    print(f"Error creating index: {e}")

# Set the OpenRouter API key securely
OPENROUTER_API_KEY = "#"

# Initialize OpenRouter client
openrouter_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# Load the embedding function (HuggingFaceEmbeddings)
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Load the FAISS vector store from the persisted directory
persist_directory = "./faiss_index"
if not os.path.exists(persist_directory):
    raise FileNotFoundError(f"The directory '{persist_directory}' does not exist. Please ensure the 'faiss_index' folder is in the same directory as this script.")

vectorstore = FAISS.load_local(
    persist_directory,
    embeddings=embedding_function,
    allow_dangerous_deserialization=True  # Only enable if you trust the source
)

print("FAISS vector store loaded successfully from './faiss_index'")

# Define the LLM function to use the Qwen model via OpenRouter
def llm(prompt):
    response = openrouter_client.chat.completions.create(
        model="qwen/qwen2.5-vl-32b-instruct:free",  # Specify the Qwen model
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=200,
        temperature=0.7,
    )
    return response.choices[0].message.content

# Function to get a response from the chatbot
def get_response(query, chat_history):
    # Perform similarity search on the vectorstore
    search_results = vectorstore.similarity_search(query, k=4)  # Retrieve top 3 most relevant chunks

    # Combine search results into a single context
    context = "\n\n".join([result.page_content for result in search_results])

    # Define the prompt template
    prompt_template = f"""
Answer the question based only on the following context:
{context}

Chat History:
{" ".join([f"{msg.content}" for msg in chat_history])}

Question: {query}
Answer: """

    # Send the prompt to the LLM via OpenRouter
    answer = llm(prompt_template.strip())

    # Update chat history
    chat_history.extend([
        HumanMessage(content=query),
        AIMessage(content=answer)
    ])

    return answer

# Global variable to store dashboard data
dashboard_data = {
    'attendance': None,
    'timetable': None,
    'last_updated': None
}

@app.route('/api/dashboard-data', methods=['GET'])
def get_dashboard_data():
    return jsonify(dashboard_data)

@app.route('/api/update-dashboard', methods=['POST'])
def update_dashboard():
    try:
        mobile_number = request.json.get('mobile_number')
        if not mobile_number:
            return jsonify({'error': 'Mobile number is required'}), 400
        data = asyncio.run(login_to_kmit_netra(mobile_number))
        dashboard_data.update(data)
        return jsonify({
            'message': 'Dashboard data updated successfully',
            'data': dashboard_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        # In a real app, you would verify the password hash here
        if user['password'] != password:  # This is just for testing
            return jsonify({'error': 'Invalid password'}), 401
        return jsonify({
            'user': {
                '_id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name', '')
            }
        })
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET', 'OPTIONS'])
def get_profile():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        user_id = request.args.get('userId')
        if not user_id or user_id == 'undefined':
            return jsonify({'error': 'Invalid user ID'}), 400
        try:
            user_id_obj = ObjectId(user_id)
        except:
            return jsonify({'error': 'Invalid user ID format'}), 400
        user = users_collection.find_one({'_id': user_id_obj})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({
            'user': {
                '_id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name', '')
            }
        })
    except Exception as e:
        print(f"Profile error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/history/<user_id>', methods=['GET'])
def get_chat_history(user_id):
    try:
        if not user_id or user_id == 'undefined':
            return jsonify({'error': 'Invalid user ID'}), 400
        try:
            user_id_obj = ObjectId(user_id)
        except:
            return jsonify({'error': 'Invalid user ID format'}), 400
        user = users_collection.find_one({'_id': user_id_obj})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        history = list(chat_history_collection.find(
            {'user_id': user_id},
            {'_id': 1, 'query': 1, 'response': 1, 'timestamp': 1}
        ).sort('timestamp', -1))
        for chat in history:
            chat['_id'] = str(chat['_id'])
            chat['timestamp'] = chat['timestamp'].isoformat() if isinstance(chat['timestamp'], datetime) else chat['timestamp']
        return jsonify(history)
    except Exception as e:
        print(f"Chat history error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/history/<user_id>', methods=['DELETE'])
def clear_chat_history(user_id):
    try:
        result = chat_history_collection.delete_many({'user_id': user_id})
        return jsonify({
            'message': 'Chat history cleared successfully',
            'deleted_count': result.deleted_count
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        query = data.get('query')
        user_id = data.get('userId')
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        if not user_id or user_id == 'undefined':
            return jsonify({'error': 'User ID is required'}), 400
        # Get in-memory chat history for the user
        chat_history = []
        history_records = list(chat_history_collection.find({'user_id': user_id}))
        for record in history_records:
            chat_history.append(HumanMessage(content=record['query']))
            chat_history.append(AIMessage(content=record['response']))
        # Get response using FAISS and LLM
        response = get_response(query, chat_history)
        # Store in MongoDB
        chat_history_collection.insert_one({
            'user_id': user_id,
            'query': query,
            'response': response,
            'timestamp': datetime.now()
        })
        return jsonify({'response': response})
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/rate', methods=['POST'])
def rate_message():
    try:
        data = request.json
        message_id = data.get('messageId')
        rating = data.get('rating')
        user_id = data.get('userId')
        if not all([message_id, rating, user_id]):
            return jsonify({'error': 'Message ID, rating, and user ID are required'}), 400
        result = chat_history_collection.update_one(
            {'_id': ObjectId(message_id), 'user_id': user_id},
            {
                '$set': {
                    'rating': rating,
                    'rated_at': datetime.now()
                }
            }
        )
        if result.modified_count == 0:
            return jsonify({'error': 'Message not found or not owned by user'}), 404
        return jsonify({'message': 'Message rated successfully'})
    except Exception as e:
        print(f"Rate error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Serve static files and handle client-side routing
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True, port=4000)