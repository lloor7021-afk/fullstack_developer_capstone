# IBM Skills Network: Product Price Comparison — 9-Task Final Project

This is a working **three-microservice** implementation based on IBM's official Apache-2.0 samples:

- Python Flask Product Details API on port **5000**; endpoints `/products`, `/getdealers/<product>`.
- Node.js Express Dealer Pricing API on port **8080**; endpoints `/price/<dealer>/<product>`, `/allprice/<product>`.
- Python Flask frontend on port **5001**, with a live product dropdown, dealer dropdown, one-dealer price, and all-dealers comparison.

**Sources:** [IBM Backend](https://github.com/ibm-developer-skills-network/dealer_evaluation_backend) and [IBM Frontend](https://github.com/ibm-developer-skills-network/dealer_evaluation_frontend). Original IBM license retained.

## Easiest method in the IBM Skills Network Cloud IDE

Open **Terminal → New Terminal** in the Code Engine lab (not your local phone terminal). Paste these two commands:

```bash
curl -fsSL https://raw.githubusercontent.com/lloor7021-afk/github-final-project/main/microservices-price-comparison/deploy_lab.sh -o /home/project/deploy_microservices.sh
bash /home/project/deploy_microservices.sh
```

The script deploys three actual applications to the authenticated Code Engine project provided by IBM Skills Network. It clones the official frontend, deploys the two backend APIs, replaces the frontend API URL placeholders with your *actual* Code Engine endpoint URLs, and deploys the frontend. It saves the CLI outputs under `/home/project/github-final-project/microservices-price-comparison/evidence/`.

**Do not claim deployment is complete until the real Code Engine commands succeed.** If a command errors, the script stops and shows the error.

## Screenshot map (all nine questions require actual image uploads)

| Question | Filename (png) | Screenshot subject |
|---|---|---|
| 1 | `product_details_deploy.png` | Code Engine CLI output from deploying Product Details (Python) |
| 2 | `dealer_details_deploy.png` | Code Engine CLI output from deploying Dealer Pricing (Node.js) |
| 3 | `git_clone.png` | Actual terminal output of `git clone` for IBM frontend |
| 4 | `index_urlchanges.png` | Frontend `html/index.html` showing the *real* `produrl` and `dealerurl` |
| 5 | `frontend_deploy.png` | Code Engine CLI output from frontend deployment |
| 6 | `homepage.png` | Running frontend with product dropdown (Headphones, Laptop, Mouse, Printer) |
| 7 | `product_dealer.png` | Select Laptop and show three dealer choices |
| 8 | `product_dealer_price.png` | Select Laptop, then GH Computers; price displayed |
| 9 | `product_all_dealers_prices.png` | Select Laptop, then All Dealers; prices table displayed |

Images must be taken from your **actual Code Engine service/IDE** after successful deployment; no pre-generated or simulated deployment images are included.

Run `ibmcloud ce application list` to check all three apps and `cat evidence/frontend_url.txt` for the frontend URL.

### Runtime checks

After deployment:

```bash
curl -fsSL "$(ibmcloud ce application get -n prodlist -o url)/products"
curl -fsSL "$(ibmcloud ce application get -n prodlist -o url)/getdealers/Laptop"
curl -fsSL "$(ibmcloud ce application get -n dealerpricing -o url)/price/GH%20Computers/Laptop"
curl -fsSL "$(ibmcloud ce application get -n dealerpricing -o url)/allprice/Laptop"
```

### Notes

- IBM Skills Network Cloud IDE provides credentials and one Code Engine project; do not create a new project.
- You can rerun the script; it uses `application update` if the app already exists.
- Using a real deployed URL rather than `localhost` is necessary because the browser calls the backend APIs directly.
- Your Lab environment may have execution limits. The script creates and updates resources only in the current selected Code Engine project.
