import json
from pathlib import Path

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST
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


@require_POST
def logout_user(request):
    logout(request)
    return JsonResponse({"status": "Logged out"})


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
    reviews = records("reviews.json", "reviews")
    return JsonResponse({"status": 200, "reviews": [r for r in reviews if r["dealership"] == dealer_id]})
