import numpy as np
from PIL import Image
from core.depth_estimation import estimate_depth_map, filter_mask_with_depth

def test_estimate_depth_map():
    img = Image.new("RGB", (600, 600), color=(120, 120, 120))
    depth_norm, depth_visual = estimate_depth_map(img)
    
    assert isinstance(depth_norm, np.ndarray)
    assert depth_norm.shape == (600, 600)
    assert isinstance(depth_visual, Image.Image)
    assert depth_visual.size == (600, 600)

def test_filter_mask_with_depth():
    mask = np.zeros((600, 600), dtype=np.uint8)
    mask[200:400, 200:400] = 255
    
    depth_map = np.zeros((600, 600), dtype=np.float32)
    depth_map[200:300, 200:400] = 0.8 # High elevation roof
    depth_map[300:400, 200:400] = 0.1 # Low elevation ground
    
    refined = filter_mask_with_depth(mask, depth_map, threshold_percentile=50.0)
    assert isinstance(refined, np.ndarray)
    # High elevation area remains masked
    assert refined[250, 300] == 255
    # Low elevation ground area filtered out (0)
    assert refined[350, 300] == 0
