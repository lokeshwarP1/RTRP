from flask import jsonify

@app.route('/api/chat/history/<user_id>', methods=['GET'])
def get_chat_history(user_id):
    try:
        history = chat_history_collection.find(
            {'user_id': user_id},
            {'_id': 1, 'query': 1, 'response': 1, 'timestamp': 1}
        ).sort('timestamp', -1)
        
        return jsonify({
            'history': [{
                '_id': str(chat['_id']),
                'query': chat['query'],
                'response': chat['response'],
                'timestamp': chat['timestamp']
            } for chat in history]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/history/<user_id>', methods=['DELETE'])
def clear_chat_history(user_id):
    try:
        result = chat_history_collection.delete_many({'user_id': user_id})
        return jsonify({'deletedCount': result.deleted_count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 