import cv2
import numpy as np

img = cv2.imread(r'E:\GatorCorp\public\assets\seat-catalog.png', cv2.IMREAD_UNCHANGED)
height, width = img.shape[:2]

# Rough slices (adjusting for a 1024x903 image)
top = img[0:550, 0:width]
mid = img[450:750, 0:width]
bot = img[650:height, 0:width]

cv2.imwrite(r'E:\GatorCorp\public\assets\seat-back.png', top)
cv2.imwrite(r'E:\GatorCorp\public\assets\seat-cushion.png', mid)
cv2.imwrite(r'E:\GatorCorp\public\assets\seat-base.png', bot)
