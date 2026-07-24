import os
import time
import requests
import base64
import numpy as np
from PIL import Image
from io import BytesIO

class AIAnalysisService:
    def __init__(self):
        self.api_host = "https://api.stability.ai"
        self.engine_id = "stable-diffusion-xl-1024-v1-0"
        print("[AI Service] Initialized Cloud AI Generation Mode (Stability API)")

    def get_full_catalog(self, style):
        catalog = {
            "modern": [
                {"id": "m1", "name": "Modern Minimalist Sofa", "brand": "DesignHouse", "price": 1299, "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "m2", "name": "Glass & Chrome Coffee Table", "brand": "Lumina", "price": 450, "image_url": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "m3", "name": "Abstract Geometric Rug", "brand": "Artisan", "price": 320, "image_url": "https://images.unsplash.com/photo-1574862361099-041441c2c31e?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "m4", "name": "Matte Black Floor Lamp", "brand": "Lumina", "price": 199, "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "m5", "name": "Leather Lounge Chair", "brand": "Elegance", "price": 850, "image_url": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "m6", "name": "Floating Oak TV Unit", "brand": "WoodCraft", "price": 600, "image_url": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "m7", "name": "Modern Abstract Canvas", "brand": "Artisan", "price": 250, "image_url": "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "m8", "name": "Brass Pendant Light", "brand": "Lumina", "price": 299, "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800", "link": "#"}
            ],
            "minimalist": [
                {"id": "min1", "name": "White Linen Loveseat", "brand": "Zenith", "price": 999, "image_url": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "min2", "name": "Oak Wood Side Table", "brand": "Nordic", "price": 250, "image_url": "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "min3", "name": "Wabi-Sabi Ceramic Vase", "brand": "Artisan", "price": 85, "image_url": "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "min4", "name": "Low Profile Platform Bed", "brand": "Zenith", "price": 1100, "image_url": "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "min5", "name": "Monochrome Throw Blanket", "brand": "CozyHome", "price": 120, "image_url": "https://images.unsplash.com/photo-1580828369019-2228b770af11?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "min6", "name": "Minimalist Wall Clock", "brand": "Nordic", "price": 95, "image_url": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800", "link": "#"}
            ],
            "scandinavian": [
                {"id": "s1", "name": "Grey Fabric Modular Sofa", "brand": "Nordic", "price": 1499, "image_url": "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "s2", "name": "Light Birch Wood Chair", "brand": "Nordic", "price": 350, "image_url": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "s3", "name": "Fluffy White Shag Rug", "brand": "CozyHome", "price": 199, "image_url": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "s4", "name": "Potted Ficus Plant", "brand": "Greenery", "price": 150, "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "s5", "name": "Rattan Basket Set", "brand": "Artisan", "price": 80, "image_url": "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800", "link": "#"},
                {"id": "s6", "name": "Tripod Floor Lamp", "brand": "Lumina", "price": 220, "image_url": "https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&q=80&w=800", "link": "#"}
            ]
        }
        style_key = style.lower()
        if style_key not in catalog:
            style_key = "modern"
        return catalog[style_key]

    def get_catalog_items(self, style):
        import random
        # Pick 2-3 items randomly to feature in the room
        items = self.get_full_catalog(style)
        num_items = min(len(items), random.choice([2, 3]))
        selected_items = random.sample(items, num_items)
        return selected_items

    def analyze_room(self, image_bytes, style_preference, budget_tier):
        """
        Processes the uploaded image bytes using Stability AI's REST API.
        """
        print("[AI Service] Connecting to Cloud API (In-Memory Processing)...")

        # 1. Check for Replicate API Key
        api_key = os.environ.get('REPLICATE_API_TOKEN')
        if not api_key:
            raise EnvironmentError("AI generation is unavailable: Missing REPLICATE_API_TOKEN in Vercel environment variables. Please add your Replicate token.")

        try:
            # 2. Read and analyze the original image for basic stats
            img = Image.open(BytesIO(image_bytes)).convert('RGB')
            img_array = np.array(img)
            avg_brightness = np.mean(img_array)
            std_contrast = np.std(img_array)
            
            recommendations = []
            if avg_brightness < 100:
                recommendations.append("The room is quite dark. Consider adding more ambient lighting.")
                layout_score = 70
            elif avg_brightness > 200:
                recommendations.append("The room is very bright. Consider adding window treatments to balance it.")
                layout_score = 85
            else:
                recommendations.append("Good natural lighting detected. Enhance it with well-placed mirrors.")
                layout_score = 92
                
            if std_contrast < 40:
                recommendations.append("The space lacks visual depth. Add contrasting textures or a bold accent piece.")
            
            recommendations.append(f"Apply a {style_preference} theme to unify the architectural elements.")
            
            # PROMPT INJECTION: Select catalog items to force into the AI generation
            featured_items = self.get_catalog_items(style_preference)
            furniture_prompt = ", ".join([item['name'] for item in featured_items])
            print(f"[AI Service] Prompt Injecting Catalog Items: {furniture_prompt}")
            
            # 3. Prepare Image for API
            w, h = img.size
            min_dim = min(w, h)
            left = (w - min_dim) / 2
            top = (h - min_dim) / 2
            right = (w + min_dim) / 2
            bottom = (h + min_dim) / 2
            img = img.crop((left, top, right, bottom))
            img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
            
            # Save to buffer and create base64 Data URI
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            data_uri = f"data:image/png;base64,{image_base64}"
            
            print("[AI Service] Sending request to Replicate Cloud...")
            
            # 4. Call Replicate API
            headers = {
                "Authorization": f"Token {api_key}",
                "Content-Type": "application/json"
            }
            
            prediction_data = {
                "version": "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", # SDXL 1.0
                "input": {
                    "prompt": f"Breathtaking professional interior design of a {style_preference} room, perfectly preserve original room layout, exact same camera angle, exact same architecture, fully furnished featuring {furniture_prompt}, luxurious staging, cinematic lighting, 8k resolution, masterpiece, photorealistic",
                    "negative_prompt": "altered architecture, changed room shape, different camera angle, empty room, barren, unfurnished, low quality, ugly, blurry, poorly drawn, distorted, messy, unrealistic",
                    "image": data_uri,
                    "prompt_strength": 0.75,
                    "num_inference_steps": 25 # Lowered to 25 to ensure fast response (Vercel has a 10s timeout on hobby tier)
                }
            }
            
            response = requests.post(
                "https://api.replicate.com/v1/predictions",
                headers=headers,
                json=prediction_data
            )
            
            if response.status_code != 201:
                raise RuntimeError(f"Replicate API rejected the request. Check your API key. (Status {response.status_code}): {response.text}")
                
            prediction = response.json()
            get_url = prediction["urls"]["get"]
            
            # 5. Poll for completion
            output_url = None
            for _ in range(15): # Max 15 loops (approx 15 seconds)
                import time
                time.sleep(1)
                poll_resp = requests.get(get_url, headers=headers)
                poll_data = poll_resp.json()
                status = poll_data.get("status")
                
                if status == "succeeded":
                    output_url = poll_data["output"][0]
                    break
                elif status == "failed":
                    raise RuntimeError("Replicate AI generation failed.")
            
            if not output_url:
                raise RuntimeError("AI Generation timed out after 15 seconds.")
                
            # Fetch the resulting image and encode as base64 so it matches the frontend expectations
            final_img_resp = requests.get(output_url)
            final_base64 = base64.b64encode(final_img_resp.content).decode('utf-8')
            output_image_url = f"data:image/png;base64,{final_base64}"
            
            print("[AI Service] Cloud generation successful via Replicate!")
            
        except Exception as e:
            print(f"Exception during cloud inference: {e}")
            raise RuntimeError(f"Failed to process uploaded image: {str(e)}")

        analysis_result = {
            "layout_score": layout_score,
            "output_image_url": output_image_url,
            "detected_objects": [
                {"label": "wall", "confidence": 0.99},
                {"label": "floor", "confidence": 0.95}
            ],
            "style_suggestions": recommendations,
            "shop_items": featured_items, # Pass the exactly injected items to the frontend/database
            "estimated_cost_to_upgrade": {
                "low": 500,
                "medium": 1500,
                "high": 3500
            }.get(budget_tier, 1000)
        }
        
        return analysis_result

ai_service = AIAnalysisService()
