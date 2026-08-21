import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
from core.solar_math import SolarEstimate

def annotate_solar_feasibility(
    base_image: Image.Image,
    mask: np.ndarray,
    address: str,
    lat: float,
    lng: float,
    resolution: float,
    estimate: SolarEstimate
) -> Image.Image:
    """
    Overlays a semi-transparent green mask on the segmented rooftop,
    draws roof contour outlines, and adds a HUD panel displaying key metrics.
    """
    img_np = np.array(base_image).copy()
    h, w, _ = img_np.shape
    
    # 1. Overlay semi-transparent green mask (35% opacity)
    green_overlay = img_np.copy()
    green_overlay[mask > 0] = [0, 230, 115] # Bright solar green
    cv2.addWeighted(green_overlay, 0.35, img_np, 0.65, 0, img_np)
    
    # 2. Draw roof contour outline
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(img_np, contours, -1, (0, 255, 128), 2)
    
    # Convert back to PIL for crisp text rendering
    pil_annotated = Image.fromarray(img_np)
    draw = ImageDraw.Draw(pil_annotated, "RGBA")
    
    # 3. Draw HUD box top-left
    hud_width, hud_height = 360, 175
    hud_x, hud_y = 15, 15
    
    # Semi-transparent dark box background
    draw.rectangle(
        [hud_x, hud_y, hud_x + hud_width, hud_y + hud_height],
        fill=(15, 23, 42, 220), # Dark slate background
        outline=(56, 189, 248, 255), # Cyan border
        width=2
    )
    
    # Text lines
    lines = [
        f"SOLAR FEASIBILITY ESTIMATE",
        f"Location: {lat:.4f} N, {lng:.4f} W",
        f"Ground Res: {resolution:.3f} m/px (z=19)",
        f"Est. Roof Area: {estimate.raw_roof_area} m2",
        f"Usable Solar Area: {estimate.usable_roof_area} m2",
        f"Max 400W Panels: {estimate.max_panels} units",
        f"Peak System Size: {estimate.system_capacity_kw} kW"
    ]
    
    y_offset = hud_y + 10
    for i, line in enumerate(lines):
        color = (56, 189, 248, 255) if i == 0 else (241, 245, 249, 255)
        draw.text((hud_x + 12, y_offset), line, fill=color)
        y_offset += 22

    # 4. Draw Scale Bar bottom-right
    scale_m = 10.0 # 10 meters scale bar
    scale_px = int(scale_m / resolution)
    sb_x2 = w - 20
    sb_x1 = sb_x2 - scale_px
    sb_y = h - 25
    
    draw.line([(sb_x1, sb_y), (sb_x2, sb_y)], fill=(255, 255, 255, 255), width=3)
    draw.line([(sb_x1, sb_y - 4), (sb_x1, sb_y + 4)], fill=(255, 255, 255, 255), width=2)
    draw.line([(sb_x2, sb_y - 4), (sb_x2, sb_y + 4)], fill=(255, 255, 255, 255), width=2)
    draw.text((sb_x1 + (scale_px // 4), sb_y - 18), f"{int(scale_m)} m", fill=(255, 255, 255, 255))
    
    return pil_annotated
