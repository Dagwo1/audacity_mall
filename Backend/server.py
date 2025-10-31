from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY", "sk_test_your_secret_key")

@app.route("/")
def home():
    return {"message": "Backend is running!"}

@app.route("/pay", methods=["POST"])
def pay():
    data = request.get_json()
    email = data.get("email")
    amount = data.get("amount") * 100  # Paystack uses kobo

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"email": email, "amount": int(amount)}

    response = requests.post(
        "https://api.paystack.co/transaction/initialize",
        json=payload,
        headers=headers
    )
    return jsonify(response.json())

@app.route("/verify/<ref>")
def verify(ref):
    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
    r = requests.get(f"https://api.paystack.co/transaction/verify/{ref}", headers=headers)
    return jsonify(r.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)