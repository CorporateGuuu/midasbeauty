#!/bin/bash

# Fix the missing or corrupted images
curl -o images/products/liquid-foundation.jpg "https://images.unsplash.com/photo-1590422749897-47036da0b0ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
curl -o images/products/volumizing-mascara.jpg "https://images.unsplash.com/photo-1631214457419-1a538218d1c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"

# Create a favicon
curl -o images/favicon.ico "https://www.google.com/s2/favicons?domain=sephora.com&sz=64"

echo "Fixed images downloaded successfully!"
