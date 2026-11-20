import json
from pathlib import Path

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie

DATA = Path(__file__).resolve().parents[1] / "database" / "data"


def records(filename, key):
    with (DATA / filename).open(encoding="utf-8") as source:
        return json.load(source)[key]


@require_POST
def login_user(request):
    try:
        payload = json.loads(request.body)
        username, password = payload["userName"], payload["password"]
    except (ValueError, KeyError, TypeError):
        return JsonResponse({"error": "Username and password required"}, status=400)
    if not isinstance(username, str) or not isinstance(password, str):
        return JsonResponse({"error": "Invalid credentials"}, status=400)
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)
    login(request, user)
    return JsonResponse({"userName": user.get_username(), "status": "Authenticated"})


@require_http_methods(["GET", "POST"])
def logout_user(request):
    """Support the GET demonstration required by the IBM capstone rubric."""
    logout(request)
    return JsonResponse({"userName": "", "status": "Logged out"})


@ensure_csrf_cookie
def get_dealerships(request, state=None):
    dealers = records("dealerships.json", "dealerships")
    if state:
        state = state.casefold()
        dealers = [d for d in dealers if state in (d["state"].casefold(), d["st"].casefold())]
    return JsonResponse({"status": 200, "dealers": dealers})


def get_dealer_details(request, dealer_id):
    for dealer in records("dealerships.json", "dealerships"):
        if dealer["id"] == dealer_id:
            return JsonResponse({"status": 200, "dealer": dealer})
    return JsonResponse({"status": 404, "error": "Dealer not found"}, status=404)


def get_dealer_reviews(request, dealer_id):
    from .models import Review
    saved = []
    for r in Review.objects.filter(dealership=dealer_id).select_related("user", "car_model__car_make"):
        saved.append({"id": r.id, "name": r.user.get_full_name() or r.user.username,
            "dealership": r.dealership, "review": r.review, "purchase": r.purchase,
            "purchase_date": str(r.purchase_date or ""), "car_make": r.car_model.car_make.name,
            "car_model": r.car_model.name, "car_year": r.car_model.year})
    reviews = saved + records("reviews.json", "reviews")
    # Populate the sentiment property expected by the React Dealer component.
    # This drives the visible positive/neutral/negative icon beside each review.
    from nltk.sentiment import SentimentIntensityAnalyzer
    import nltk
    nltk.data.path.insert(0, str(Path(__file__).parent / "microservices"))
    analyzer = SentimentIntensityAnalyzer()
    dealer_reviews = []
    for item in reviews:
        if item["dealership"] != dealer_id:
            continue
        item = dict(item)
        compound = analyzer.polarity_scores(item.get("review", ""))["compound"]
        item["sentiment"] = "positive" if compound >= 0.05 else ("negative" if compound <= -0.05 else "neutral")
        dealer_reviews.append(item)
    return JsonResponse({"status": 200, "reviews": dealer_reviews})


@require_POST
def registration(request):
    from django.contrib.auth.models import User
    from django.contrib.auth.password_validation import validate_password
    from django.core.exceptions import ValidationError
    from django.core.validators import validate_email
    from django.db import IntegrityError
    try:
        data = json.loads(request.body)
        fields = {key: data[key].strip() for key in ["userName", "firstName", "lastName", "email"]}
        password = data["password"]
        if not all(fields.values()):
            raise ValueError()
        if not isinstance(password, str) or len(password) > 128:
            raise ValueError()
        validate_email(fields["email"])
        candidate = User(username=fields["userName"], email=fields["email"],
                         first_name=fields["firstName"], last_name=fields["lastName"])
        candidate.full_clean(exclude=["password"], validate_unique=False)
        validate_password(password, candidate)
        user = User.objects.create_user(
            username=fields["userName"], password=password, email=fields["email"],
            first_name=fields["firstName"], last_name=fields["lastName"])
    except IntegrityError:
        return JsonResponse({"error": "Username already exists"}, status=409)
    except (ValueError, KeyError, TypeError, AttributeError, ValidationError):
        return JsonResponse({"error": "Complete every field and use a strong password"}, status=400)
    login(request, user)
    return JsonResponse({"status": "Authenticated", "userName": user.username}, status=201)


def get_cars(request):
    from .models import CarMake, CarModel
    return JsonResponse({
        "carMakes": list(CarMake.objects.values("id", "name", "description")),
        "carModels": list(CarModel.objects.values("id", "name", "year", "car_type", "car_make__name"))
    })


def analyze_review(request, text):
    from nltk.sentiment import SentimentIntensityAnalyzer
    import nltk
    nltk.data.path.insert(0, str(Path(__file__).parent / "microservices"))
    score = SentimentIntensityAnalyzer().polarity_scores(text)["compound"]
    sentiment = "neutral"
    if score >= 0.05:
        sentiment = "positive"
    elif score <= -0.05:
        sentiment = "negative"
    return JsonResponse({"sentiment": sentiment, "compound": score})


@require_POST
def add_review(request):
    from .models import CarModel, Review
    from datetime import date
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Sign in to post a review"}, status=401)
    try:
        data = json.loads(request.body)
        dealer_id = int(data["dealership"])
        if not any(d["id"] == dealer_id for d in records("dealerships.json", "dealerships")):
            raise ValueError()
        text = data["review"].strip()
        if not text or len(text) > 4000 or type(data["purchase"]) is not bool:
            raise ValueError()
        model = CarModel.objects.get(pk=data["car_model"])
        purchased = data["purchase"]
        purchased_on = date.fromisoformat(data["purchase_date"]) if purchased else None
        if purchased_on and purchased_on > date.today():
            raise ValueError()
        review = Review.objects.create(
            user=request.user, dealership=dealer_id, review=text, purchase=purchased,
            purchase_date=purchased_on, car_model=model)
    except (ValueError, KeyError, TypeError, AttributeError, CarModel.DoesNotExist):
        return JsonResponse({"error": "Enter valid dealer, review, car and purchase details"}, status=400)
    return JsonResponse({"status": 201, "id": review.id}, status=201)
