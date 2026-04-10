import requests
import os

USDA_API_KEY = os.getenv('USDA_API_KEY')

def search_food(food_name):
    try:
        url = 'https://api.nal.usda.gov/fdc/v1/foods/search'
        params = {
            'query': food_name.strip(),
            'api_key': USDA_API_KEY,
            'pageSize': 6,
            'dataType': 'SR Legacy,Foundation,Survey (FNDDS)'
        }

        print(f'Searching USDA for: {food_name}')
        print(f'Using API key: {USDA_API_KEY[:5]}...')

        response = requests.get(url, params=params, timeout=15, verify=True)
        print(f'Response status: {response.status_code}')
        print(f'Response text preview: {response.text[:200]}')

        data = response.json()

        if not data.get('foods'):
            return []

        results = []
        for food in data['foods']:
            name = food.get('description', '')
            if not name:
                continue

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

            nutrition = {v: 0 for v in nutrient_map.values()}

            for n in nutrients:
                nid = n.get('nutrientId')
                try:
                    nid = int(nid)
                except:
                    pass
                if nid in nutrient_map:
                    nutrition[nutrient_map[nid]] = round(n.get('value', 0), 2)

            results.append({
                'name': name.title(),
                **nutrition
            })

        return results

    except Exception as e:
        print(f'Search error: {e}')
        return []