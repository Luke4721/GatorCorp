import cv2
import numpy as np
import os

os.makedirs(r'E:\GatorCorp\public\assets\seat_sequence', exist_ok=True)
img = cv2.imread(r'E:\GatorCorp\public\assets\seat-catalog.png', cv2.IMREAD_UNCHANGED)
h, w = img.shape[:2]
center = (w // 2, h // 2)

for i in range(60):
    # Rotate slightly from -10 to +10 degrees just to fake an animation sequence
    angle = -10 + (20 * (i / 59.0))
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(img, M, (w, h), borderValue=(0,0,0,0))
    
    filename = f'seat_{str(i+1).zfill(4)}.png'
    filepath = os.path.join(r'E:\GatorCorp\public\assets\seat_sequence', filename)
    cv2.imwrite(filepath, rotated)

print("Generated 60 frames.")
