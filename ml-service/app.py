from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

from food_detector import search_food
from recommender import get_recommendations

@app.route('/')
def home():
    return jsonify({'message': 'NutriTrack ML service running!'})

@app.route('/search-food', methods=['GET'])
def search():
    try:
        query = request.args.get('query', '')
        if not query:
            return jsonify({'results': []})

        results = search_food(query)
        return jsonify({'results': results})

    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        deficiencies = data.get('deficiencies', [])
        diet_type = data.get('diet_type', 'vegetarian')
        recent_foods = data.get('recent_foods', [])
        daily_nutrients = data.get('daily_nutrients', {})

        suggestions = get_recommendations(
            deficiencies, diet_type, recent_foods, daily_nutrients
        )

        return jsonify({'suggestions': suggestions})

    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
