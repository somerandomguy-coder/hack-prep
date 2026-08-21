import os
import io
import numpy as np
import cv2
from PIL import Image

def estimate_depth_map(image: Image.Image) -> tuple[np.ndarray, Image.Image]:
    """
    Estimates relative elevation / depth map from a single satellite image (Monocular Pseudo-LiDAR).
    
    Returns:
      - depth_raw: 2D numpy array (float32, normalized 0.0 to 1.0 representing relative elevation/height)
      - depth_visual: PIL Image (RGB color-mapped visualization saved as depth_map.png)
    """
    img_np = np.array(image)
    h, w, _ = img_np.shape
    
    # Try PyTorch MiDaS / Depth Anything if torch & timm/transformers are installed
    try:
        import torch
        # Check if PyTorch hub MiDaS_small model can be loaded quickly
        model_type = "MiDaS_small"
        midas = torch.hub.load("intel-isl/MiDaS", model_type, trust_repo=True)
        midas.eval()
        
        midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
        transform = midas_transforms.small_transform if model_type == "MiDaS_small" else midas_transforms.dpt_transform
        
        input_batch = transform(img_np)
        with torch.no_grad():
            prediction = midas(input_batch)
            prediction = torch.nn.functional.interpolate(
                prediction.unsqueeze(1),
                size=(h, w),
                mode="bicubic",
                align_corners=False,
            ).squeeze()
            
        depth_np = prediction.cpu().numpy()
        depth_min, depth_max = depth_np.min(), depth_np.max()
        if depth_max > depth_min:
            depth_normalized = (depth_np - depth_min) / (depth_max - depth_min)
        else:
            depth_normalized = np.zeros((h, w), dtype=np.float32)
            
    except Exception:
        # Fallback: Robust Structural Shadow & Elevation Gradient Simulator (Pseudo-LiDAR)
        # Elevated structures (roofs) produce distinct local shadow gradients, high spatial frequency,
        # and luminance contrast compared to flat ground/lawn.
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        
        # 1. Bilateral filter to preserve roof edges while smoothing background ground
        filtered = cv2.bilateralFilter(gray, 9, 75, 75)
        
        # 2. Local structure tensor & gradient magnitude for surface orientation
        sobelx = cv2.Sobel(filtered, cv2.CV_32F, 1, 0, ksize=3)
        sobely = cv2.Sobel(filtered, cv2.CV_32F, 0, 1, ksize=3)
        grad_mag = cv2.magnitude(sobelx, sobely)
        
        # 3. Morphological top-hat to highlight elevated rooftop structures relative to ground plane
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 25))
        top_hat = cv2.morphologyEx(filtered, cv2.MORPH_TOPHAT, kernel)
        
        # 4. Combine top-hat contrast, local gradient, and luminance elevation signal
        elevation_signal = 0.6 * top_hat.astype(np.float32) + 0.4 * grad_mag
        
        # Gaussian blur for smooth pseudo-LiDAR surface map
        elevation_smooth = cv2.GaussianBlur(elevation_signal, (11, 11), 0)
        
        # Normalize 0.0 to 1.0
        emin, emax = elevation_smooth.min(), elevation_smooth.max()
        if emax > emin:
            depth_normalized = (elevation_smooth - emin) / (emax - emin)
        else:
            depth_normalized = np.zeros((h, w), dtype=np.float32)

    # Convert normalized depth float map to 8-bit colormap (INFERNO / TURBO)
    depth_uint8 = (depth_normalized * 255.0).astype(np.uint8)
    
    # Apply Turbo/Inferno colormap (High elevation = Bright Yellow/Red/White, Low ground = Dark Blue/Black)
    colormap_np = cv2.applyColorMap(depth_uint8, cv2.COLORMAP_TURBO)
    colormap_rgb = cv2.cvtColor(colormap_np, cv2.COLOR_BGR2RGB)
    
    # Overlay semi-transparent height contour lines for LiDAR effect
    contours, _ = cv2.findContours(depth_uint8, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(colormap_rgb, contours, -1, (255, 255, 255), 1)
    
    depth_visual = Image.fromarray(colormap_rgb)
    return depth_normalized, depth_visual

def filter_mask_with_depth(mask: np.ndarray, depth_map: np.ndarray, threshold_percentile: float = 40.0) -> np.ndarray:
    """
    Filters out low-elevation ground/backyard pixels from the rooftop mask
    using the simulated LiDAR depth map.
    """
    if np.sum(mask > 0) == 0:
        return mask
        
    mask_pixels_depth = depth_map[mask > 0]
    cutoff_depth = np.percentile(mask_pixels_depth, threshold_percentile)
    
    refined_mask = mask.copy()
    refined_mask[depth_map < cutoff_depth] = 0
    return refined_mask
