#!/bin/sh
# Пересобрать PDF резюме из index.html (печатная версия сайта).
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$(dirname "$0")/assets/akhtarov-vadim-cv.pdf" \
  "file://$(cd "$(dirname "$0")" && pwd)/index.html"
