#!/usr/bin/env bash
# Complete IBM Skills Network Product Price Comparison final project in the Cloud IDE.
# This script performs REAL deployments and saves REAL CLI logs.
set -Eeuo pipefail
REPO="https://github.com/lloor7021-afk/github-final-project.git"
ROOT="/home/project/github-final-project"
echo "==> Checking IBM Code Engine session"
ibmcloud ce project current
command -v git >/dev/null || { echo "Missing git"; exit 1; }
if [ -d "$ROOT/.git" ]; then
  echo "==> Updating existing project repository"
  git -C "$ROOT" pull --ff-only
else
  echo "==> Cloning project into $ROOT"
  git clone "$REPO" "$ROOT"
fi
BASE="$ROOT/microservices-price-comparison"
cd "$BASE"
mkdir -p evidence
echo
echo "=== Q3: Actual clone of the IBM frontend ==="
if [ ! -d /home/project/dealer_evaluation_frontend/.git ]; then
  git clone https://github.com/ibm-developer-skills-network/dealer_evaluation_frontend.git /home/project/dealer_evaluation_frontend 2>&1 | tee evidence/git_clone.txt
else
  echo "Frontend repository already present; update it" | tee evidence/git_clone.txt
  git -C /home/project/dealer_evaluation_frontend pull --ff-only 2>&1 | tee -a evidence/git_clone.txt
fi
echo
echo "=== Q1: Deploy Python Product Details microservice to Code Engine ==="
if ibmcloud ce application get --name prodlist >/dev/null 2>&1; then
  ibmcloud ce application update --name prodlist --build-source "$BASE/backend/products_list" --port 5000 2>&1 | tee evidence/product_details_deploy.txt
else
  ibmcloud ce application create --name prodlist --build-source "$BASE/backend/products_list" --port 5000 2>&1 | tee evidence/product_details_deploy.txt
fi
PROD_URL="$(ibmcloud ce application get --name prodlist --output url | grep -Eo 'https?://[^[:space:]]+' | head -n 1)"
test -n "$PROD_URL" || { echo "Could not read Product Details URL"; exit 1; }
echo "Product API: $PROD_URL"
echo
echo "=== Q2: Deploy Node.js Dealer Pricing microservice to Code Engine ==="
if ibmcloud ce application get --name dealerpricing >/dev/null 2>&1; then
  ibmcloud ce application update --name dealerpricing --build-source "$BASE/backend/dealer_details" --port 8080 2>&1 | tee evidence/dealer_details_deploy.txt
else
  ibmcloud ce application create --name dealerpricing --build-source "$BASE/backend/dealer_details" --port 8080 2>&1 | tee evidence/dealer_details_deploy.txt
fi
DEALER_URL="$(ibmcloud ce application get --name dealerpricing --output url | grep -Eo 'https?://[^[:space:]]+' | head -n 1)"
test -n "$DEALER_URL" || { echo "Could not read Dealer Pricing URL"; exit 1; }
echo "Dealer API: $DEALER_URL"
echo
echo "=== Q4: Set the frontend's two real API endpoint URLs ==="
# Use real generated Code Engine URLs, never invented placeholders.
python3 - "$BASE/frontend/html/index.html" "$PROD_URL" "$DEALER_URL" <<'PY'
from pathlib import Path
import re
import sys
p = Path(sys.argv[1])
s = p.read_text()
prod, dealer = sys.argv[2].rstrip("/") + "/", sys.argv[3].rstrip("/") + "/"
s, n1 = re.subn(r'let produrl = "[^"]*"', 'let produrl = "' + prod + '"', s)
s, n2 = re.subn(r'let dealerurl = "[^"]*"', 'let dealerurl = "' + dealer + '"', s)
if n1 != 1 or n2 != 1:
    raise SystemExit("Could not find expected frontend API URL assignments")
p.write_text(s)
print('Configured Product API:', prod)
print('Configured Dealer API:', dealer)
PY
grep -n -E 'let (produrl|dealerurl)' frontend/html/index.html | tee evidence/index_urlchanges.txt
echo
echo "=== Q5: Deploy Frontend microservice to Code Engine ==="
if ibmcloud ce application get --name dealerevaluation >/dev/null 2>&1; then
  ibmcloud ce application update --name dealerevaluation --build-source "$BASE/frontend" --port 5001 2>&1 | tee evidence/frontend_deploy.txt
else
  ibmcloud ce application create --name dealerevaluation --build-source "$BASE/frontend" --port 5001 2>&1 | tee evidence/frontend_deploy.txt
fi
FRONTEND_URL="$(ibmcloud ce application get --name dealerevaluation --output url | grep -Eo 'https?://[^[:space:]]+' | head -n 1)"
test -n "$FRONTEND_URL" || { echo "Could not read frontend URL"; exit 1; }
printf '%s\n' "$FRONTEND_URL" > evidence/frontend_url.txt
echo
echo "All three Code Engine deployments finished."
echo "Product API: $PROD_URL"
echo "Dealer API: $DEALER_URL"
echo "FRONTEND: $FRONTEND_URL"
echo
echo "SAVE NINE SCREENSHOTS (real running deployment):"
echo "1 product_details_deploy.png: evidence/product_details_deploy.txt in Terminal"
echo "2 dealer_details_deploy.png: evidence/dealer_details_deploy.txt in Terminal"
echo "3 git_clone.png: evidence/git_clone.txt in Terminal"
echo "4 index_urlchanges.png: frontend/html/index.html showing produrl and dealerurl"
echo "5 frontend_deploy.png: evidence/frontend_deploy.txt in Terminal"
echo "6 homepage.png: Open $FRONTEND_URL and screenshot Product dropdown"
echo "7 product_dealer.png: Select Laptop; screenshot dealer dropdown"
echo "8 product_dealer_price.png: Select Laptop then GH Computers; screenshot price"
echo "9 product_all_dealers_prices.png: Select Laptop then All Dealers; screenshot price table"
echo
echo "Every Terminal log is saved inside $BASE/evidence"
