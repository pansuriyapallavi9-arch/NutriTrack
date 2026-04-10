import requests
import os

USDA_API_KEY = os.getenv('USDA_API_KEY')

def get_nutrition(food_items):
    total = {
        'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0,
        'fiber': 0, 'iron': 0, 'calcium': 0, 'vitaminD': 0,
        'vitaminB12': 0, 'omega3': 0, 'zinc': 0
    }

    foods_data = []

    for food in food_items:
        try:
            nutrition = fetch_usda_nutrition(food)
            if nutrition:
                foods_data.append({
                    'food': food,
                    'nutrition': nutrition
                })
                for key in total:
                    total[key] += nutrition.get(key, 0)
        except Exception as e:
            print(f'Error getting nutrition for {food}:', e)

    for key in total:
        total[key] = round(total[key], 2)

    return {
        'totals': total,
        'per_food': foods_data
    }

def fetch_usda_nutrition(food_name):
    try:
        search_url = 'https://api.nal.usda.gov/fdc/v1/foods/search'
        params = {
            'query': food_name,
            'api_key': USDA_API_KEY,
            'pageSize': 1,
            'dataType': 'SR Legacy,Foundation'
        }

        response = requests.get(search_url, params=params)
        data = response.json()

        if not data.get('foods'):
            return None

        food = data['foods'][0]
        nutrients = food.get('foodNutrients', [])

        nutrient_map = {
            1008: 'calories',
            1003: 'protein',
            1005: 'carbs',
            1004: 'fat',
            1079: 'fiber',
            1089: 'iron',
            1087: 'calcium',
            1114: 'vitaminD',
            1178: 'vitaminB12',
            1404: 'omega3',
            1095: 'zinc'
        }

        result = {key: 0 for key in nutrient_map.values()}

        for nutrient in nutrients:
            nutrient_id = nutrient.get('nutrientId')
            if nutrient_id in nutrient_map:
                key = nutrient_map[nutrient_id]
                value = nutrient.get('value', 0)
                result[key] = round(value, 2)

        return result

    except Exception as e:
        print(f'USDA fetch error for {food_name}:', e)
        return None
