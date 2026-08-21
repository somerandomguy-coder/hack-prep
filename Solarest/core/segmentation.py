import os
import io
import math
import base64
import json
import numpy as np
import cv2
from PIL import Image

def segment_rooftop_opencv(image: Image.Image) -> np.ndarray:
    """
    Baseline / Fast OpenCV Heuristic:
    Applies color preprocessing, adaptive thresholding / Otsu, and morphological ops
    to isolate the main rooftop enclosing or closest to the center of the image.
    """
    img_np = np.array(image)
    h, w, _ = img_np.shape
    center_x, center_y = w // 2, h // 2
    
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    
    # Enhance contrast using CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    
    # Blur to reduce noise
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)
    
    # Otsu thresholding
    _, thresh_otsu = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Canny edge detection & dilation to isolate structural polygons
    edges = cv2.Canny(blurred, 50, 150)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    dilated_edges = cv2.dilate(edges, kernel, iterations=2)
    
    # Combined threshold and edge isolation
    if np.any(dilated_edges > 0):
        combined = cv2.bitwise_and(thresh_otsu, cv2.bitwise_not(dilated_edges))
    else:
        combined = thresh_otsu

    # Morphological closing to bridge roof texture gaps
    close_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    closed = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, close_kernel)
    
    # Find contours
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    target_contour = None
    min_dist = float("inf")
    img_area = h * w
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 500 or area > (0.85 * img_area): # Filter out small noise or full-frame bounding box
            continue
            
        # Check if center point is inside contour or calculate distance to center
        dist = cv2.pointPolygonTest(cnt, (center_x, center_y), True)
        if dist >= 0: # Point is inside
            target_contour = cnt
            break
        else:
            # Measure distance from contour centroid to center
            M = cv2.moments(cnt)
            if M["m00"] > 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])
                d = math.hypot(cx - center_x, cy - center_y)
                if d < min_dist:
                    min_dist = d
                    target_contour = cnt

    mask = np.zeros((h, w), dtype=np.uint8)
    if target_contour is not None:
        # Create convex hull for clean rooftop outline polygon
        hull = cv2.convexHull(target_contour)
        cv2.drawContours(mask, [hull], -1, 255, -1)
    else:
        # Fallback bounding box around center if no contour enclosing center
        crop_size = 150
        mask[center_y - crop_size : center_y + crop_size, center_x - crop_size : center_x + crop_size] = 255

    return mask

def segment_rooftop_gemini(image: Image.Image, api_key: str) -> np.ndarray:
    """
    Pluggable AI Vision Layer: Uses Gemini API to detect rooftop polygon coordinates.
    """
    import requests
    
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    b64_img = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    prompt = (
        "Identify the primary main building rooftop located at the center of this satellite image. "
        "Return JSON containing key 'polygon' with a list of 2D pixel coordinates [[x1, y1], [x2, y2], ...] "
        "defining the boundary of the primary roof. Standard image resolution is 600x600 px."
    )
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/jpeg", "data": b64_img}}
            ]
        }],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    
    resp = requests.post(url, json=payload, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    
    text = data['candidates'][0]['content']['parts'][0]['text']
    parsed = json.loads(text)
    polygon = parsed.get("polygon", [])
    
    mask = np.zeros((image.height, image.width), dtype=np.uint8)
    if polygon:
        pts = np.array(polygon, dtype=np.int32)
        cv2.fillPoly(mask, [pts], 255)
        
    return mask

def get_segmenter(method: str = "opencv"):
    """Segmenter factory."""
    if method == "gemini":
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            return lambda img: segment_rooftop_gemini(img, gemini_key)
        else:
            print("[Warning] GEMINI_API_KEY not set. Falling back to OpenCV heuristic.")
    return segment_rooftop_opencv
