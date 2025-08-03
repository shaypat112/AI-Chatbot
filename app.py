from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os

app = Flask(__name__)
CORS(app)

# Load pre-trained DialoGPT-small model
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    # Tokenize and generate reply
    new_input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors="pt")
    chat_history_ids = model.generate(
        new_input_ids,
        max_length=1000,
        pad_token_id=tokenizer.eos_token_id,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.75
    )

    bot_response = tokenizer.decode(chat_history_ids[:, new_input_ids.shape[-1]:][0], skip_special_tokens=True)
    return jsonify({"response": bot_response})

# Unified run block
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # For deployment environments like Heroku or Railway
    app.run(host="0.0.0.0", port=port)
