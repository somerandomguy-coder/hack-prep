import numpy as np
from PIL import Image
from core.segmentation import segment_rooftop_opencv

def test_segment_rooftop_opencv():
    # Create a synthetic image with a bright rectangle near center
    arr = np.zeros((600, 600, 3), dtype=np.uint8) + 50
    arr[200:400, 200:400] = 200 # Bright roof square
    img = Image.fromarray(arr)
    
    mask = segment_rooftop_opencv(img)
    assert isinstance(mask, np.ndarray)
    assert mask.shape == (600, 600)
    assert mask.dtype == np.uint8
    # Center pixel should be part of mask (255)
    assert mask[300, 300] == 255
    # Mask count should be close to 200x200 = 40,000 pixels
    pixel_count = np.sum(mask > 0)
    assert 35000 <= pixel_count <= 45000
