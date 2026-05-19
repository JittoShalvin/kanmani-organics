import { useState } from "react";
import {
  Bot,
  Send,
  X,
  Leaf,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

const AIBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "வணக்கம் 🙏 Welcome to Kanmani Organics! Ask anything about our oils, puttu podi, idiyappam flour, nattu sarkarai, health benefits, prices, or suggestions.",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  // AI Style Smart Reply
  const getBotReply = (message: string) => {
    const msg = message.toLowerCase();

    // Oil & Cooking Recommendation
    if (
      msg.includes("best") ||
      msg.includes("cooking") ||
      (msg.includes("which") && msg.includes("oil"))
    ) {
      return `
🍳 All three Kanmani AGMARK Oils are excellent for cooking!

Depending on your dish, here is the best choice:

🥜 Groundnut Oil: Best for deep frying, snacks, and daily cooking (High smoke point).
🌿 Sesame Oil: Best for traditional South Indian meals, tempering, pickles, and idli podi.
🥥 Coconut Oil: Best for healthy daily cooking, traditional dishes, and tempering.

✨ All our oils are Cold Pressed (Wood Pressed) and 100% pure for your family's health.
      `;
    }

    // Sesame Oil
    if (
      msg.includes("sesame") ||
      msg.includes("nallennai")
    ) {
      return `
🌿 Kanmani AGMARK Cold Pressed Sesame Oil

✅ Made from premium sesame seeds
✅ Traditional wood pressed extraction
✅ Rich aroma & authentic taste
✅ Chemical free & preservative free

💚 Best For:
• Traditional cooking
• Idli podi
• Pickles
• Healthy daily meals

📦 Available Sizes:
500ML & 1L

✨ Suggestion:
Use sesame oil for traditional South Indian foods for better taste and nutrition.
      `;
    }

    // Coconut Oil
    if (msg.includes("coconut")) {
      return `
🥥 Kanmani AGMARK Cold Pressed Coconut Oil

✅ AGMARK Certified Purity
✅ Pure cold pressed extraction
✅ Natural aroma preserved
✅ Healthy cooking choice

💚 Uses:
• Cooking & Deep frying
• Hair care & Skin care
• Traditional Ayurvedic usage

📦 Available Sizes:
500ML & 1L
      `;
    }

    // AGMARK Info
    if (msg.includes("agmark") || msg.includes("quality") || msg.includes("certif")) {
      return `
🛡️ What is AGMARK Certification?

AGMARK is a quality certification mark provided by the Government of India. When you buy Kanmani AGMARK products, you are guaranteed:

✅ 100% Purity & Authenticity
✅ Government Verified Quality Standards
✅ No Adulteration (No mixing)
✅ Thoroughly Tested for Health Safety

🌿 Our Sesame, Coconut, Groundnut oils and Nattu Sarkarai are all AGMARK certified to ensure you get only the best traditional nutrition.
      `;
    }

    // Groundnut Oil
    if (msg.includes("groundnut")) {
      return `
🥜 Kanmani AGMARK Groundnut Oil

✅ Traditional wood pressed oil
✅ Rich flavor
✅ Best for deep frying
✅ Nutrient rich & healthy

💚 Perfect For:
• Snacks
• Frying
• Daily cooking

📦 Available Sizes:
500ML & 1L
      `;
    }

    // Puttu Podi
    if (
      msg.includes("puttu") ||
      msg.includes("puttu podi")
    ) {
      return `
🌾 Kanmani Traditional Puttu Podi

✅ Soft texture
✅ Authentic traditional taste
✅ Made from quality rice & millets
✅ Healthy breakfast choice

💚 Available Varieties:
• White Rice Puttu
• Samba Puttu
• Ragi Puttu
• Millet Puttu

📦 Available Sizes:
500G & 1KG
      `;
    }

    // Idiyappam
    if (
      msg.includes("idiyappam") ||
      msg.includes("flour")
    ) {
      return `
🍜 Kanmani Idiyappam Flour

✅ Fine texture flour
✅ Soft & smooth idiyappam
✅ Easy preparation
✅ Traditional quality

💚 Best Served With:
• Coconut milk
• Kurma
• Vegetable stew

📦 Available Sizes:
500G & 1KG
      `;
    }

    // Nattu Sarkarai
    if (
      msg.includes("nattu") ||
      msg.includes("sarkarai") ||
      msg.includes("jaggery")
    ) {
      return `
🍯 Kanmani AGMARK Nattu Sarkarai

✅ Natural sweetener
✅ Made from pure sugarcane juice
✅ No chemicals
✅ Healthier than white sugar

💚 Uses:
• Tea & coffee
• Sweets
• Healthy drinks
• Traditional recipes

✨ Suggestion:
Replace white sugar with Nattu Sarkarai for healthier living.
      `;
    }

    // Suggestion
    if (
      msg.includes("suggest") ||
      msg.includes("healthy")
    ) {
      return `
🌿 Healthy Product Suggestions From Kanmani Organics

🥇 For Cooking:
• Sesame Oil
• Groundnut Oil

🥣 For Breakfast:
• Samba Puttu Podi
• Idiyappam Flour

🍯 For Natural Sweetness:
• Nattu Sarkarai

✨ Our products are traditional, chemical free & healthy for daily use.
      `;
    }

    // Default
    return `
🌿 Thank you for contacting Kanmani Organics.

You can ask about:
• Sesame Oil
• Coconut Oil
• Groundnut Oil
• Puttu Podi
• Idiyappam Flour
• Nattu Sarkarai
• Healthy food suggestions
• Product benefits
• Traditional food usage

✨ Example Questions:
• Which oil is best for cooking?
• Benefits of sesame oil?
• Healthy breakfast products?
• What is Nattu Sarkarai?
    `;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        sender: "user",
      },
    ]);

    setInput("");

    setTimeout(() => {
      const botReply = getBotReply(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          text: botReply,
          sender: "bot",
        },
      ]);
    }, 700);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full
        bg-gradient-to-br from-green-500 via-emerald-500 to-lime-500
        shadow-[0_0_35px_rgba(34,197,94,0.5)]
        hover:scale-110 transition-all duration-300"
      >
        <Bot className="h-8 w-8 text-white" />
      </Button>

      {/* Chat Box */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50
          w-[calc(100vw-32px)] sm:w-[400px] 
          max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)] h-[600px]
          bg-white rounded-[30px]
          overflow-hidden border border-green-200
          shadow-[0_20px_80px_rgba(0,0,0,0.25)]
          flex flex-col"
        >
          {/* Header */}
          <div
            className="bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500
            text-white p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div
                  className="h-12 w-12 rounded-2xl
                  bg-white/20 flex items-center justify-center"
                >
                  <Leaf className="h-7 w-7" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Kanmani Organics
                  </h2>

                  <p className="text-sm text-green-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Healthy Traditional Foods
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4
            bg-gradient-to-b from-[#f7fff8] to-[#eefcf1]"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "bot"
                    ? "justify-start"
                    : "justify-end"
                  }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-md
                  ${msg.sender === "bot"
                      ? "bg-white text-gray-700 border border-green-100"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    }`}
                >
                  <div className="flex gap-2 items-start">
                    {msg.sender === "bot" ? (
                      <Bot className="w-4 h-4 mt-1 text-green-600" />
                    ) : (
                      <User className="w-4 h-4 mt-1 text-white" />
                    )}

                    <span>{msg.text}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Kanmani products..."
                className="h-12 rounded-2xl border-green-200 focus-visible:ring-green-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />

              <Button
                onClick={handleSend}
                className="h-12 w-12 rounded-2xl
                bg-gradient-to-r from-green-500 to-emerald-500
                hover:from-green-600 hover:to-emerald-600"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Sesame Oil",
                "Puttu Podi",
                "Nattu Sarkarai",
                "Healthy Suggestions",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setInput(item)}
                  className="px-3 py-1 text-xs rounded-full
                  bg-green-100 text-green-700 hover:bg-green-200"
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="mt-3 text-center text-[11px] text-gray-400">
              🌿 Powered by Kanmani Natural Foods
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIBot;
