import os
from dotenv import load_dotenv

# Load env variables before other internal imports
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from food_detector import search_food, scan_image
from recommender import get_recommendations

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({'message': 'NutriTrack ML service running!'})

@app.route('/scan-meal', methods=['POST'])
def scan_meal():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        results = scan_image(file)
        return jsonify({'results': results})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)}), 500


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