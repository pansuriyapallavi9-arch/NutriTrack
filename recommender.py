# Deficiency to food mapping based on diet type
DEFICIENCY_MAP = {
    'iron': {
        'vegetarian': [
            {'food': 'Spinach', 'recipe': 'Palak Dal', 'tip': 'Add lemon juice to boost iron absorption by 3x', 'reason': 'Spinach is rich in non-heme iron'},
            {'food': 'Lentils', 'recipe': 'Dal Tadka', 'tip': 'Pair with vitamin C foods like tomatoes', 'reason': 'Lentils provide plant-based iron'},
            {'food': 'Tofu', 'recipe': 'Tofu Stir Fry', 'tip': 'Cook in a cast iron pan to increase iron content', 'reason': 'Tofu is an excellent iron source'},
            {'food': 'Pumpkin seeds', 'recipe': 'Add to salads or smoothies', 'tip': 'Eat as a snack daily', 'reason': 'High in iron and zinc'},
        ],
        'eggetarian': [
            {'food': 'Eggs', 'recipe': 'Boiled eggs with spinach', 'tip': 'Eat with vitamin C foods', 'reason': 'Eggs contain heme iron'},
            {'food': 'Spinach', 'recipe': 'Egg Palak curry', 'tip': 'Add lemon juice', 'reason': 'Rich in iron'},
            {'food': 'Lentils', 'recipe': 'Dal with eggs', 'tip': 'Combine with vitamin C', 'reason': 'Plant iron source'},
        ],
        'non-vegetarian': [
            {'food': 'Chicken liver', 'recipe': 'Liver curry', 'tip': 'Best heme iron source available', 'reason': 'Extremely high in iron'},
            {'food': 'Beef', 'recipe': 'Beef stew', 'tip': 'Pair with vegetables', 'reason': 'Rich in heme iron'},
            {'food': 'Spinach', 'recipe': 'Chicken Palak', 'tip': 'Add lemon juice', 'reason': 'Additional iron boost'},
        ]
    },
    'omega3': {
        'vegetarian': [
            {'food': 'Flaxseeds', 'recipe': 'Add to smoothies or yogurt', 'tip': 'Grind before eating for better absorption', 'reason': 'Best plant source of omega-3'},
            {'food': 'Walnuts', 'recipe': 'Walnut banana smoothie', 'tip': 'Eat a handful daily', 'reason': 'High in ALA omega-3'},
            {'food': 'Chia seeds', 'recipe': 'Chia pudding with milk', 'tip': 'Soak overnight for best results', 'reason': 'Excellent omega-3 source'},
        ],
        'eggetarian': [
            {'food': 'Flaxseeds', 'recipe': 'Flaxseed smoothie', 'tip': 'Grind before eating', 'reason': 'Plant omega-3'},
            {'food': 'Eggs', 'recipe': 'Omega-3 enriched eggs', 'tip': 'Look for omega-3 enriched eggs', 'reason': 'Contains DHA'},
            {'food': 'Walnuts', 'recipe': 'Walnut oatmeal', 'tip': 'Daily handful', 'reason': 'ALA omega-3'},
        ],
        'non-vegetarian': [
            {'food': 'Salmon', 'recipe': 'Grilled salmon', 'tip': 'Eat 2-3 times per week', 'reason': 'Highest omega-3 fish'},
            {'food': 'Mackerel', 'recipe': 'Mackerel curry', 'tip': 'Affordable and very high in omega-3', 'reason': 'Excellent omega-3 source'},
            {'food': 'Sardines', 'recipe': 'Sardine toast', 'tip': 'Canned sardines are just as nutritious', 'reason': 'Rich in omega-3 and calcium'},
        ]
    },
    'vitaminD': {
        'vegetarian': [
            {'food': 'Mushrooms', 'recipe': 'Mushroom soup', 'tip': 'Expose mushrooms to sunlight for 30 mins before cooking', 'reason': 'Only plant source of vitamin D'},
            {'food': 'Fortified milk', 'recipe': 'Glass of milk daily', 'tip': 'Drink in the morning with sunlight exposure', 'reason': 'Fortified with vitamin D'},
            {'food': 'Fortified cereals', 'recipe': 'Breakfast cereal with milk', 'tip': 'Check label for vitamin D content', 'reason': 'Good vitamin D source'},
        ],
        'eggetarian': [
            {'food': 'Egg yolk', 'recipe': 'Sunny side up eggs', 'tip': 'Do not skip the yolk', 'reason': 'Egg yolk contains vitamin D'},
            {'food': 'Mushrooms', 'recipe': 'Mushroom omelette', 'tip': 'Sun-exposed mushrooms are best', 'reason': 'Plant vitamin D source'},
        ],
        'non-vegetarian': [
            {'food': 'Salmon', 'recipe': 'Baked salmon', 'tip': 'Best food source of vitamin D', 'reason': 'Very high in vitamin D'},
            {'food': 'Tuna', 'recipe': 'Tuna salad', 'tip': 'Canned tuna is convenient', 'reason': 'Good vitamin D source'},
            {'food': 'Egg yolk', 'recipe': 'Eggs any style', 'tip': 'Keep the yolk intact', 'reason': 'Contains vitamin D'},
        ]
    },
    'vitaminB12': {
        'vegetarian': [
            {'food': 'Fortified plant milk', 'recipe': 'Daily glass of fortified oat/soy milk', 'tip': 'Check label for B12', 'reason': 'Best vegetarian B12 source'},
            {'food': 'Nutritional yeast', 'recipe': 'Sprinkle on pasta or popcorn', 'tip': 'Use fortified nutritional yeast', 'reason': 'Excellent B12 source for vegetarians'},
            {'food': 'Fortified cereals', 'recipe': 'Breakfast with fortified cereal', 'tip': 'Check for B12 on the label', 'reason': 'Good B12 source'},
        ],
        'eggetarian': [
            {'food': 'Eggs', 'recipe': 'Daily eggs any style', 'tip': 'Eat whole egg including yolk', 'reason': 'Good B12 source'},
            {'food': 'Fortified milk', 'recipe': 'Glass of milk', 'tip': 'Choose fortified varieties', 'reason': 'Contains B12'},
        ],
        'non-vegetarian': [
            {'food': 'Beef liver', 'recipe': 'Liver with onions', 'tip': 'Even a small serving covers your daily B12 need', 'reason': 'Highest B12 food source'},
            {'food': 'Chicken', 'recipe': 'Grilled chicken', 'tip': 'Regular chicken consumption helps B12', 'reason': 'Good B12 source'},
            {'food': 'Tuna', 'recipe': 'Tuna curry', 'tip': 'Eat 2-3 times per week', 'reason': 'Excellent B12 source'},
        ]
    },
    'calcium': {
        'vegetarian': [
            {'food': 'Milk', 'recipe': 'Glass of warm milk', 'tip': 'Drink with vitamin D for better absorption', 'reason': 'Best calcium source'},
            {'food': 'Paneer', 'recipe': 'Paneer bhurji or tikka', 'tip': 'Homemade paneer retains more calcium', 'reason': 'High in calcium'},
            {'food': 'Sesame seeds', 'recipe': 'Add til to rotis or salads', 'tip': 'Just 1 tbsp has 88mg calcium', 'reason': 'Surprisingly high in calcium'},
        ],
        'eggetarian': [
            {'food': 'Milk', 'recipe': 'Daily milk', 'tip': 'Pair with vitamin D', 'reason': 'Best calcium source'},
            {'food': 'Paneer', 'recipe': 'Paneer dishes', 'tip': 'Homemade is best', 'reason': 'High calcium'},
            {'food': 'Eggs', 'recipe': 'Eggs daily', 'tip': 'Eat whole egg', 'reason': 'Contains some calcium'},
        ],
        'non-vegetarian': [
            {'food': 'Sardines', 'recipe': 'Sardines on toast', 'tip': 'Eat the soft bones for maximum calcium', 'reason': 'Bones are rich in calcium'},
            {'food': 'Milk', 'recipe': 'Daily milk', 'tip': 'Pair with vitamin D', 'reason': 'Best calcium source'},
            {'food': 'Salmon', 'recipe': 'Canned salmon with bones', 'tip': 'Eat the soft bones', 'reason': 'Good calcium source'},
        ]
    },
    'zinc': {
        'vegetarian': [
            {'food': 'Pumpkin seeds', 'recipe': 'Roasted pumpkin seeds as snack', 'tip': 'Soak seeds before eating to improve zinc absorption', 'reason': 'Excellent zinc source'},
            {'food': 'Chickpeas', 'recipe': 'Chana masala or hummus', 'tip': 'Soak and sprout for better zinc absorption', 'reason': 'Good plant zinc source'},
            {'food': 'Cashews', 'recipe': 'Handful of cashews daily', 'tip': 'Unsalted is best', 'reason': 'Good zinc source'},
        ],
        'eggetarian': [
            {'food': 'Pumpkin seeds', 'recipe': 'Seed mix snack', 'tip': 'Soak before eating', 'reason': 'High in zinc'},
            {'food': 'Eggs', 'recipe': 'Daily eggs', 'tip': 'Whole egg is best', 'reason': 'Contains zinc'},
            {'food': 'Chickpeas', 'recipe': 'Chana masala', 'tip': 'Sprout for better absorption', 'reason': 'Plant zinc'},
        ],
        'non-vegetarian': [
            {'food': 'Beef', 'recipe': 'Beef curry', 'tip': 'Best zinc source available', 'reason': 'Highest zinc food'},
            {'food': 'Chicken', 'recipe': 'Grilled chicken', 'tip': 'Dark meat has more zinc', 'reason': 'Good zinc source'},
            {'food': 'Pumpkin seeds', 'recipe': 'Seed snack mix', 'tip': 'Add to diet as snack', 'reason': 'Plant zinc boost'},
        ]
    },
    'fiber': {
        'vegetarian': [
            {'food': 'Oats', 'recipe': 'Oatmeal with fruits', 'tip': 'Add chia seeds for extra fiber', 'reason': 'Excellent fiber source'},
            {'food': 'Rajma', 'recipe': 'Rajma chawal', 'tip': 'Kidney beans are fiber powerhouses', 'reason': 'Very high in fiber'},
            {'food': 'Broccoli', 'recipe': 'Stir fried broccoli', 'tip': 'Steam to preserve fiber content', 'reason': 'High fiber vegetable'},
        ],
        'eggetarian': [
            {'food': 'Oats', 'recipe': 'Oat porridge', 'tip': 'Add fruits for extra fiber', 'reason': 'High fiber'},
            {'food': 'Rajma', 'recipe': 'Bean curry', 'tip': 'Fiber powerhouse', 'reason': 'Very high fiber'},
            {'food': 'Broccoli', 'recipe': 'Egg and broccoli stir fry', 'tip': 'Steam broccoli', 'reason': 'High fiber veg'},
        ],
        'non-vegetarian': [
            {'food': 'Oats', 'recipe': 'Oatmeal', 'tip': 'Add to daily breakfast', 'reason': 'High fiber'},
            {'food': 'Broccoli', 'recipe': 'Chicken and broccoli', 'tip': 'Great fiber-protein combo', 'reason': 'High fiber veg'},
            {'food': 'Rajma', 'recipe': 'Bean and meat curry', 'tip': 'Adds fiber to meat dishes', 'reason': 'Plant fiber boost'},
        ]
    },
    'protein': {
        'vegetarian': [
            {'food': 'Paneer', 'recipe': 'Paneer tikka or bhurji', 'tip': '100g paneer has 18g protein', 'reason': 'Complete protein source'},
            {'food': 'Lentils', 'recipe': 'Dal makhani or tadka', 'tip': 'Combine different dals for complete protein', 'reason': 'Excellent plant protein'},
            {'food': 'Greek yogurt', 'recipe': 'Yogurt with nuts and fruits', 'tip': 'Higher protein than regular yogurt', 'reason': 'High protein dairy'},
            {'food': 'Quinoa', 'recipe': 'Quinoa pulao', 'tip': 'Only complete plant protein', 'reason': 'Contains all essential amino acids'},
        ],
        'eggetarian': [
            {'food': 'Eggs', 'recipe': 'Boiled or scrambled eggs', 'tip': '3 eggs = 18g protein', 'reason': 'Complete protein'},
            {'food': 'Paneer', 'recipe': 'Paneer dishes', 'tip': 'Great protein source', 'reason': 'High protein dairy'},
            {'food': 'Greek yogurt', 'recipe': 'Daily yogurt', 'tip': 'Add nuts for more protein', 'reason': 'High protein'},
        ],
        'non-vegetarian': [
            {'food': 'Chicken breast', 'recipe': 'Grilled chicken breast', 'tip': '100g has 31g protein', 'reason': 'Highest protein meat'},
            {'food': 'Eggs', 'recipe': 'Egg white omelette', 'tip': 'Egg whites are pure protein', 'reason': 'Complete protein'},
            {'food': 'Tuna', 'recipe': 'Tuna salad', 'tip': 'Canned tuna is cheap and high protein', 'reason': 'Excellent lean protein'},
        ]
    }
}

RDA = {
    'iron': 18, 'omega3': 1.6, 'vitaminD': 20,
    'vitaminB12': 2.4, 'calcium': 1000, 'zinc': 11,
    'fiber': 30, 'protein': 50
}

def get_recommendations(deficiencies, diet_type, recent_foods, daily_nutrients):
    suggestions = []
    recent_lower = [f.lower() for f in recent_foods]

    for deficiency in deficiencies:
        if deficiency not in DEFICIENCY_MAP:
            continue

        diet_foods = DEFICIENCY_MAP[deficiency].get(
            diet_type,
            DEFICIENCY_MAP[deficiency].get('vegetarian', [])
        )

        current = daily_nutrients.get(deficiency, 0)
        rda = RDA.get(deficiency, 1)
        percentage = (current / rda) * 100 if rda > 0 else 0

        if percentage >= 80:
            urgency = 'low'
        elif percentage >= 50:
            urgency = 'medium'
        else:
            urgency = 'high'

        count = 0
        for item in diet_foods:
            if count >= 2:
                break
            food_name = item['food'].lower()
            if any(food_name in recent for recent in recent_lower):
                continue

            suggestions.append({
                'deficiency': deficiency,
                'food': item['food'],
                'recipe': item['recipe'],
                'tip': item['tip'],
                'reason': item['reason'],
                'urgency': urgency,
                'percentage_met': round(percentage, 1)
            })
            count += 1

    urgency_order = {'high': 0, 'medium': 1, 'low': 2}
    suggestions.sort(key=lambda x: urgency_order[x['urgency']])

    return suggestions[:6]
