# Shell script to subset fonts, this scripts is run manually and not during build process
# Requirements: Python 3.8, fonttools, zopfli, brotli packages

# common variables
BASE_DIR="./src/fonts"
BASE_LAYOUT_FEATURES="kern,ss01"
ITALIC_LAYOUT_FEATURES="${BASE_LAYOUT_FEATURES},cv05,cv11"

UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

# subset to woff2
pyftsubset "${BASE_DIR}/Inter-Regular.ttf" --output-file="${BASE_DIR}/Inter-Regular-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

pyftsubset "${BASE_DIR}/Inter-Italic.ttf" --output-file="${BASE_DIR}/Inter-Italic-subset.woff2" --flavor="woff2" --layout-features=$ITALIC_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

pyftsubset "${BASE_DIR}/Inter-Bold.ttf" --output-file="${BASE_DIR}/Inter-Bold-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

pyftsubset "${BASE_DIR}/Inter-ExtraBold.ttf" --output-file="${BASE_DIR}/Inter-ExtraBold-subset.woff2" --flavor="woff2" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

# subset to woff
pyftsubset "${BASE_DIR}/Inter-Regular.ttf" --output-file="${BASE_DIR}/Inter-Regular-subset.woff" --flavor="woff" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

pyftsubset "${BASE_DIR}/Inter-Italic.ttf" --output-file="${BASE_DIR}/Inter-Italic-subset.woff" --flavor="woff" --layout-features=$ITALIC_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

pyftsubset "${BASE_DIR}/Inter-Bold.ttf" --output-file="${BASE_DIR}/Inter-Bold-subset.woff" --flavor="woff" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES

pyftsubset "${BASE_DIR}/Inter-ExtraBold.ttf" --output-file="${BASE_DIR}/Inter-ExtraBold-subset.woff" --flavor="woff" --layout-features=$BASE_LAYOUT_FEATURES --no-hinting --desubroutinize --unicodes=$UNICODES
