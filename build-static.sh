#!/bin/sh
# Copies only what the browser needs into ./site (used by Cloudflare Pages / Netlify).
set -e
rm -rf site && mkdir site
cp -r index.html css js assets site/
cp deploy/_headers site/_headers
