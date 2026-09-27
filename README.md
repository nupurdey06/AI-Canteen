# 🍽️ AI College Canteen Recommendation System

An intelligent, conversational food recommendation system designed specifically for college canteens. It helps students decide **what to eat based on budget, dietary preferences, mood, cravings, nutrition, and available preparation time**.

Instead of showing students a static menu, the system understands natural-language requests and generates personalized meal combinations using real-time menu availability, constraints, and intelligent substitutions.

---

## 📌 Problem Statement

Students frequently struggle to decide what to eat based on:

* 💰 Budget
* ⏱️ Available time
* 🥗 Dietary preferences
* 😋 Cravings and mood
* 📋 Available menu items
* 📦 Item availability during busy breaks

Traditional canteen menus provide static lists and do not personalize recommendations according to the student's current requirements.

---

## 💡 Solution

The **AI College Canteen Recommendation System** acts as a conversational food assistant.

Students can simply enter requests such as:

> "Suggest a healthy meal under ₹80 that can be prepared in 10 minutes."

The system understands the request, extracts the constraints, searches the available menu, generates suitable combinations, and explains why the recommendation fits.

The system can also suggest alternatives when an item is unavailable or exceeds the user's budget.

---

## ✨ Key Features

### 🗣️ Natural Language Food Search

Students can describe what they want naturally instead of manually applying multiple filters.

Example:

```text
"I want something spicy and filling under ₹100."
```

The system converts this into structured constraints.

---

### 💰 Budget-Aware Recommendations

The recommendation engine respects the student's maximum budget.

Example:

```text
Budget: ₹80

Recommended Combo:
- Veg Sandwich
- Fresh Juice

Total: ₹75
```

The deterministic constraint solver helps prevent budget overshooting.

---

### ⏱️ Preparation-Time Filtering

Students can specify how quickly they need their food.

Example:

```text
"I need something I can get within 10 minutes."
```

The system considers available preparation-time information when generating recommendations.

---

### 🥗 Dietary Restrictions

The system supports dietary filtering such as:

* Jain
* Vegan
* Gluten-Free
* Other dietary tags supported by the menu

Dietary restrictions can act as hard filters during recommendation generation.

---

### 😋 Mood & Craving Understanding

The system can interpret semantic cravings and moods rather than requiring exact menu-item names.

For example:

```text
"Something warm and comforting."
```

can be matched against semantically similar menu items.

---

### 🔄 Smart Substitutions

If a recommended item becomes unavailable, the system can provide a suitable substitute instead of forcing the student to restart the search.

The substitution engine evaluates similarity such as flavor profiles and other relevant food attributes.

---

### 💬 Conversational Interaction

The system supports multi-turn conversations.

Example:

```text
Student:
"I want a meal under ₹100."

Assistant:
"Here are some options..."

Student:
"Make it vegetarian."

Assistant:
"Sure. Here are vegetarian options under ₹100..."
```

The session state maintains context between interactions.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     Student Input   │
                    │  Voice / Text Query │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Intent & Constraint │
                    │       Engine        │
                    │   LLM + Rule Based  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Menu Vector DB  │
                    │ Menu • Ingredients  │
                    │ Price • Time • Stock│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Recommendation &    │
                    │ Reasoning Engine     │
                    │                     │
                    │ Combo Generator     │
                    │ Constraint Solver   │
                    │ Substitution Engine │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Smart UI Output  │
                    │ Recommendations +   │
                    │ Explanation + Order │
                    └─────────────────────┘
```

---

## 🔄 Runtime Flow

### 1. User Input

The student provides:

* Budget
* Mood
* Dietary requirements
* Cravings
* Maximum preparation time
* Other preferences

Example:

```text
"Give me a healthy meal under ₹80 in 10 minutes."
```

### 2. Intent & Constraint Extraction

The conversational layer converts the natural-language request into structured parameters.

Example:

```json
{
  "budget": 80,
  "max_prep_time": 10,
  "dietary_preference": "healthy",
  "intent": "meal_recommendation"
}
```

### 3. Menu Retrieval

The system retrieves relevant items from the dynamic canteen menu and vector database.

Menu information may include:

```text
Item
Price
Ingredients
Calories
Dietary Tags
Preparation Time
Availability
Flavor Profile
```

### 4. Constraint Evaluation

Candidate meals are evaluated against hard constraints such as:

```text
Price <= User Budget
Preparation Time <= User Time Limit
Dietary Restrictions = Satisfied
Availability = In Stock
```

### 5. Meal Combination Generation

The recommendation engine creates suitable meal combinations while considering multiple objectives such as:

* Price
* Preparation time
* Nutrition
* User preference

### 6. Alternative Generation

If an item is unavailable or violates a constraint, the substitution engine searches for an appropriate alternative.

### 7. Final Recommendation

The system presents:

* Recommended meal
* Total price
* Estimated preparation time
* Relevant dietary information
* Explanation
* Substitute options
* Quick ordering option

---

## 🧠 AI & Intelligence Components

### 1. Large Language Model

Used for:

* Natural-language understanding
* Intent detection
* Constraint extraction
* Conversational interaction
* Recommendation explanations

---

### 2. Vector Search & RAG

The vector search layer enables semantic matching between user cravings and food items.

For example:

```text
User:
"Something warm and comforting"

        ↓

Semantic Search

        ↓

Hot Tomato Soup
+ Garlic Bread
```

The vector database also helps keep recommendations grounded in actual menu inventory rather than relying solely on generated responses.

---

### 3. Constraint Satisfaction

A deterministic constraint-solving layer evaluates strict requirements such as:

```text
Budget ≤ ₹X
Preparation Time ≤ Y minutes
Dietary Restrictions = Valid
Availability = True
```

This provides mathematical accuracy for hard limits.

---

### 4. Substitution Engine

When an item becomes unavailable, the system evaluates similar food items and generates alternative recommendations.

```text
Unavailable Item
       ↓
Similarity Matching
       ↓
Available Alternatives
       ↓
Updated Meal Recommendation
```

---

## 🗄️ Data Layer

The system uses a dynamic canteen menu structure containing information such as:

```text
Food Item
├── Name
├── Price
├── Ingredients
├── Calories
├── Dietary Tags
├── Preparation Time
├── Availability
└── Flavor Profile
```

The project architecture supports both synthetic and real menu schemas.

---

## 🎯 Example Queries

Users can interact with the system using natural language.

### Budget

```text
"Give me something under ₹50."
```

### Time

```text
"I only have 5 minutes."
```

### Dietary

```text
"I want a vegan meal."
```

### Combined Constraints

```text
"Suggest a healthy vegetarian meal under ₹100 that takes less than 15 minutes."
```

### Craving

```text
"I want something warm and comforting."
```

### Substitution

```text
"The sandwich is sold out. What else can I get?"
```

---

## 🚀 Future Scope

The architecture can be extended to support:

### 🏪 Live POS & Kitchen Display Integration

Integration with canteen Point-of-Sale systems can enable:

* Automatic stock updates
* Real-time availability
* Kitchen queue information
* More accurate preparation-time estimates

---

### 📦 Smart Token & Locker Pickup

The system could integrate with automated food pickup lockers to provide students with exact pickup slots and reduce queues.

---

### ❤️ Optional Health & Fitness Integration

Future versions could optionally integrate with health and fitness platforms to consider daily calorie expenditure and workout goals when recommending meals.

---

### 🏫 Multi-Canteen Campus Support

The system can scale beyond a single canteen to support:

* Multiple campus canteens
* Food trucks
* Campus kiosks
* Unified ordering

---

### 📷 Multimodal Mood-to-Food Recommendations

Future versions could allow students to provide visual inputs and use computer vision to generate mood-based food recommendations.

---

### 👥 Group Ordering

A group could provide multiple preferences and the system could generate a shared meal combination with automated bill splitting.

---

### ♻️ Food Waste & Dynamic Pricing Analytics

A vendor dashboard could predict ingredient demand and support dynamic discounts for items approaching their shelf-life.

---

## 📊 Expected Impact

The project is designed around measurable campus-canteen improvements:

| Area               | Expected Benefit                                       |
| ------------------ | ------------------------------------------------------ |
| ⏱️ Waiting Time    | Reduced through preparation-time-aware recommendations |
| 💰 Budget          | Prevents recommendations from exceeding defined limits |
| 🥗 Personalization | Dietary and preference-based filtering                 |
| 📦 Availability    | Real-time item availability and substitutions          |
| 😊 User Experience | Conversational and personalized interaction            |
| 🏫 Scalability     | Designed for multi-canteen campus deployment           |

The presentation identifies a target of **30% reduced wait times** through pre-ordering and preparation-time estimation, along with zero budget overshoot through deterministic meal-combination solving.

---

## 🛠️ Technology Approach

The project combines:

* **Large Language Models (LLMs)**
* **Natural Language Understanding**
* **Vector Search**
* **Retrieval-Augmented Generation (RAG)**
* **Constraint Satisfaction / Optimization**
* **Dynamic Menu Database**
* **Substitution Recommendation**
* **Conversational UI**

The presentation specifically identifies LLMs, Vector Search & RAG, a Constraint Satisfaction Heuristic Solver, and a Dynamic Substitute Recommendation Matrix as the core AI technologies.

---

## 🔐 Design Principles

The system is designed around several important principles:

### Grounded Recommendations

Recommendations should come from available menu information rather than unsupported food suggestions.

### Hard Constraint Enforcement

Budget, preparation time, dietary restrictions, and availability should be treated as constraints rather than optional suggestions.

### Conversational UX

Students should be able to communicate naturally instead of navigating complicated filters.

### Dynamic Availability

The recommendation system should respond to changing inventory conditions.

---

## 📁 Suggested Project Structure

```text
ai-college-canteen/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
│
├── backend/
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── recommendation/
│   ├── llm/
│   └── database/
│
├── data/
│   ├── menu.json
│   └── ingredients.json
│
├── vector_db/
│
├── tests/
│
├── .env.example
├── requirements.txt
├── package.json
└── README.md
```

> The structure above is a suggested organization for implementation; the presentation does not specify an exact repository folder structure.

---

## ⚙️ Configuration

Create a `.env` file containing the credentials/configuration required by the selected LLM, database, vector store, and other integrations.

Example:

```env
LLM_API_KEY=your_api_key
DATABASE_URL=your_database_url
VECTOR_DB_URL=your_vector_database_url
```

Never commit real API keys or credentials to GitHub.

---

## ▶️ Running the Project

### Clone the Repository

```bash
git clone <repository-url>
cd ai-college-canteen
```

### Install Dependencies

```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Add the required API keys and database configuration.

### Start the Backend

```bash
python main.py
```

### Start the Frontend

```bash
npm run dev
```

> Replace these commands with your project's actual start commands if your implementation uses a different framework or entry point.

---

## 🧪 Example End-to-End Scenario

**Student:**

```text
I want something healthy under ₹80 and I only have 10 minutes.
```

**System:**

```text
Understanding your request...

Budget: ₹80
Maximum preparation time: 10 min
Preference: Healthy

Searching today's available menu...
```

**Recommendation:**

```text
🥗 Recommended Meal

Veg Sandwich + Fresh Juice

💰 Total: ₹75
⏱️ Preparation: 8 minutes

Why this works:
✓ Within your ₹80 budget
✓ Ready within 10 minutes
✓ Matches your healthy preference
```

If an item becomes unavailable:

```text
⚠️ Fresh Juice is currently unavailable.

Alternative:
🥤 Lemon Water

Updated Total: ₹65
```

---

## 🌟 Why This Project Matters

College students often make food decisions quickly during short breaks. A conversational recommendation system can combine **personal preferences, budget, nutrition, preparation time, and real-time availability** into one interaction instead of forcing students to manually search through a static menu.

The project's architecture is also designed to extend from student recommendations into operational capabilities such as POS synchronization, smart pickup, multi-canteen aggregation, group ordering, and waste analytics.

---

## 🔮 Vision

> **Make campus food decisions as simple as having a conversation.**

The long-term vision is a smart campus food platform where students can discover, personalize, order, and collect meals through a single intelligent conversational interface.

---

## 👥 Team

**AI College Canteen Recommendation System**


---

## 📄 Project Presentation

The project concept, architecture, AI components, future integrations, and innovation roadmap are documented in the accompanying hackathon presentation.

---

## 📜 License

Add your preferred license here, for example:

```text
MIT License
```

---

## ⭐ Acknowledgement

Built as a hackathon project focused on applying conversational AI, semantic search, constraint-based recommendation, and real-time canteen intelligence to improve the college food experience.
